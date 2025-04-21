import { Router } from 'express';
import { ShiftsController } from '../../controllers/ShiftsController';
import { ShiftsService } from '../../services/ShiftsService';
import { ShiftsRepository } from '../../repositories/ShiftsRepository';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../orm/dbCreateConnection';
import { authMiddleware, roleMiddleware } from '../../middlewares/auth.middleware';
import { validateDTO } from '../../middlewares/validation.middleware';
import { CreateShiftDTO, UpdateShiftDTO } from '../../dtos/shift/shift.dto';

const router = Router();

const initializeRouter = async () => {
    const dataSource: DataSource = await AppDataSource.initialize(); // Ensure DB connection is established

    const shiftsRepository = new ShiftsRepository(dataSource);
    const shiftsService = new ShiftsService(shiftsRepository);
    const shiftsController = new ShiftsController(shiftsService);

    // Apply auth middleware to all routes
    router.use(authMiddleware);

    // Only admin can create, update, delete shifts
    router.post('/', roleMiddleware(['admin']), validateDTO(CreateShiftDTO), (req, res) => shiftsController.createShift(req, res));
    router.put('/:id', roleMiddleware(['admin']), validateDTO(UpdateShiftDTO), (req, res) => shiftsController.updateShift(req, res));
    router.delete('/:id', roleMiddleware(['admin']), (req, res) => shiftsController.deleteShift(req, res));

    // All authenticated users can view shifts
    router.get('/', (req, res) => shiftsController.getAllShifts(req, res));
    router.get('/:id', (req, res) => shiftsController.getShiftById(req, res));
};

initializeRouter().catch((err) => {
    console.error('Failed to initialize router:', err);
});

export default router; 