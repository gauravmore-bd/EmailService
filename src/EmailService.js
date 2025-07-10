class EmailService {
    constructor(providers) {
        this.providers = providers;
        this.sentKeys = new Set(); // For idempotency
        this.statusMap = {}; // For tracking status
        this.rateLimiter = new RateLimiter(); // Default: 5/min
    }

    async send(email, idempotencyKey) {
        if (this.sentKeys.has(idempotencyKey)) {
            return {
                success: false,
                message: "Duplicate request blocked by idempotency"
            };
        }

        const rateLimitPassed = this.rateLimiter.isAllowed(email.to);
        if (!rateLimitPassed) {
            this.statusMap[idempotencyKey] = {
                status: "failed",
                reason: "Rate limited",
                timestamp: new Date(),
            };
            return {
                success: false,
                error: "Rate limit exceeded. Try again later."
            };
        }

        this.sentKeys.add(idempotencyKey);

        const startTime = Date.now();
        const status = {
            status: "failed",
            provider: null,
            attempts: 0,
            errors: [],
            timestamp: new Date(),
            durationMs: null
        };

        for (let provider of this.providers) {
            for (let attempt = 0; attempt < 3; attempt++) {
                try {
                    status.attempts++;
                    const result = await provider.sendEmail(email);
                    if (result.success) {
                        status.status = "success";
                        status.provider = provider.name;
                        status.durationMs = Date.now() - startTime;
                        this.statusMap[idempotencyKey] = status;
                        return {
                            success: true,
                            provider: provider.name
                        };
                    }
                } catch (err) {
                    status.errors.push(err.message || "Unknown error");
                    await this.wait(2 ** attempt * 1000); // Exponential backoff
                }
            }
        }

        status.durationMs = Date.now() - startTime;
        this.statusMap[idempotencyKey] = status;

        return {
            success: false,
            error: "All providers failed after retries"
        };
    }

    getStatus(key) {
        return this.statusMap[key] || null;
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

class RateLimiter {
    constructor(limit = 5, interval = 60000) {
        this.limit = limit;
        this.interval = interval;
        this.requests = {};
    }

    isAllowed(identifier) {
        const now = Date.now();
        if (!this.requests[identifier]) {
            this.requests[identifier] = [];
        }

        this.requests[identifier] = this.requests[identifier].filter(ts => now - ts < this.interval);
        if (this.requests[identifier].length >= this.limit) {
            return false;
        }

        this.requests[identifier].push(now);
        return true;
    }
}

module.exports = EmailService;