# THE DIGITAL UNIVERSE — FULL STACK DEPLOYMENT GUIDE
**Architecture:** Vercel (Frontend) + Render (Backend) + MongoDB Atlas (Database) + Ethereum Sepolia (Smart Contract)

---

## 1. MongoDB Atlas Setup
1. Create a free M0 cluster at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Under **Database Access**, create a user (e.g. `leha_admin`) with password.
3. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere) so Render can connect.
4. Click **Connect** → **Drivers** (Node.js) and copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/digital_universe?retryWrites=true&w=majority
   ```
5. Set this as `MONGODB_URI` in your backend environment variables.

---

## 2. Ethereum Sepolia Smart Contract Deployment
1. Navigate to the `blockchain/` folder:
   ```bash
   cd blockchain
   npm install
   ```
2. Configure `blockchain/.env`:
   ```env
   SEPOLIA_RPC_URL=https://rpc.sepolia.org
   SEPOLIA_PRIVATE_KEY=0xYOUR_TESTNET_WALLET_PRIVATE_KEY
   ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
   ```
3. Ensure your deployer address has free Sepolia ETH (from [sepoliafaucet.com](https://sepoliafaucet.com) or [google cloud faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)).
4. Run deployment:
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```
5. The script automatically exports the deployed address and ABI to both `backend/config/contractConfig.json` and `frontend/src/services/contractConfig.json`!

---

## 3. Render Backend Deployment
1. Go to [https://render.com](https://render.com) and create a **New Web Service**.
2. Connect your GitHub repository.
3. Configure the service:
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. Add Environment Variables:
   | Key | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `PORT` | `10000` |
   | `MONGODB_URI` | `mongodb+srv://...` |
   | `JWT_SECRET` | Strong random secret |
   | `GEMINI_API_KEY` | Your Google Gemini API Key |
   | `CLIENT_URL` | Your Vercel frontend URL |
   | `SEPOLIA_RPC_URL` | `https://rpc.sepolia.org` |
   | `ADMIN_EMAIL` | `jyotirleha@admin.universe` |
   | `ADMIN_PASSWORD` | Strong admin password |
5. Click **Create Web Service**.
6. Once deployed, run the one-time database seed via Render Shell or locally targeting the Atlas URI:
   ```bash
   npm run seed:portfolio
   npm run seed:admin
   ```

---

## 4. Vercel Frontend Deployment
1. Go to [https://vercel.com](https://vercel.com) and click **Add New Project**.
2. Import your GitHub repository.
3. Configure Project Settings:
   - **Root Directory:** `frontend`
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add Environment Variables:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://your-render-backend.onrender.com/api` |
   | `VITE_SEPOLIA_CHAIN_ID` | `11155111` |
5. Click **Deploy**.
6. Your portfolio is now globally accessible via custom domains or `*.vercel.app`!
