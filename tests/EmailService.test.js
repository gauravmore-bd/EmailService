const EmailService = require('../src/EmailService');
jest.setTimeout(15000);


class AlwaysFailProvider {
    async sendEmail() {
        throw new Error("Provider failed");
    }
}

class AlwaysSuccessProvider {
    constructor(name = "SuccessProvider") {
        this.name = name;
    }

    async sendEmail(email) {
        return { success: true, provider: this.name };
    }
}

describe("EmailService", () => {
    let emailService;

    beforeEach(() => {
        const providers = [new AlwaysSuccessProvider()];
        emailService = new EmailService(providers);
    });

    test("should send email successfully with a working provider", async() => {
        const result = await emailService.send({ to: "test@example.com", subject: "Hi", body: "Hello" },
            "idempotent-1"
        );

        expect(result.success).toBe(true);
        expect(result.provider).toBe("SuccessProvider");
    });

    test("should block duplicate send using idempotency key", async() => {
        const email = { to: "test@example.com", subject: "Test", body: "Hello" };
        const key = "dup-key";

        const first = await emailService.send(email, key);
        const second = await emailService.send(email, key);

        expect(first.success).toBe(true);
        expect(second.message).toBe("Duplicate request blocked by idempotency");
    });

    test("should fallback to second provider if first fails", async() => {
        const providers = [
            new AlwaysFailProvider(),
            new AlwaysSuccessProvider("FallbackProvider")
        ];
        emailService = new EmailService(providers);

        const result = await emailService.send({ to: "user@fail.com", subject: "Fallback", body: "Try again" },
            "fallback-key"
        );

        expect(result.success).toBe(true);
        expect(result.provider).toBe("FallbackProvider");
    });

    test("should return rate limit error after 5 requests", async() => {
        const email = { to: "ratelimit@test.com", subject: "Rate", body: "Check" };

        for (let i = 0; i < 5; i++) {
            await emailService.send(email, `rate-key-${i}`);
        }

        const result = await emailService.send(email, "rate-key-6");

        expect(result.success).toBe(false);
        expect(result.error).toBe("Rate limit exceeded. Try again later.");
    });
});