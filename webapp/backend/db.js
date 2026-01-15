const odbc = require('odbc');
require('dotenv').config();

let pool;

async function initializePool() {
  try {
    pool = await odbc.pool(process.env.DB_CONNECTION_STRING);
    console.log('Database connection pool initialized');
    return pool;
  } catch (error) {
    console.error('Failed to initialize database pool:', error);
    throw error;
  }
}

async function getConnection() {
  if (!pool) {
    await initializePool();
  }
  return await pool.connect();
}

async function query(sql, params = []) {
  const connection = await getConnection();
  try {
    const result = await connection.query(sql, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    await connection.close();
  }
}

module.exports = {
  initializePool,
  getConnection,
  query
};
