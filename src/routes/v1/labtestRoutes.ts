import { Router } from 'express';
import { LabtestController } from '../../controllers/LabtestController';
import { LabtestService } from '../../services/LabtestService';
import { LabtestRepository } from '../../repositories/LabtestRepository';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../orm/dbCreateConnection';
import { authMiddleware, roleMiddleware } from '../../middlewares/auth.middleware';
import { CreateLabtestDTO, UpdateLabtestDTO } from '../../dtos/lab/labtest.dto';
import { validateDTO } from '../../middlewares/validation.middleware';

const router = Router();

const initializeRouter = async () => {
    const dataSource: DataSource = await AppDataSource.initialize();
    const labtestRepository = new LabtestRepository(dataSource);
    const labtestService = new LabtestService(labtestRepository);
    const labtestController = new LabtestController(labtestService);

    // Apply auth middleware to all routes
    router.use(authMiddleware);

    // Only admin can create, update, delete lab tests
    router.post('/', roleMiddleware(['admin']), validateDTO(CreateLabtestDTO), (req, res) => labtestController.createLabtest(req, res));
    router.put('/:id', roleMiddleware(['admin']), validateDTO(UpdateLabtestDTO), (req, res) => labtestController.updateLabtest(req, res));
    router.delete('/:id', roleMiddleware(['admin']), (req, res) => labtestController.deleteLabtest(req, res));

    // All authenticated users can view lab tests
    router.get('/', (req, res) => labtestController.getAllLabtests(req, res));
    router.get('/:id', (req, res) => labtestController.getLabtestById(req, res));
};

initializeRouter().catch((err) => {
    console.error('Failed to initialize router:', err);
});

export default router;