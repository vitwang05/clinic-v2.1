import { Router } from 'express';
import { DepartmentsController } from '../../controllers/DepartmentsController';
import { DepartmentsService } from '../../services/DepartmentsService';
import { DepartmentsRepository } from '../../repositories/DepartmentsRepository';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../orm/dbCreateConnection';
import { authMiddleware, roleMiddleware } from '../../middlewares/auth.middleware';
import { requireAdmin, requireStaff } from '../../middlewares/role.middleware';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateDepartmentDTO } from '../../dtos/department/department.dto';
import { UpdateDepartmentDTO } from '../../dtos/department/department.dto';
import { BadRequestException } from '../../exceptions';

const router = Router();

const initializeRouter = async () => {
    const dataSource: DataSource = await AppDataSource();
    const departmentsRepository = new DepartmentsRepository(dataSource);
    const departmentsService = new DepartmentsService(departmentsRepository);
    const departmentsController = new DepartmentsController(departmentsService);

    // Apply auth middleware to all routes
    router.use(authMiddleware);

    // Only admin can create, update, delete departments
    router.post('/', roleMiddleware(['admin']), (req, res) => departmentsController.createDepartment(req, res));
    router.put('/:id', roleMiddleware(['admin']), (req, res) => departmentsController.updateDepartment(req, res));
    router.delete('/:id', roleMiddleware(['admin']), (req, res) => departmentsController.deleteDepartment(req, res));

    // All authenticated users can view departments
    router.get('/', (req, res) => departmentsController.getAllDepartments(req, res));
    router.get('/:id', (req, res) => departmentsController.getDepartmentById(req, res));
};

initializeRouter().catch((err) => {
    console.error('Failed to initialize router:', err);
});

export default router; 