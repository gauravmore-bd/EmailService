class RateLimiter {
    constructor(limit = 5, windowMs = 60 * 1000) {
        this.limit = limit;
        this.windowMs = windowMs;
        this.users = new Map();
    }

    isAllowed(email) {
        const now = Date.now();
        const windowStart = now - this.windowMs;

        if (!this.users.has(email)) {
            this.users.set(email, []);
        }

        const timestamps = this.users.get(email).filter(ts => ts > windowStart);

        if (timestamps.length >= this.limit) {
            return false;
        }

        timestamps.push(now);
        this.users.set(email, timestamps);
        return true;
    }

    getRemaining(email) {
        const now = Date.now();
        const windowStart = now - this.windowMs;
        const timestamps = (this.users.get(email) || []).filter(ts => ts > windowStart);
        return this.limit - timestamps.length;
    }
}

module.exports = RateLimiter;