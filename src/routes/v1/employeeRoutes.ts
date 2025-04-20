import { Router } from 'express';
import { EmployeesController } from '../../controllers/EmployeesController';
import { EmployeesService } from '../../services/EmployeesService';
import { EmployeesRepository } from '../../repositories/EmployeesRepository';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../orm/dbCreateConnection';
import { authMiddleware, roleMiddleware } from '../../middlewares/auth.middleware';
import { PositionsRepository } from '../../repositories/PositionsRepository';

const     router = Router();

const initializeRouter = async () => {
    const dataSource: DataSource = await AppDataSource.initialize(); // Ensure DB connection is established

    const employeesRepository = new EmployeesRepository(dataSource);
    const positionsRepository = new PositionsRepository(dataSource);
    const employeesService = new EmployeesService(employeesRepository,positionsRepository);
    const employeesController = new EmployeesController(employeesService);

    // Apply auth middleware to all routes
    router.use(authMiddleware);

    // Only admin can create, update, delete employees
    router.post('/', roleMiddleware(['admin']), (req, res) => employeesController.createEmployee(req, res));
    router.put('/:id', roleMiddleware(['admin']), (req, res) => employeesController.updateEmployee(req, res));
    router.delete('/:id', roleMiddleware(['admin']), (req, res) => employeesController.deleteEmployee(req, res));

    // All authenticated users can view employees
    router.get('/', (req, res) => employeesController.getAllEmployees(req, res));
    router.get('/:id', (req, res) => employeesController.getEmployeeById(req, res));
};

initializeRouter().catch((err) => {
    console.error('Failed to initialize router:', err);
});

export default router; 