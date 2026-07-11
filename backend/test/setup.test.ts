import { connectDB, closeDB, clearDB } from '../src/config/db';

describe('Global Test Setup & Database Connection', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await closeDB();
  });

  it('should successfully connect to the test database and clear tables', async () => {
    // If this throws, the connection is failing
    await expect(clearDB()).resolves.not.toThrow();
  });
});
