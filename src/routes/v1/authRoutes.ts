import { Router, Request, Response, NextFunction } from 'express';
import { AuthController } from '../../controllers/AuthController';
import { AuthService } from '../../services/AuthService';
import { AppDataSource } from '../../orm/dbCreateConnection';
import { DataSource } from 'typeorm';

import { authMiddleware, roleMiddleware } from '../../middlewares/auth.middleware';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { BadRequestException } from '../../exceptions';
import { RegisterDTO } from '../../dtos/auth/register.dto';
import { LoginDTO } from '../../dtos/auth/login.dto';
import { UsersService } from '../../services/UsersService';
import { TokensService } from '../../services/TokensService';
import { UsersRepository } from '../../repositories/UsersRepository';
import { ApiResponse } from '../../utils/ApiResponse';
import { EmployeesRepository } from '../../repositories/EmployeesRepository';
const router = Router();

// Validation middleware for DTOs
const validateDTO = (dtoClass: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dto = plainToClass(dtoClass, req.body);
        const errors = await validate(dto);

        if (errors.length > 0) {
            const message = errors.map(error => Object.values(error.constraints || {})).join(', ');
            throw new BadRequestException(message);
        }

        (req as any).body = dto;
        next();
    };
};

// Function to initialize and set up routes
const initializeRouter = async () => {
    try {
        const dataSource: DataSource = await AppDataSource.initialize(); // Ensure DB connection is established
        const usersRepository = new UsersRepository(dataSource);
        const employeesRepository = new EmployeesRepository(dataSource);
        // Initialize services and controller after DB connection is successful
        const usersService = new UsersService(usersRepository, employeesRepository, dataSource);  // Pass dataSource to UsersService
        const tokensService = new TokensService();  // Assuming TokensService does not need a DB connection
        const authService = new AuthService(usersService, tokensService);  // Pass initialized services to AuthService
        const authController = new AuthController(authService);  // Pass authService to AuthController

        // Set up routes
        router.post('/addUser', authMiddleware, roleMiddleware(['admin']), async (req, res) => authController.registerForEmployee(req, res));
        router.post('/register', validateDTO(RegisterDTO), (req, res) => authController.register(req, res));
        router.post('/login', validateDTO(LoginDTO), (req, res) => authController.login(req, res));
        router.post('/logout', authMiddleware, async (req, res) => {
            try {
                await authController.logout(req, res);  // Không trả về res ở đây
            } catch (error) {
                res.status(500).json(ApiResponse.error('An error occurred during logout'));
            }
        });
        

    } catch (err) {
        console.error('Failed to initialize auth router:', err);
    }
};

// Initialize router before using it
initializeRouter().catch((err) => {
    console.error('Error initializing auth routes:', err);
});

export default router;
