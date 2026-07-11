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

  describe('GET /api/vehicles/search', () => {
    beforeAll(async () => {
      // Insert a diverse set of vehicles to thoroughly test search filters
      const extraVehicles = [
        {
          name: 'Honda Civic 2023',
          make: 'Honda',
          model: 'Civic',
          category: 'sedan',
          price: 22000,
          quantity: 5,
        },
        {
          name: 'Ford F-150',
          make: 'Ford',
          model: 'F-150',
          category: 'truck',
          price: 45000,
          quantity: 2,
        },
        {
          name: 'Toyota RAV4',
          make: 'Toyota',
          model: 'RAV4',
          category: 'suv',
          price: 30000,
          quantity: 8,
        },
      ];

      for (const v of extraVehicles) {
        await request(app)
          .post('/api/vehicles')
          .set('Authorization', `Bearer ${validToken}`)
          .send(v);
      }
    });

    describe('Authentication', () => {
      it('should return 401 status if token is missing', async () => {
        const response = await request(app).get('/api/vehicles/search?make=Toyota');
        expect(response.status).toBe(401);
      });
    });

    describe('Search Filters', () => {
      it('should search by make (case-insensitive)', async () => {
        const response = await request(app)
          .get('/api/vehicles/search?make=toyota')
          .set('Authorization', `Bearer ${validToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.vehicles.length).toBeGreaterThanOrEqual(2); // Corolla (from earlier) and RAV4
        expect(
          response.body.data.vehicles.every((v: any) => v.make.toLowerCase() === 'toyota'),
        ).toBe(true);
      });

      it('should search by model', async () => {
        const response = await request(app)
          .get('/api/vehicles/search?model=Civic')
          .set('Authorization', `Bearer ${validToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data.vehicles.length).toBeGreaterThanOrEqual(1);
        expect(response.body.data.vehicles[0].model).toBe('Civic');
      });

      it('should search by category', async () => {
        const response = await request(app)
          .get('/api/vehicles/search?category=truck')
          .set('Authorization', `Bearer ${validToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data.vehicles.length).toBeGreaterThanOrEqual(1);
        expect(response.body.data.vehicles[0].category).toBe('truck');
      });

      it('should search by price range (min/max)', async () => {
        const response = await request(app)
          .get('/api/vehicles/search?minPrice=20000&maxPrice=26000')
          .set('Authorization', `Bearer ${validToken}`);

        expect(response.status).toBe(200);
        // Should catch Corolla (25000) and Civic (22000)
        expect(response.body.data.vehicles.length).toBeGreaterThanOrEqual(2);
        expect(
          response.body.data.vehicles.every(
            (v: any) => parseFloat(v.price) >= 20000 && parseFloat(v.price) <= 26000,
          ),
        ).toBe(true);
      });

      it('should handle combined filters (make + category)', async () => {
        const response = await request(app)
          .get('/api/vehicles/search?make=Toyota&category=suv')
          .set('Authorization', `Bearer ${validToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data.vehicles.length).toBe(1); // Only RAV4
        expect(response.body.data.vehicles[0].model).toBe('RAV4');
      });

      it('should handle empty results gracefully', async () => {
        const response = await request(app)
          .get('/api/vehicles/search?make=Ferrari')
          .set('Authorization', `Bearer ${validToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.vehicles).toEqual([]);
      });
    });
  });
});
