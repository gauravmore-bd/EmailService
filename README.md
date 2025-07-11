# 📧 Resilient Email Sending Service

This project implements a fault-tolerant, idempotent email sending service in **JavaScript (Node.js)** with features like retry logic, rate limiting, fallback between providers, and status tracking.

> ✅ Built with clean code, SOLID principles, minimal dependencies, and full test coverage using Jest.

---

## 🚀 Features

- ✅ **Retry Mechanism** with exponential backoff  
- ✅ **Fallback Between Providers**  
- ✅ **Idempotency** to prevent duplicate sends  
- ✅ **Rate Limiting** (default: 5 emails/minute per recipient)  
- ✅ **Status Tracking** (attempts, provider used, duration, errors)  
- ✅ **Mock Providers** used for testing logic  
- ✅ **Unit Tests** with full coverage using Jest

---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **Jest** (for testing)

---

## 📁 Folder Structure
```bash
EmailService/
├── src/
│ ├── EmailService.js # Core logic
│ ├── index.js # Express API server
│ └── providers/
│ ├── ProviderA.js
│ ├── ProviderB.js
├── tests/
│ └── EmailService.test.js # Jest test suite
├── package.json
└── README.md
```
---

## 📦 Installation & Setup

```bash
# Clone the repo
git clone https://github.com/your-username/emailservice.git
cd emailservice

# Install dependencies
npm install

# Start server
npm run dev
# Server runs at http://localhost:3000

```
---

📮 API Endpoints
POST /send-email
Send a new email.

Request Body:
```bash
{
  "to": "user@example.com",
  "subject": "Hello",
  "body": "Welcome to the platform!",
  "idempotencyKey": "unique-key-123"
}
```

Response:
```bash
{
  "success": true,
  "provider": "ProviderB"
}

```
---

GET /status/:idempotencyKey
Get status of an email send attempt.

Example:
```bash
GET /status/unique-key-123
```
Response:
```bash
{
  "status": "success",
  "provider": "ProviderB",
  "attempts": 2,
  "errors": ["timeout", "fail"],
  "timestamp": "2025-07-10T10:23:00Z",
  "durationMs": 4500
}
```
---

### ✅ Running Tests
```bash
npm test
```
---

### ✔ All critical features are covered:

- Success with working provider
- Fallback logic
- Idempotency blocking
- Rate limiting
- Status tracking

---

### ✅ Assumptions
- Email sending is mocked (no real SMTP/API used)

- Rate limit: 5 emails/min per recipient

- Retry: 3 attempts with exponential backoff

- Idempotency uses a simple in-memory Set (can be replaced with Redis)

- Status is kept in memory for simplicity

---

### ✨ Bonus Features (Optional Enhancements)
- Circuit breaker logic (disable failing provider)

- Persistent queue system (for retries)

- Logging middleware

- Dashboard or metrics API

---

## ☁️ Deployment Info
This project is deployed on Render.
```bash
🔗 Live API URL: https://emailservice-iqnb.onrender.com
```
- The API is hosted on Render’s free tier and may sleep after 15 minutes of inactivity.
- Once visited, it may take ~30 seconds to wake up.
- The API will remain live during the interview process.
- Afterward, it may return a static message like:

```bash
json
{
  "message": "This project was submitted for an interview assignment. Contact me for access."
}
```
---
## 👤 Author

**Gaurav More**  
JavaScript Backend Developer  


- [LinkedIn](https://www.linkedin.com/in/gauravmore12)
- [GitHub](https://github.com/gauravmore-bd)
- [Email](mailto:gauravmore33444@gmail.com)
---