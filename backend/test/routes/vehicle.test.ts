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
  const globalAdminToken = generateToken({ id: 99, role: 'admin' });

  describe('GET /api/vehicles (Empty State)', () => {
    describe('Authentication & Authorization', () => {
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
    describe('Authentication & Authorization', () => {
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

      it('should return 403 status for non-admin users', async () => {
        const response = await request(app)
          .post('/api/vehicles')
          .set('Authorization', `Bearer ${validToken}`)
          .send(validVehicleData);
        expect(response.status).toBe(403);
      });
    });

    describe('Successful Creation', () => {
      it('should create a new vehicle and return 201 status with valid token', async () => {
        const response = await request(app)
          .post('/api/vehicles')
          .set('Authorization', `Bearer ${globalAdminToken}`)
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
          .set('Authorization', `Bearer ${globalAdminToken}`)
          .send(v);
      }
    });

    describe('Authentication & Authorization', () => {
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

  describe('PUT /api/vehicles/:id', () => {
    let vehicleId: number;

    beforeAll(async () => {
      // Insert a dedicated vehicle specifically for update testing
      const v = {
        name: 'Update Test Car',
        make: 'TestMake',
        model: 'TestModel',
        category: 'sedan',
        price: 10000,
        quantity: 1,
      };
      const response = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${globalAdminToken}`)
        .send(v);
      vehicleId = response.body.data.vehicle.id;
    });

    describe('Authentication & Authorization', () => {
      it('should return 401 status if token is missing', async () => {
        const response = await request(app)
          .put(`/api/vehicles/${vehicleId}`)
          .send({ price: 12000 });
        expect(response.status).toBe(401);
      });

      it('should return 403 status for non-admin users', async () => {
        const response = await request(app)
          .put(`/api/vehicles/${vehicleId}`)
          .set('Authorization', `Bearer ${validToken}`)
          .send({ price: 12000 });
        expect(response.status).toBe(403);
      });
    });

    describe('Validation & Errors', () => {
      it('should return 404 for a non-existent vehicle', async () => {
        const response = await request(app)
          .put('/api/vehicles/999999')
          .set('Authorization', `Bearer ${globalAdminToken}`)
          .send({ price: 12000 });
        expect(response.status).toBe(404);
        expect(response.body.message).toMatch(/not found/i);
      });

      it('should validate and reject invalid data', async () => {
        const response = await request(app)
          .put(`/api/vehicles/${vehicleId}`)
          .set('Authorization', `Bearer ${globalAdminToken}`)
          .send({ price: -500 }); // Price must be positive
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      });
    });

    describe('Updates', () => {
      it('should completely update all fields with valid data', async () => {
        const fullUpdateData = {
          name: 'Updated Car Name',
          make: 'UpdatedMake',
          model: 'UpdatedModel',
          category: 'suv',
          price: 25000,
          quantity: 5,
          description: 'Updated description',
        };

        const response = await request(app)
          .put(`/api/vehicles/${vehicleId}`)
          .set('Authorization', `Bearer ${globalAdminToken}`)
          .send(fullUpdateData);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.vehicle.name).toBe(fullUpdateData.name);
        expect(response.body.data.vehicle.make).toBe(fullUpdateData.make);
        expect(response.body.data.vehicle.price).toBe(fullUpdateData.price);
      });

      it('should support partial field updates', async () => {
        const partialData = { price: 29999 }; // Only updating the price
        const response = await request(app)
          .put(`/api/vehicles/${vehicleId}`)
          .set('Authorization', `Bearer ${globalAdminToken}`)
          .send(partialData);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.vehicle.price).toBe(partialData.price);
        // Ensure other fields remained intact from the previous full update
        expect(response.body.data.vehicle.name).toBe('Updated Car Name');
      });
    });
  });

  describe('DELETE /api/vehicles/:id', () => {
    let vehicleIdToDelete: number;
    const adminToken = generateToken({ id: 2, role: 'admin' });

    beforeAll(async () => {
      // Insert a vehicle specifically for delete testing
      const v = {
        name: 'Delete Test Car',
        make: 'DeleteMake',
        model: 'DeleteModel',
        category: 'sedan',
        price: 15000,
        quantity: 1,
      };
      const response = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${globalAdminToken}`)
        .send(v);
      vehicleIdToDelete = response.body.data.vehicle.id;
    });

    describe('Authentication & Authorization', () => {
      it('should return 401 status if token is missing', async () => {
        const response = await request(app).delete(`/api/vehicles/${vehicleIdToDelete}`);
        expect(response.status).toBe(401);
      });

      it('should return 403 status for non-admin users', async () => {
        const response = await request(app)
          .delete(`/api/vehicles/${vehicleIdToDelete}`)
          .set('Authorization', `Bearer ${validToken}`); // validToken is 'customer'
        expect(response.status).toBe(403);
      });
    });

    describe('Deletion', () => {
      it('should return 404 for a non-existent vehicle', async () => {
        const response = await request(app)
          .delete('/api/vehicles/999999')
          .set('Authorization', `Bearer ${adminToken}`);
        expect(response.status).toBe(404);
      });

      it('should allow admin to delete vehicle', async () => {
        const response = await request(app)
          .delete(`/api/vehicles/${vehicleIdToDelete}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

        // Verify it was actually deleted
        const getResponse = await request(app)
          .get('/api/vehicles')
          .set('Authorization', `Bearer ${adminToken}`);

        const deletedVehicle = getResponse.body.data.vehicles.find(
          (v: any) => v.id === vehicleIdToDelete,
        );
        expect(deletedVehicle).toBeUndefined();
      });
    });
  });

  describe('POST /api/vehicles/:id/purchase', () => {
    let vehicleIdToPurchase: number;
    let outOfStockVehicleId: number;

    beforeAll(async () => {
      // Vehicle with some stock
      const v1 = {
        name: 'Purchase Test Car',
        make: 'PurchaseMake',
        model: 'PurchaseModel',
        category: 'sedan',
        price: 20000,
        quantity: 5,
      };
      const res1 = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${globalAdminToken}`)
        .send(v1);
      vehicleIdToPurchase = res1.body.data.vehicle.id;

      // Vehicle with zero stock
      const v2 = {
        name: 'Out of Stock Car',
        make: 'OOSMake',
        model: 'OOSModel',
        category: 'suv',
        price: 30000,
        quantity: 0,
      };
      const res2 = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${globalAdminToken}`)
        .send(v2);
      outOfStockVehicleId = res2.body.data.vehicle.id;
    });

    describe('Authentication & Authorization', () => {
      it('should return 401 status if token is missing', async () => {
        const response = await request(app).post(`/api/vehicles/${vehicleIdToPurchase}/purchase`);
        expect(response.status).toBe(401);
      });
    });

    describe('Purchase Validation & Logic', () => {
      it('should return 404 for a non-existent vehicle', async () => {
        const response = await request(app)
          .post('/api/vehicles/999999/purchase')
          .set('Authorization', `Bearer ${validToken}`)
          .send({ quantity: 1 });
        expect(response.status).toBe(404);
      });

      it('should prevent purchase when out of stock', async () => {
        const response = await request(app)
          .post(`/api/vehicles/${outOfStockVehicleId}/purchase`)
          .set('Authorization', `Bearer ${validToken}`)
          .send({ quantity: 1 });
        expect(response.status).toBe(400);
      });

      it('should validate purchase quantity against available stock', async () => {
        const response = await request(app)
          .post(`/api/vehicles/${vehicleIdToPurchase}/purchase`)
          .set('Authorization', `Bearer ${validToken}`)
          .send({ quantity: 10 }); // Stock is 5
        expect(response.status).toBe(400);
      });

      it('should allow customer to purchase vehicle and decrease quantity', async () => {
        const response = await request(app)
          .post(`/api/vehicles/${vehicleIdToPurchase}/purchase`)
          .set('Authorization', `Bearer ${validToken}`)
          .send({ quantity: 2 });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

        // Verify quantity was decreased
        const getResponse = await request(app)
          .get('/api/vehicles')
          .set('Authorization', `Bearer ${validToken}`);

        const updatedVehicle = getResponse.body.data.vehicles.find(
          (v: any) => v.id === vehicleIdToPurchase,
        );
        expect(updatedVehicle.quantity).toBe(3); // 5 - 2
      });
    });
  });

  describe('POST /api/vehicles/:id/restock', () => {
    let vehicleIdToRestock: number;
    const adminToken = generateToken({ id: 2, role: 'admin' });

    beforeAll(async () => {
      const v = {
        name: 'Restock Test Car',
        make: 'RestockMake',
        model: 'RestockModel',
        category: 'suv',
        price: 35000,
        quantity: 5,
      };
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(v);
      vehicleIdToRestock = res.body.data.vehicle.id;
    });

    describe('Authentication & Authorization', () => {
      it('should return 401 status if token is missing', async () => {
        const response = await request(app).post(`/api/vehicles/${vehicleIdToRestock}/restock`);
        expect(response.status).toBe(401);
      });

      it('should return 403 status for non-admin users', async () => {
        const response = await request(app)
          .post(`/api/vehicles/${vehicleIdToRestock}/restock`)
          .set('Authorization', `Bearer ${validToken}`) // validToken is 'customer'
          .send({ quantity: 10 });
        expect(response.status).toBe(403);
      });
    });

    describe('Restock Validation & Logic', () => {
      it('should return 404 for a non-existent vehicle', async () => {
        const response = await request(app)
          .post('/api/vehicles/999999/restock')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ quantity: 10 });
        expect(response.status).toBe(404);
      });

      it('should validate restock quantity (reject invalid data)', async () => {
        const response = await request(app)
          .post(`/api/vehicles/${vehicleIdToRestock}/restock`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ quantity: -5 }); // Invalid quantity
        expect(response.status).toBe(400);
      });

      it('should allow admin to restock vehicle and increase quantity', async () => {
        const response = await request(app)
          .post(`/api/vehicles/${vehicleIdToRestock}/restock`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ quantity: 10 });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

        // Verify quantity was increased (5 + 10 = 15)
        const getResponse = await request(app)
          .get('/api/vehicles')
          .set('Authorization', `Bearer ${adminToken}`);

        const updatedVehicle = getResponse.body.data.vehicles.find(
          (v: any) => v.id === vehicleIdToRestock,
        );
        expect(updatedVehicle.quantity).toBe(15);
      });
    });
  });
});
