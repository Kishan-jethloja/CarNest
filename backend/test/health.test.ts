import request from 'supertest';
import app from '../src/app';

describe('System Health Diagnostic', () => {
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
