import express from 'express';

const app = express();

// Middleware
app.use(express.json());

// Routes will be added here

export default app;
