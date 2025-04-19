import { Router } from 'express';
import { AppointmentController } from '../../controllers/AppointmentController';
import { AppointmentService } from '../../services/AppointmentService';
import { AppointmentsRepository } from '../../repositories/AppointmentRepository';
import { AppDataSource } from '../../orm/dbCreateConnection';
import { authMiddleware, roleMiddleware } from '../../middlewares/auth.middleware';
import { DataSource } from 'typeorm';

const router = Router();

const initializeRouter = async () => {
    const dataSource: DataSource = await AppDataSource();
    const appointmentRepository = new AppointmentsRepository(dataSource);
    const appointmentService = new AppointmentService();
    const appointmentController = new AppointmentController(appointmentService);

    // Apply auth middleware to all routes
    router.use(authMiddleware);

    // Only admin can create, update, delete appointments
    router.post('/', roleMiddleware(['admin']), (req, res) => appointmentController.createAppointment(req, res));
    router.put('/:id', roleMiddleware(['admin']), (req, res) => appointmentController.updateAppointment(req, res));
    router.get('/doctor/:doctorId/:date',roleMiddleware(['admin', 'doctor']), (req, res)=> appointmentController.getDoctorAppointments(req,res));
    router.get('/patienAppointment/:patientId', (req, res)=> appointmentController.getPatientAppointments(req,res));
    // All authenticated users can view appointments
    router.get('/:id', (req, res) => appointmentController.getAppointmentById(req, res));
};

initializeRouter().catch((err) => {
    console.error('Failed to initialize appointments router:', err);
});

export default router;
