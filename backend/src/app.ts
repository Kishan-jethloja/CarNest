import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// System Diagnostics Route
app.get('/health', (req, res) => {
  res.status(200).json({
    systemState: 'OK',
    details: 'API is operational',
    timestamp: new Date().toISOString(),
  });
});

export default app;
