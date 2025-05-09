import { Router } from 'express';
import { PatientsController } from '../../controllers/PatientsController';
import { PatientsService } from '../../services/PatientsService';
import { PatientsRepository } from '../../repositories/PatientsRepository';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../orm/dbCreateConnection';
import { authMiddleware, roleMiddleware } from '../../middlewares/auth.middleware';
import { UsersRepository } from '../../repositories/UsersRepository';
import { validateDTO } from '../../middlewares/validation.middleware';
import { CreatePatientDTO, UpdatePatientDTO } from '../../dtos/patient/patient.dto';

const router = Router();

const initializeRouter = async () => {
    const dataSource: DataSource = await AppDataSource.initialize(); // Ensure DB connection is established

    const patientsRepository = new PatientsRepository(dataSource);
    const usersRepository = new UsersRepository(dataSource);
    const patientsService = new PatientsService(patientsRepository,usersRepository);
    const patientsController = new PatientsController(patientsService);

    // Apply auth middleware to all routes
    router.use(authMiddleware);

    // Only admin can create, update, delete patients
    router.post('/', roleMiddleware(['admin','patient','receptionist']), validateDTO(CreatePatientDTO), (req, res) => patientsController.createPatient(req, res));
    router.put('/:id', roleMiddleware(['admin', 'patient','receptionist']), validateDTO(UpdatePatientDTO), (req, res) => patientsController.updatePatient(req, res));
    router.delete('/:id', roleMiddleware(['admin', 'patient']), (req, res) => patientsController.deletePatient(req, res));

    // All authenticated users can view patients
    router.get('/', roleMiddleware(['admin','patient','receptionist']), (req, res) => patientsController.getAllPatients(req, res));
    router.get('/:id', roleMiddleware(['admin']), (req, res) => patientsController.getPatientById(req, res));
    router.get('/search/cccd', roleMiddleware(['admin']), (req, res) => patientsController.findByCCCD(req, res));
    router.get('/search/phone', roleMiddleware(['admin']), (req, res) => patientsController.findByPhoneNumber(req, res));
    router.get('/search/email', roleMiddleware(['admin']), (req, res) => patientsController.findByEmail(req, res));
};

initializeRouter().catch((err) => {
    console.error('Failed to initialize router:', err);
});

export default router;