import request from 'supertest';
import app from '../src/app';
import { closeDB } from '../src/config/db';

describe('System Health Diagnostic', () => {
  afterAll(async () => {
    await closeDB();
  });

  it('GET /health should return 200 with operational state and timestamp', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      systemState: 'OK',
      details: 'API is operational',
      timestamp: expect.any(String), // Dynamically matching ISO string
    });
  });
});
