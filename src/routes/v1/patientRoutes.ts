import { Router } from 'express';
import { PatientsController } from '../../controllers/PatientsController';
import { PatientsService } from '../../services/PatientsService';
import { PatientsRepository } from '../../repositories/PatientsRepository';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../orm/dbCreateConnection';
import { authMiddleware, roleMiddleware } from '../../middlewares/auth.middleware';
import { UsersRepository } from '../../repositories/UsersRepository';

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
    router.post('/', roleMiddleware(['admin','patient']), (req, res) => patientsController.createPatient(req, res));
    router.put('/:id', roleMiddleware(['admin']), (req, res) => patientsController.updatePatient(req, res));
    router.delete('/:id', roleMiddleware(['admin']), (req, res) => patientsController.deletePatient(req, res));

    // All authenticated users can view patients
    router.get('/', (req, res) => patientsController.getAllPatients(req, res));
    router.get('/:id', (req, res) => patientsController.getPatientById(req, res));
    router.get('/search/cccd', (req, res) => patientsController.findByCCCD(req, res));
    router.get('/search/phone', (req, res) => patientsController.findByPhoneNumber(req, res));
    router.get('/search/email', (req, res) => patientsController.findByEmail(req, res));
};

initializeRouter().catch((err) => {
    console.error('Failed to initialize router:', err);
});

export default router;