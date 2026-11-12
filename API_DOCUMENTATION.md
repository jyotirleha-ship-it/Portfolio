# THE DIGITAL UNIVERSE — REST API SPECIFICATION
**Author:** Jyotir Leha R  
**Base URL:** `http://localhost:5000/api` (Production: `https://your-render-backend.onrender.com/api`)  
**Format:** JSON  

---

## 1. System Health
### `GET /api/health`
Checks server and API status.

**Response (200 OK):**
```json
{
  "status": "online",
  "system": "The Digital Universe — Jyotir Leha Portfolio API",
  "timestamp": "2026-11-04T18:00:00.000Z",
  "environment": "development"
}
```

---

## 2. Public Portfolio Content
### `GET /api/portfolio/bundle`
Returns a unified JSON payload containing the complete portfolio content for initial fast rendering.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "profile": {
      "name": "Jyotir Leha R",
      "brandMark": "JL",
      "title": "Full Stack Developer | Blockchain Enthusiast | Software Developer",
      "bio": "...",
      "location": "Thoothukudi, Tamil Nadu, India",
      "college": "National Engineering College, Kovilpatti",
      "degree": "B.E Computer Science and Engineering (Class of 2028)",
      "email": "jyotirleha@gmail.com",
      "github": "https://github.com/jyotirleha-ship-it",
      "linkedin": "https://www.linkedin.com/in/jyotir-leha-r-7971a232a/"
    },
    "projects": [ ... ],
    "skills": [ ... ],
    "achievements": [ ... ],
    "certifications": [ ... ],
    "experience": [ ... ],
    "education": [ ... ]
  }
}
```

---

## 3. Dynamic Projects API
### `GET /api/projects`
List all portfolio projects with optional query filters (`category`, `featured`, `status`).

### `GET /api/projects/:projectId`
Retrieve single project by slug/id.

### `POST /api/projects` *(Admin Protected)*
Create a new project. Recomputes canonical SHA-256 hash automatically.
**Headers:** `Authorization: Bearer <JWT>`
**Request Body:**
```json
{
  "projectId": "smart-agri-iot",
  "title": "Smart Agriculture IoT System",
  "tagline": "Connected soil sensors and cloud telemetry",
  "description": "An IoT-based agricultural monitoring system...",
  "category": "IoT",
  "technologies": ["IoT", "JavaScript", "Cloud"],
  "version": "1.0.0",
  "githubUrl": "https://github.com/jyotirleha-ship-it",
  "featured": true
}
```

### `PUT /api/projects/:projectId` *(Admin Protected)*
Update existing project. Recalculates SHA-256 hash.

### `DELETE /api/projects/:projectId` *(Admin Protected)*
Permanently remove a project.

---

## 4. Blockchain Verification
### `POST /api/blockchain/verify`
Verify project cryptographic hash against current canonical state and Ethereum Sepolia smart contract.

**Request Body:**
```json
{
  "projectId": "online-shopping-cart",
  "testHash": "optional_hex_hash"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "projectId": "online-shopping-cart",
    "title": "Online Shopping Cart REST API",
    "version": "1.2.0",
    "canonicalHash": "8f2c3b8e4f1a9d7c6b5a4e3f2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c",
    "hashMatchesCurrentContent": true,
    "onChainRegistered": true,
    "status": "Verified On-Chain",
    "txHash": "0x8f2c3b8e...",
    "contractAddress": "0x...",
    "network": "Ethereum Sepolia",
    "explorerUrl": "https://sepolia.etherscan.io/tx/0x..."
  }
}
```

### `POST /api/blockchain/register` *(Admin Protected)*
Submit a project's canonical content hash to the `PortfolioProjectRegistry` smart contract on Ethereum Sepolia.

### `GET /api/blockchain/history`
Public audit log of all on-chain registration events.

---

## 5. AI Portfolio Chatbot (Leha AI)
### `POST /api/chat`
Ask questions regarding Jyotir's education, projects, skills, certificates, and background.
Integrates Google Gemini 2.5 Flash with live MongoDB context and graceful local fallback.

**Request Body:**
```json
{
  "message": "What projects has Jyotir built in Java and Spring Boot?",
  "history": []
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "reply": "Jyotir Leha R engineered the **Online Shopping Cart REST API** using Spring Boot, Java, and MySQL, with clean multi-tier architecture...",
  "source": "gemini-ai"
}
```

---

## 6. Contact Inquiries
### `POST /api/contact`
Submit an inquiry or recruiter message. Includes honeypot spam protection.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@techcorp.com",
  "subject": "Summer 2027 Software Engineering Internship",
  "message": "We were impressed by your blockchain portfolio and would love to connect."
}
```

### `GET /api/contact` *(Admin Protected)*
List all contact inquiries.

### `PATCH /api/contact/:id/read` *(Admin Protected)*
Mark message as read.

### `DELETE /api/contact/:id` *(Admin Protected)*
Delete inquiry.

---

## 7. Authentication
### `POST /api/auth/login`
Admin authentication returning signed JWT token (expires in 7 days).

**Request Body:**
```json
{
  "email": "jyotirleha@admin.universe",
  "password": "YourSecurePassword"
}
```
