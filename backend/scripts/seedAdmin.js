const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const { Admin, readLocalDb, writeLocalDb, getMongoStatus } = require("../utils/memoryDb");
const { connectDB } = require("../config/db");

async function seedAdmin() {
  console.log("=========================================");
  console.log("   ADMINISTRATOR ACCOUNT INITIALIZER     ");
  console.log("=========================================");

  // Read from environment variables or command-line arguments
  const args = process.argv.slice(2);
  let email = process.env.ADMIN_EMAIL || "jyotirleha@admin.universe";
  let username = process.env.ADMIN_USERNAME || "jyotirleha_admin";
  let password = process.env.ADMIN_PASSWORD;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--email" && args[i + 1]) email = args[i + 1];
    if (args[i] === "--username" && args[i + 1]) username = args[i + 1];
    if (args[i] === "--password" && args[i + 1]) password = args[i + 1];
  }

  if (!password) {
    // Generate secure randomized temporary password if none supplied
    password = "Leha@" + crypto.randomBytes(4).toString("hex") + "!2026";
    console.log(`Generated Secure Admin Password: ${password}`);
    console.log("IMPORTANT: Copy this password now or override with ADMIN_PASSWORD in your .env");
  }

  await connectDB();

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  if (getMongoStatus()) {
    const existing = await Admin.findOne({ email: email.toLowerCase() });
    if (existing) {
      existing.username = username;
      existing.passwordHash = passwordHash;
      await existing.save();
      console.log(`Admin account '${email}' updated in MongoDB Atlas.`);
    } else {
      await Admin.create({
        username,
        email: email.toLowerCase(),
        passwordHash,
        role: "admin",
      });
      console.log(`New Admin account '${email}' created in MongoDB Atlas.`);
    }
  } else {
    const local = readLocalDb();
    if (!local.admins) local.admins = [];
    const idx = local.admins.findIndex((a) => a.email.toLowerCase() === email.toLowerCase());

    const record = {
      _id: "admin_" + crypto.randomBytes(4).toString("hex"),
      username,
      email: email.toLowerCase(),
      passwordHash,
      role: "admin",
      createdAt: new Date().toISOString(),
    };

    if (idx !== -1) {
      local.admins[idx] = { ...local.admins[idx], ...record };
      console.log(`Admin account '${email}' updated in persistent store.`);
    } else {
      local.admins.push(record);
      console.log(`New Admin account '${email}' created in persistent store.`);
    }
    writeLocalDb(local);
  }

  console.log("-----------------------------------------");
  console.log(`Admin Email   : ${email}`);
  console.log(`Admin Username: ${username}`);
  console.log("Seed script completed successfully!");
  console.log("=========================================");
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error("Admin seed error:", err);
  process.exit(1);
});
