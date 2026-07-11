import { z } from 'zod';

const VehicleSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  make: z
    .string()
    .min(2, 'Make must be at least 2 characters')
    .max(100, 'Make must be at most 100 characters'),
  model: z
    .string()
    .min(2, 'Model must be at least 2 characters')
    .max(100, 'Model must be at most 100 characters'),
  category: z
    .string()
    .min(2, 'Category must be at least 2 characters')
    .max(50, 'Category must be at most 50 characters')
    .trim()
    .toLowerCase(),
  price: z.number().positive('Price must be strictly positive'),
  quantity: z
    .number()
    .int('Quantity must be an integer')
    .nonnegative('Quantity cannot be negative'),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type VehicleType = z.infer<typeof VehicleSchema>;

export class VehicleModel {
  /**
   * Database indexes for the vehicles table (Raw SQL)
   * Designed for high search performance across core attributes.
   */
  static readonly INDEXES = [
    'CREATE INDEX IF NOT EXISTS vehicles_make_idx ON vehicles(make);',
    'CREATE INDEX IF NOT EXISTS vehicles_model_idx ON vehicles(model);',
    'CREATE INDEX IF NOT EXISTS vehicles_category_idx ON vehicles(category);',
    'CREATE INDEX IF NOT EXISTS vehicles_price_idx ON vehicles(price);',
    'CREATE INDEX IF NOT EXISTS vehicles_quantity_idx ON vehicles(quantity);',
  ];

  /**
   * Validates and builds a vehicle object
   */
  static build(data: any): VehicleType {
    return VehicleSchema.parse(data);
  }
}
