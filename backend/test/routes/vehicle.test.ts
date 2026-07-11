import request from 'supertest';
import app from '../../src/app';
import { generateToken } from '../../src/utils/tokengenerator';

describe('Vehicle Routes', () => {
  const validVehicleData = {
    name: 'Toyota Corolla 2024',
    make: 'Toyota',
    model: 'Corolla',
    category: 'sedan',
    price: 25000,
    quantity: 10,
    description: 'A reliable compact car.',
  };

  // Generate a mock valid token for a customer user
  const validToken = generateToken({ id: 1, role: 'customer' });

  describe('GET /api/vehicles (Empty State)', () => {
    describe('Authentication', () => {
      it('should return 401 status if token is missing', async () => {
        const response = await request(app).get('/api/vehicles');
        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toMatch(/token/i);
      });
    });

    describe('Retrieval', () => {
      it('should return 200 status and an empty array when no vehicles exist', async () => {
        const response = await request(app)
          .get('/api/vehicles')
          .set('Authorization', `Bearer ${validToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.vehicles).toEqual([]);
      });
    });
  });

  describe('POST /api/vehicles', () => {
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

  describe('GET /api/vehicles (Populated State)', () => {
    it('should return 200 status and a list of vehicles including the newly created one', async () => {
      const response = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.vehicles.length).toBeGreaterThan(0);

      const createdVehicle = response.body.data.vehicles.find(
        (v: any) => v.make === validVehicleData.make && v.model === validVehicleData.model,
      );
      expect(createdVehicle).toBeDefined();
      expect(createdVehicle.name).toBe(validVehicleData.name);
    });
  });
});
