import { VehicleModel } from '../../src/models/vehicle.model';

describe('Vehicle Model Validation', () => {
  const validVehicleData = {
    name: 'Toyota Camry 2024',
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
    // category should be trimmed and lowercased
    expect(vehicle.category).toBe('sedan');
  });

  describe('Required Fields', () => {
    const requiredFields = ['name', 'make', 'model', 'category', 'price', 'quantity'];

    requiredFields.forEach((field) => {
      it(`should throw validation error when ${field} is missing`, () => {
        const invalidData = { ...validVehicleData };
        delete (invalidData as any)[field];

        expect(() => VehicleModel.build(invalidData)).toThrow();
      });
    });
  });

  describe('Text Validations', () => {
    it('should throw validation error if name is too short', () => {
      const data = { ...validVehicleData, name: 'A' };
      expect(() => VehicleModel.build(data)).toThrow();
    });

    it('should transform category to lowercase and trim whitespace', () => {
      const data = { ...validVehicleData, category: '  SUV  ' };
      const vehicle = VehicleModel.build(data);
      expect(vehicle.category).toBe('suv');
    });

    it('should allow optional description under 500 chars', () => {
      const data = { ...validVehicleData, description: 'A great car' };
      const vehicle = VehicleModel.build(data);
      expect(vehicle.description).toBe('A great car');
    });

    it('should throw if description exceeds 500 characters', () => {
      const data = { ...validVehicleData, description: 'a'.repeat(501) };
      expect(() => VehicleModel.build(data)).toThrow();
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

  describe('Partial Updates', () => {
    it('should validate partial vehicle updates', () => {
      const partialData = { price: 26000 };
      const updated = VehicleModel.buildPartial(partialData);
      expect(updated.price).toBe(26000);
      expect(updated.make).toBeUndefined();
    });
  });
});
