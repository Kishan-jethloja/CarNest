import request from 'supertest';
import app from '../../src/app';
import { generateToken } from '../../src/utils/tokengenerator';
import { v4 as uuidv4 } from 'uuid';

describe('Vehicle Routes', () => {
  describe('POST /api/vehicles', () => {
    const validVehicleData = {
      make: 'Toyota',
      model: 'Corolla',
      category: 'sedan',
      price: 25000,
      quantity: 10,
      description: 'A reliable compact car.',
    };

    // Generate a mock valid token for an admin user
    const validToken = generateToken({ id: uuidv4(), role: 'admin' });

    describe('Authentication', () => {
      it('should return 401 status if token is missing', async () => {
        // Sending request without 'Authorization' header
        const response = await request(app).post('/api/vehicles').send(validVehicleData);

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toMatch(/token/i);
      });

      it('should return 401 status if token is invalid', async () => {
        const response = await request(app)
          .post('/api/vehicles')
          .set('Authorization', 'Bearer invalid.token.here')
          .send(validVehicleData);

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toMatch(/token/i);
      });
    });

    describe('Successful Creation', () => {
      it('should create a new vehicle and return 201 status with valid token', async () => {
        const response = await request(app)
          .post('/api/vehicles')
          .set('Authorization', `Bearer ${validToken}`)
          .send(validVehicleData);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('vehicle');
        expect(response.body.data.vehicle.make).toBe(validVehicleData.make);
        expect(response.body.data.vehicle.model).toBe(validVehicleData.model);
      });
    });
  });
});
