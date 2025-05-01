import "reflect-metadata";
import express from 'express';
import userRoutes from "./routes/v1/usersRoutes";
import authRoutes from "./routes/v1/authRoutes";
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import { AppDataSource, initializeDataSource } from "./orm/dbCreateConnection";
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
import medicineRoutes from './routes/v1/medicineRoute'
import prescriptionDetailRoutes from './routes/v1/prescriptionDetailRoutes'
import prescriptionRoutes from "./routes/v1/prescriptionRoutes";
import transactionRoutes from "./routes/v1/transactionRoutes";
import labtestRoutes from "./routes/v1/labtestRoutes";
import testTypeRoutes from "./routes/v1/testTypeRoutes";
import serviceRoutes from "./routes/v1/serviceRoutes";
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
app.use('/api/v1/medicine', medicineRoutes);
app.use('/api/v1/prescription-details', prescriptionDetailRoutes);
app.use('/api/v1/prescriptions', prescriptionRoutes); 
app.use('/api/v1/labtests', labtestRoutes);
app.use('/api/v1/test-types', testTypeRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use(errorMiddleware);

// Initialize database connection
initializeDataSource().then(() => {  
  console.log('Database connected');
}).catch((error) => {
  console.error('Database connection error:', error);
  process.exit(1);  // Nếu không thể kết nối thì dừng server
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

export default app;