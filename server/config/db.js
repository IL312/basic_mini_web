require('dotenv').config({ quiet: true });

const pgp = require('pg-promise')();

// numeric OID = 1700
// Чтобы NUMERIC приходил как number, а не string
pgp.pg.types.setTypeParser(1700, parseFloat);

const requiredEnvVars = [
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Не задана переменная окружения ${envVar}`);
  }
}

const db = pgp({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

module.exports = db;