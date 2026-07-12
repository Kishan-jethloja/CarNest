import request from 'supertest';
import app from './src/app';
import { generateToken } from './src/utils/tokengenerator';

const validToken = generateToken({ id: 1, role: 'customer' });
const validVehicleData = {
  name: 'Toyota Corolla 2024',
  make: 'Toyota',
  model: 'Corolla',
  category: 'sedan',
  price: 25000,
  quantity: 10,
  description: 'A reliable compact car.',
};

async function run() {
  try {
    const response = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${validToken}`)
      .send(validVehicleData);

    console.log('Status:', response.status);
    console.log('Body:', response.body);
  } catch (e) {
    console.error('Crash:', e);
  } finally {
    process.exit(0);
  }
}
run();
