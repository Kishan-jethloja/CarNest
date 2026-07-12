import { pool } from './src/config/db';

async function alterDb() {
  try {
    await pool.query('ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS image_url TEXT;');
    console.log('Successfully added image_url column.');
  } catch (error) {
    console.error('Error altering table:', error);
  } finally {
    process.exit(0);
  }
}

alterDb();
