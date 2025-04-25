import { Router } from 'express';
import { PrescriptionsController } from '../../controllers/PrescriptionsController';
import { PrescriptionsService } from '../../services/PrescriptionsService';
import { PrescriptionsRepository } from '../../repositories/PrescriptionsRepository';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../orm/dbCreateConnection';
import { authMiddleware, roleMiddleware } from '../../middlewares/auth.middleware';
import { validateDTO } from '../../middlewares/validation.middleware';
import { CreatePrescriptionDTO, UpdatePrescriptionDTO } from '../../dtos/prescription/prescription.dto';

const router = Router();

const initializeRouter = async () => {
    const dataSource: DataSource = await AppDataSource.initialize();
    const prescriptionsRepository = new PrescriptionsRepository(dataSource);
    const prescriptionsService = new PrescriptionsService(prescriptionsRepository);
    const prescriptionsController = new PrescriptionsController(prescriptionsService);

    // Apply auth middleware to all routes
    router.use(authMiddleware);

    // Only admin can create, update, delete prescriptions
    router.post('/', roleMiddleware(['admin','pharmacist']), validateDTO(CreatePrescriptionDTO), (req, res) => prescriptionsController.createPrescription(req, res));
    router.put('/:id', roleMiddleware(['admin','pharmacist']), validateDTO(UpdatePrescriptionDTO), (req, res) => prescriptionsController.updatePrescription(req, res));
    router.delete('/:id', roleMiddleware(['admin']), (req, res) => prescriptionsController.deletePrescription(req, res));

    // All authenticated users can view prescriptions
    router.get('/', (req, res) => prescriptionsController.getAllPrescriptions(req, res));
    router.get('/:id', (req, res) => prescriptionsController.getPrescriptionById(req, res));
};

initializeRouter().catch((err) => {
    console.error('Failed to initialize router:', err);
});

export default router; 