# 🌌 THE DIGITAL UNIVERSE — JYOTIR LEHA R
### Premium, Futuristic, Blockchain-Powered Full-Stack Developer Portfolio

[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-blue?logo=react)](https://react.dev)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green?logo=node.js)](https://nodejs.org)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-brightgreen?logo=mongodb)](https://www.mongodb.com/atlas)
[![Blockchain](https://img.shields.io/badge/Blockchain-Ethereum%20Sepolia-purple?logo=ethereum)](https://sepolia.etherscan.io)
[![AI](https://img.shields.io/badge/AI%20Assistant-Gemini%202.5%20Flash-orange?logo=google)](https://aistudio.google.com)
[![Status](https://img.shields.io/badge/License-MIT-teal.svg)](LICENSE)

---

## 🌟 Overview & Design Philosophy

**"THE DIGITAL UNIVERSE — JYOTIR LEHA"** is a full-stack, Web3-integrated personal portfolio platform engineered for **Jyotir Leha R**, an undergraduate Computer Science Engineering student at **National Engineering College, Kovilpatti** (Class of 2028).

Rather than a static frontend template, this platform is an interactive, enterprise-grade distributed system featuring:
1. **Interactive Constellation Canvas:** Real-time 60fps particle physics with cursor gravity and mobile-responsive autonomous drifting.
2. **Dynamic Content Engine:** All 10 portfolio sections are populated from **MongoDB Atlas** through secure Node.js/Express REST APIs.
3. **On-Chain Project Verification:** Solidity smart contract (`PortfolioProjectRegistry`) on **Ethereum Sepolia** storing deterministic SHA-256 hashes of project content, allowing visitors and recruiters to cryptographically verify code integrity.
4. **"Leha AI — Your Portfolio Assistant":** A floating conversational AI assistant powered by the Google **Gemini 2.5 Flash API** using real-time MongoDB portfolio context with intelligent offline fallback.
5. **Full Admin Control Center:** Role-based JWT + bcrypt protected dashboard allowing dynamic CRUD of projects, versions, skills, and contact inquiries.
6. **Preserved Authentic Identity:** Incorporates all original credentials, including the **Database Design Award 2026**, **H7CTF 2025** international participation, **HI-TECH FEST 2026 Decryptor** honor, **IEEE Code Spring 2.0**, and 16+ verified certificates.

---

## 🏗️ Architecture

```
                                 +-----------------------+
                                 |  Visitor / Recruiter  |
                                 +-----------+-----------+
                                             |
                   +-------------------------+-------------------------+
                   |                                                   |
                   v                                                   v
      +-------------------------+                         +-------------------------+
      |  React 18 + Vite (SPA)  |                         | Web3 Wallet (MetaMask)  |
      |   "THE DIGITAL UNIVERSE"|                         | (Sepolia Testnet RPC)   |
      +------------+------------+                         +------------+------------+
                   |                                                   |
      REST Calls   | (JWT / JSON)                          Ethers.js   | Contract Calls
                   v                                                   v
      +-------------------------+                         +-------------------------+
      | Express.js API Server   |                         | PortfolioProjectRegistry|
      | Rate Limiter / Helmet   |                         |  (Solidity 0.8.20 EVM)  |
      +------------+------------+                         +-------------------------+
                   |
         +---------+---------+
         |                   |
         v                   v
+------------------+  +------------------+
|  MongoDB Atlas   |  | Gemini 2.5 Flash |
|  Mongoose Models |  | AI Chat Assistant|
+------------------+  +------------------+
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js:** v18.0.0 or later (v24.14.0 recommended)
- **npm:** v9.0.0 or later
- **MongoDB Atlas Connection URI** (or local persistent JSON mode)
- *(Optional)* MetaMask for on-chain Web3 interaction
- *(Optional)* Google Gemini API Key from [AI Studio](https://aistudio.google.com/)

---

### 1. Smart Contract Setup & Tests (Blockchain)
```bash
cd blockchain
npm install

# Compile Solidity Smart Contracts
npx hardhat compile

# Run Hardhat Test Suite
npx hardhat test

# Optional: Deploy to Ethereum Sepolia
npx hardhat run scripts/deploy.js --network sepolia
```

---

### 2. Backend Server & Database Seed
```bash
cd ../backend
npm install

# Configure environment variables
cp .env.example .env

# Populate database with Jyotir Leha's authentic portfolio content
npm run seed:portfolio

# Create administrator account (supports --email, --password, or random generation)
npm run seed:admin

# Start backend server
npm start
# Server runs on: http://localhost:5000
```

---

### 3. Frontend Client
```bash
cd ../frontend
npm install

# Launch Vite development server
npm run dev
# Public Portfolio: http://localhost:5173
```

---

## 🔒 Security Architecture
- **Password Security:** Salted hashes generated using `bcryptjs` (10 rounds).
- **Session Tokens:** Stateless, signed JSON Web Tokens (`jsonwebtoken`) with expiration.
- **Header Protection:** Hardened with `helmet` for CSP and cross-origin security.
- **Abuse Prevention:** Rate limited with `express-rate-limit` for both general traffic and contact/AI endpoints.
- **Spam Defense:** Hidden honeypot fields on contact forms to detect and drop bot requests.
- **Zero Exposed Keys:** Smart contract private keys and AI credentials stored exclusively in backend `.env`.

---

## 📄 Project Sections

1. **Home:** Interactive hero with animated text, status pill, resume download, quick metrics, and 3D hologram card.
2. **About Me:** Academic and technical profile at National Engineering College, Kovilpatti.
3. **Technical Skills:** Categorized matrix (Solidity, JavaScript, Java Spring Boot, MySQL, React, Cloud, CTF) with live skill inspection console.
4. **Projects:** Dynamic project cards with tech tags, GitHub links, and on-chain SHA-256 verification.
5. **Experience:** Milestones in project-based and academic engineering.
6. **Internships:** Internship readiness, target roles, and value proposition.
7. **Achievements:** H7CTF 2025, HI-TECH FEST 2026, Code Spring 2.0, Database Design Award 2026.
8. **Certifications:** Interactive grid with direct links to authentic PDF credentials.
9. **Education:** Degree credentials at National Engineering College (B.E CSE 2024–2028) & Holy Cross A.I Girls HSS (2024).
10. **Contact:** Glassmorphism inquiry transmission form with instant toast alerts.

---

## 🌐 Deployment
Refer to [`DEPLOYMENT.md`](./DEPLOYMENT.md) for step-by-step instructions on deploying the frontend to **Vercel** and backend to **Render**.

For API documentation, see [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md).

---

*Engineered with precision for Jyotir Leha R.*
