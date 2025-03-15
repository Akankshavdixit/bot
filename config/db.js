const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Read from environment variable
  ssl: process.env.DATABASE_URL.includes("render.com") ? { rejectUnauthorized: false } : false, // Required for Render
});

pool.connect()
  .then(() => console.log("Connected to PostgreSQL database ✅"))
  .catch(err => console.error("Database connection error ❌", err));

module.exports = pool;

