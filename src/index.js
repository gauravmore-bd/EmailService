const express = require('express');
const EmailService = require('./EmailService');
const MockProvider1 = require('./providers/MockProvider1');
const MockProvider2 = require('./providers/MockProvider2');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const service = new EmailService([
    new MockProvider1(),
    new MockProvider2()
]);

app.post('/send-email', async(req, res) => {
    const { to, subject, body, idempotencyKey } = req.body;

    if (!to || !subject || !body || !idempotencyKey) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await service.send({ to, subject, body }, idempotencyKey);
    res.json(result);
});

app.get("/status/:id", (req, res) => {
    const status = service.getStatus(req.params.id); // ✅ FIXED
    if (!status) {
        return res.status(404).json({ error: "Idempotency key not found" });
    }
    res.json(status);
});

app.listen(port, () => {
    console.log(`Email service running at http://localhost:${port}`);
});