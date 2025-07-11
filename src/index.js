const express = require('express');
const EmailService = require('./EmailService');
const MockProvider1 = require('./providers/MockProvider1');
const MockProvider2 = require('./providers/MockProvider2');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: "This project was submitted for an interview assignment. Contact gauravmore33444@gmail.com for access or questions."
    });
});

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
    const status = service.getStatus(req.params.id);
    if (!status) {
        return res.status(404).json({ error: "Idempotency key not found" });
    }
    res.json(status);
});

app.use((req, res) => {
    res.status(404).json({
        error: "Route not found. Please refer to the documentation or contact for support."
    });
});

app.listen(port, () => {
    console.log(`Email service running at http://localhost:${port}`);
});