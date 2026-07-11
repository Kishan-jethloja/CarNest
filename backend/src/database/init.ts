import fs from 'fs';
import path from 'path';
import { pool } from '../config/db';

const initDB = async () => {
  try {
    console.log('Reading schema.sql...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing schema against database...');
    await pool.query(schema);

    console.log('✅ Database schema initialized successfully!');
  } catch (error) {
    console.error('❌ Failed to initialize database schema:', error);
    process.exit(1);
  } finally {
    // Ensure the pool closes so the script can exit cleanly
    await pool.end();
  }
};

initDB();
