import { Router } from 'express';
import { PrescriptionDetailController } from '../../controllers/PrescriptionDetailController';
import { PrescriptionDetailService } from '../../services/PrescriptionDetailService';
import { PrescriptionDetailRepository } from '../../repositories/PrescriptionDetailRepository';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../orm/dbCreateConnection';
import { authMiddleware, roleMiddleware } from '../../middlewares/auth.middleware';
import { CreatePrescriptionDetailDTO, UpdatePrescriptionDetailDTO } from '../../dtos/prescription/prescriptionDetail.dto';
import { validateDTO } from '../../middlewares/validation.middleware';


const router = Router();

const initializeRouter = async () => {
    const dataSource: DataSource = await AppDataSource.initialize();
    const prescriptionDetailRepository = new PrescriptionDetailRepository(dataSource);
    const prescriptionDetailService = new PrescriptionDetailService(prescriptionDetailRepository);
    const prescriptionDetailController = new PrescriptionDetailController(prescriptionDetailService);

    // Apply auth middleware to all routes
    router.use(authMiddleware);

    // Only admin can create, update, delete prescription details
    router.post('/', roleMiddleware(['admin', 'pharmacist']), validateDTO(CreatePrescriptionDetailDTO), (req, res) => prescriptionDetailController.createPrescriptionDetail(req, res));
    router.put('/:id', roleMiddleware(['admin', 'pharmacist']), validateDTO(UpdatePrescriptionDetailDTO), (req, res) => prescriptionDetailController.updatePrescriptionDetail(req, res));
    router.delete('/:id', roleMiddleware(['admin']), (req, res) => prescriptionDetailController.deletePrescriptionDetail(req, res));

    // All authenticated users can view prescription details
    router.get('/', (req, res) => prescriptionDetailController.getAllPrescriptionDetails(req, res));
    router.get('/:id', (req, res) => prescriptionDetailController.getPrescriptionDetailById(req, res));
};

initializeRouter().catch((err) => {
    console.error('Failed to initialize router:', err);
});

export default router;