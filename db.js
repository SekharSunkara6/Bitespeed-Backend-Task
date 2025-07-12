const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',          // your PostgreSQL username
  host: 'localhost',         // database host
  database: 'bitespeed',     // your database name
  password: 'sekharqa', // your PostgreSQL password
  port: 5432,                // default PostgreSQL port
});

module.exports = pool;
