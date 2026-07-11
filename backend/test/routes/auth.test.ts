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
        data: {
          user: expect.objectContaining({
            username: validRegistrationData.username,
            email: validRegistrationData.email,
            role: 'customer',
          }),
        },
      });

      // Crucially, we expect the password to NOT be returned
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    describe('Validation Errors for Missing Fields', () => {
      it('should return 400 status if username is missing', async () => {
        const { username, ...missingUsername } = validRegistrationData;
        const response = await request(app).post('/api/auth/register').send(missingUsername);

        console.log('DEBUG BODY:', response.body);
        console.log('DEBUG TEXT:', response.text);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toMatch(/username/i);
      });

      it('should return 400 status if email is missing', async () => {
        const { email, ...missingEmail } = validRegistrationData;
        const response = await request(app).post('/api/auth/register').send(missingEmail);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toMatch(/email/i);
      });

      it('should return 400 status if password is missing', async () => {
        const { password, ...missingPassword } = validRegistrationData;
        const response = await request(app).post('/api/auth/register').send(missingPassword);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toMatch(/password/i);
      });
    });

    describe('Validation Errors for Invalid Data Formats', () => {
      it('should return 400 status if email format is invalid', async () => {
        const invalidEmailData = { ...validRegistrationData, email: 'plainaddress' };
        const response = await request(app).post('/api/auth/register').send(invalidEmailData);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toMatch(/invalid email/i);
      });
    });
  });
});
