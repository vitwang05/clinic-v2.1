import { Router } from 'express';
import { MedicinesController } from '../../controllers/MedicineCotroller';
import { MedicinesService } from '../../services/MedicineService';
import { MedicinesRepository } from '../../repositories/MedicineRepository';
import { AppDataSource } from '../../orm/dbCreateConnection';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/auth.middleware';
import { validateDTO } from '../../middlewares/validation.middleware';
import { CreateMedicineDTO, UpdateMedicineDTO } from '../../dtos/medicine/medicine.dto';

const router = Router();

const initializeRouter = async () => {
    const dataSource = await AppDataSource.initialize();
    const repository = new MedicinesRepository(dataSource);
    const service = new MedicinesService(repository);
    const controller = new MedicinesController(service);

    router.use(authMiddleware);

    // Only admin can create/update/delete
    router.post('/', roleMiddleware(['admin', 'pharmacist']), validateDTO(CreateMedicineDTO), (req, res) => controller.createMedicine(req, res));
    router.put('/:id', roleMiddleware(['admin', 'pharmacist']), validateDTO(UpdateMedicineDTO), (req, res) => controller.updateMedicine(req, res));
    router.delete('/:id', roleMiddleware(['admin', 'pharmacist']), (req, res) => controller.deleteMedicine(req, res));

    // All authenticated users can view
    router.get('/', (req, res) => controller.getAllMedicines(req, res));
    router.get('/:id', (req, res) => controller.getMedicineById(req, res));
};

initializeRouter().catch((err) => console.error('Failed to initialize medicine router:', err));

export default router;
