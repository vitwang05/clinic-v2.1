import { Router } from 'express';
import { PositionsController } from '../../controllers/PositionsController';
import { PositionsService } from '../../services/PositionsService';
import { PositionsRepository } from '../../repositories/PositionsRepository';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../orm/dbCreateConnection';
import { authMiddleware, roleMiddleware } from '../../middlewares/auth.middleware';
import { validateDTO } from '../../middlewares/validation.middleware';
import { CreatePositionDTO, UpdatePositionDTO } from '../../dtos/position/position.dto';    
import { DepartmentsRepository } from '../../repositories/DepartmentsRepository';
const router = Router();

const initializeRouter = async () => {
    const dataSource: DataSource = await AppDataSource.initialize(); // Ensure DB connection is established

    const positionsRepository = new PositionsRepository(dataSource);
    const departmentsRepository = new DepartmentsRepository(dataSource);
    const positionsService = new PositionsService(positionsRepository, departmentsRepository);
    const positionsController = new PositionsController(positionsService);

    // Apply auth middleware to all routes
    router.use(authMiddleware);

    // Only admin can create, update, delete positions
    router.post('/', roleMiddleware(['admin']), validateDTO(CreatePositionDTO), (req, res) => positionsController.createPosition(req, res));
    router.put('/:id', roleMiddleware(['admin']), validateDTO(UpdatePositionDTO), (req, res) => positionsController.updatePosition(req, res));
    router.delete('/:id', roleMiddleware(['admin']), (req, res) => positionsController.deletePosition(req, res));

    // All authenticated users can view positions
    router.get('/', (req, res) => positionsController.getAllPositions(req, res));
    router.get('/:id', (req, res) => positionsController.getPositionById(req, res));
};

initializeRouter().catch((err) => {
    console.error('Failed to initialize router:', err);
});

export default router; 