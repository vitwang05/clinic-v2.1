import { Router } from 'express';
import { TestTypeController } from '../../controllers/TestTypeController';
import { TestTypeService } from '../../services/TestTypeService';
import { TestTypeRepository } from '../../repositories/TestTypeRepository';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../orm/dbCreateConnection';
import { authMiddleware, roleMiddleware } from '../../middlewares/auth.middleware';
import { validateDTO } from '../../middlewares/validation.middleware';
import { CreateTestTypeDTO, UpdateTestTypeDTO } from '../../dtos/test/testType.dto';

const router = Router();

const initializeRouter = async () => {
    const dataSource: DataSource = await AppDataSource.initialize();
    const testTypeRepository = new TestTypeRepository(dataSource);
    const testTypeService = new TestTypeService(testTypeRepository);
    const testTypeController = new TestTypeController(testTypeService);

    // Apply auth middleware to all routes
    router.use(authMiddleware);

    // Only admin can create, update, delete test types
    router.post('/', roleMiddleware(['admin']), validateDTO(CreateTestTypeDTO), (req, res) => testTypeController.createTestType(req, res));
    router.put('/:id', roleMiddleware(['admin']), validateDTO(UpdateTestTypeDTO), (req, res) => testTypeController.updateTestType(req, res));
    router.delete('/:id', roleMiddleware(['admin']), (req, res) => testTypeController.deleteTestType(req, res));

    // All authenticated users can view test types
    router.get('/', (req, res) => testTypeController.getAllTestTypes(req, res));
    router.get('/:id', (req, res) => testTypeController.getTestTypeById(req, res));
};

initializeRouter().catch((err) => {
    console.error('Failed to initialize router:', err);
});

export default router;