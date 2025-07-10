class MockProvider1 {
    constructor(name = "MockProvider1") {
        this.name = name;
    }

    async sendEmail(email) {
        // Simulate 70% success
        if (Math.random() < 0.7) {
            return { success: true, provider: this.name };
        } else {
            throw new Error(`${this.name} failed to send email`);
        }
    }
}

module.exports = MockProvider1;