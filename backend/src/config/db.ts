import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const isTestEnv = process.env.NODE_ENV === 'test';
// Use environment variable with fallback to local test database
const TEST_DB_URL = 'postgresql://postgres:password@localhost:5432/carnest_test';

const connectionString = isTestEnv
  ? process.env.TEST_DATABASE_URL || TEST_DB_URL
  : process.env.DATABASE_URL;

export const pool = new Pool({
  connectionString,
  ssl: connectionString?.includes('neon.tech') ? { rejectUnauthorized: false } : false,
});

/**
 * Verifies the database connection.
 * Centralized helper for app startup and test setup suites.
 */
export const connectDB = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    if (!isTestEnv) {
      console.log('Successfully connected to the database.');
    }
    client.release();
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

/**
 * Drops/Truncates tables to provide a clean state for testing.
 * SAFETY CHECK: Will only execute if NODE_ENV is 'test'.
 */
export const clearDB = async (): Promise<void> => {
  if (!isTestEnv) {
    throw new Error('FATAL: clearDB() cannot be run outside of the test environment.');
  }

  try {
    await pool.query('TRUNCATE TABLE users, vehicles CASCADE;');
  } catch (error: any) {
    // Ignore error 42P01 ("undefined_table") which happens if the tables aren't created yet.
    if (error.code !== '42P01') {
      throw error;
    }
  }
};

/**
 * Closes the connection pool cleanly.
 * Required in afterAll() test blocks to prevent Jest hanging.
 */
export const closeDB = async (): Promise<void> => {
  await pool.end();
};
