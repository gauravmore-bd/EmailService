class MockProvider2 {
    constructor(name = "MockProvider2") {
        this.name = name;
    }

    async sendEmail(email) {
        // Simulate 80% success
        if (Math.random() < 0.8) {
            return { success: true, provider: this.name };
        } else {
            throw new Error(`${this.name} failed to send email`);
        }
    }
}

module.exports = MockProvider2;