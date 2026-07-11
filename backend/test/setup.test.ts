import fs from 'fs';
import path from 'path';
import { connectDB, closeDB, clearDB, pool } from '../src/config/db';

describe('Global Test Setup & Database Connection', () => {
  beforeAll(async () => {
    await connectDB();

    // Initialize the test database schema
    const schemaPath = path.join(__dirname, '../src/database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schema);
  });

  afterAll(async () => {
    await closeDB();
  });

  it('should successfully connect to the test database and clear tables', async () => {
    // If this throws, the connection is failing
    await expect(clearDB()).resolves.not.toThrow();
  });
});
