// config/env.js - Environment Configuration

require("dotenv").config();

const config = {
  PORT: process.env.PORT || 8000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET || "super_secret_key",
};

if (!config.MONGO_URI) {
  console.error("❌ MONGO_URI not found in .env");
  process.exit(1);
}

module.exports = config;

