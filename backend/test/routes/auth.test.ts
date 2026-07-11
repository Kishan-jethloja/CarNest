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

      it('should return 400 status if password is less than 6 characters', async () => {
        const shortPasswordData = { ...validRegistrationData, password: 'short' };
        const response = await request(app).post('/api/auth/register').send(shortPasswordData);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toMatch(/at least 6 characters/i);
      });

      it('should return 400 status if password is more than 20 characters', async () => {
        const longPasswordData = {
          ...validRegistrationData,
          password: 'thispasswordiswaytoolongtobeaccepted123!',
        };
        const response = await request(app).post('/api/auth/register').send(longPasswordData);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toMatch(/at most 20 characters/i);
      });
    });

    describe('Duplicate Registration Errors', () => {
      it('should return 409 status if email already exists', async () => {
        // Since the 'validRegistrationData' was successfully inserted in the first test,
        // attempting to register another user with the same email should fail.
        const duplicateEmailData = {
          ...validRegistrationData,
          username: 'differentusername', // Unique username
        };
        const response = await request(app).post('/api/auth/register').send(duplicateEmailData);

        expect(response.status).toBe(409);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toMatch(/already exists/i);
      });
    });
  });

  describe('POST /api/auth/login', () => {
    const validLoginData = {
      email: 'johndoe@example.com',
      password: 'StrongPassword123!',
    };

    it('should successfully log in and return 200 status with JWT token', async () => {
      const response = await request(app).post('/api/auth/login').send(validLoginData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(typeof response.body.data.token).toBe('string');
      expect(response.body.data.user.email).toBe(validLoginData.email);
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    describe('Validation Errors for Missing Fields', () => {
      it('should return 400 status if email is missing', async () => {
        const { email, ...missingEmail } = validLoginData;
        const response = await request(app).post('/api/auth/login').send(missingEmail);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toMatch(/email/i);
      });

      it('should return 400 status if password is missing', async () => {
        const { password, ...missingPassword } = validLoginData;
        const response = await request(app).post('/api/auth/login').send(missingPassword);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toMatch(/password/i);
      });
    });

    describe('Authentication Errors', () => {
      it('should return 401 status for non-existent user', async () => {
        const response = await request(app).post('/api/auth/login').send({
          email: 'notfound@example.com',
          password: 'Password123!',
        });

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toMatch(/invalid email or password/i);
      });

      it('should return 401 status for incorrect password', async () => {
        const response = await request(app).post('/api/auth/login').send({
          email: validLoginData.email,
          password: 'WrongPassword123!',
        });

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toMatch(/invalid email or password/i);
      });
    });
  });
});
