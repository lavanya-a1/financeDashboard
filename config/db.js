const { Pool } = require('pg');
require('dotenv').config();

const useSsl =
    process.env.DB_SSL === 'true' ||
    (process.env.NODE_ENV === 'production' && process.env.DB_SSL !== 'false');

const connectionConfig = process.env.DATABASE_URL
    ? {
          connectionString: process.env.DATABASE_URL,
          ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {}),
      }
    : {
          user: process.env.DB_USER,
          host: process.env.DB_HOST,
          database: process.env.DB_NAME,
          password: process.env.DB_PASSWORD,
          port: process.env.DB_PORT,
          ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {}),
      };

const pool = new Pool(connectionConfig);

module.exports = pool;