import { Router, Request, Response, NextFunction } from 'express';
import { AuthController } from '../../controllers/AuthController';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { BadRequestException } from '../../exceptions';
import { RegisterDTO } from '../../dtos/auth/register.dto';
import { LoginDTO } from '../../dtos/auth/login.dto';

const router = Router();
const authController = new AuthController();

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

// Public routes
router.post('/register', validateDTO(RegisterDTO), (req, res) => authController.register(req, res));
router.post('/login', validateDTO(LoginDTO), (req, res) => authController.login(req, res));

// Protected routes
router.post('/logout', authMiddleware, async (req, res) => {
    await authController.logout(req, res);
});

export default router; 