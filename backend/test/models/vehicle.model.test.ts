import { VehicleModel } from '../../src/models/vehicle.model';

describe('Vehicle Model Validation', () => {
  const validVehicleData = {
    make: 'Toyota',
    model: 'Camry',
    category: 'Sedan',
    price: 25000.5,
    quantity: 5,
  };

  it('should successfully build a vehicle with valid data', () => {
    const vehicle = VehicleModel.build(validVehicleData);

    expect(vehicle.make).toBe('Toyota');
    expect(vehicle.price).toBe(25000.5);
  });

  describe('Required Fields', () => {
    const requiredFields = ['make', 'model', 'category', 'price', 'quantity'];

    requiredFields.forEach((field) => {
      it(`should throw validation error when ${field} is missing`, () => {
        const invalidData = { ...validVehicleData };
        delete (invalidData as any)[field];

        expect(() => VehicleModel.build(invalidData)).toThrow();
      });
    });
  });

  describe('Business Rules for Pricing and Inventory', () => {
    it('should throw validation error when price is negative', () => {
      const invalidData = { ...validVehicleData, price: -500 };
      expect(() => VehicleModel.build(invalidData)).toThrow();
    });

    it('should throw validation error when price is zero (must be strictly positive)', () => {
      const invalidData = { ...validVehicleData, price: 0 };
      expect(() => VehicleModel.build(invalidData)).toThrow();
    });

    it('should throw validation error when quantity is negative', () => {
      const invalidData = { ...validVehicleData, quantity: -1 };
      expect(() => VehicleModel.build(invalidData)).toThrow();
    });

    it('should throw validation error when quantity is not a whole number (integer)', () => {
      const invalidData = { ...validVehicleData, quantity: 1.5 };
      expect(() => VehicleModel.build(invalidData)).toThrow();
    });

    it('should successfully build when quantity is exactly zero (non-negative integer)', () => {
      const zeroQuantityData = { ...validVehicleData, quantity: 0 };
      const vehicle = VehicleModel.build(zeroQuantityData);

      expect(vehicle.quantity).toBe(0);
    });
  });
});
