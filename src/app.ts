import "reflect-metadata";
import express from 'express';
import userRoutes from "./routes/v1/usersRoutes";
import authRoutes from "./routes/v1/authRoutes";
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import { AppDataSource } from "./orm/dbCreateConnection";
import * as dotenv from 'dotenv';
import { errorMiddleware } from './middlewares/error.middleware';
import departmentRoutes from './routes/v1/departmentRoutes';
import positionRoutes from "./routes/v1/positionRoutes";
import employeeRoutes from "./routes/v1/employeeRoutes";
import patientRoutes from "./routes/v1/patientRoutes";
import employeeShiftRoutes from './routes/v1/employeeShiftRoutes';
import shiftRoutes from './routes/v1/shiftRoutes';
import timeFrameRoutes from './routes/v1/timeFrameRoutes';
import appointmentRoutes from './routes/v1/appointmentRoutes';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/departments', departmentRoutes);
app.use('/api/v1/positions', positionRoutes);
app.use('/api/v1/employees', employeeRoutes);
app.use('/api/v1/patients', patientRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/shifts', shiftRoutes);
app.use('/api/v1/employee-shifts', employeeShiftRoutes);
app.use('/api/v1/timeFrames', timeFrameRoutes);
app.use('/api/v1/appointments', appointmentRoutes);

app.use(errorMiddleware);

// Initialize database connection
AppDataSource().then(() => {
    console.log('Database connected');
}).catch((error) => {
    console.error('Database connection error:', error);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

export default app;