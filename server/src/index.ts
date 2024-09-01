import express, { Application, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';

import userRoutes from './routes/userRoutes';
import restaurantRoutes from './routes/restaurantRoutes';

import { errorHandler } from './middlewares/errorMiddleware';

dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT as string) || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/restaurants', restaurantRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on localhost:${PORT}`);
});



