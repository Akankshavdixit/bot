const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user : process.env.USER ,
  host: process.env.HOST ,
  database: process.env.DATABASE ,
  password: process.env.PASSWORD ,
  port: process.env.DB_PORT ,
})

pool.connect()
  .then(() => console.log("Connected to PostgreSQL database ✅"))
  .catch(err => console.error("Database connection error ❌", err));

module.exports = pool;

