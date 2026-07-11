import request from 'supertest';
import app from '../src/app';

describe('Health Check Endpoint', () => {
  it('GET /health should return 200 with status and message', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'success',
      message: 'Server is healthy',
    });
  });
});
