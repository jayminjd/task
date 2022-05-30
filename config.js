const { Pool } = require("pg");
const pool = new Pool({
  host: "localhost",
  database: "users",
  user: "postgres",
  password: "password"
});

pool.connect();

module.exports = pool;
