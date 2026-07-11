import request from 'supertest';
import app from '../../src/app';

describe('Authentication Routes', () => {
  describe('POST /api/auth/register', () => {
    const validRegistrationData = {
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: 'StrongPassword123!',
    };

    it('should successfully register a new user and return 201 status', async () => {
      const response = await request(app).post('/api/auth/register').send(validRegistrationData);

      expect(response.status).toBe(201);

      // We expect the standard API response format defined earlier
      expect(response.body).toEqual({
        success: true,
        message: expect.any(String),
        data: expect.objectContaining({
          username: validRegistrationData.username,
          email: validRegistrationData.email,
          role: 'customer',
        }),
      });

      // Crucially, we expect the password to NOT be returned
      expect(response.body.data).not.toHaveProperty('password');
    });
  });
});
