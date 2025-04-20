import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { UsersService } from '../services/UsersService';
import { UsersRepository } from '../repositories/UsersRepository';
import { AppDataSource } from '../orm/dbCreateConnection';
import { ApiResponse } from '../utils/ApiResponse';
import { LoginDTO } from '../dtos/auth/login.dto';
import { RegisterDTO } from '../dtos/auth/register.dto';
import { toUserDTO } from '../dtos/auth/user.dto';

export class AuthController {
    private authService: AuthService;
    // private initializationPromise: Promise<void>;

    
    constructor(authService: AuthService) {
        this.authService = authService;
    }

    async register(req: Request, res: Response) {
        try {

            const registerDTO: RegisterDTO = req.body;
            const user = await this.authService.register(registerDTO);
            res.status(201).json(ApiResponse.success(toUserDTO(user)));
        } catch (error) {
            res.status(400).json(ApiResponse.error(error));
        }
    }

    async login(req: Request, res: Response) {
        try {
            const loginDTO: LoginDTO = req.body;
            const result = await this.authService.login(loginDTO.email, loginDTO.password);
            res.status(200).json(ApiResponse.success({
                user: toUserDTO(result.user),
                token: result.token
            }));
        } catch (error) {
            res.status(400).json(ApiResponse.error(error));
        }
    }

    async logout(req: Request, res: Response) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(400).json(ApiResponse.error('Token is required'));
            }
            await this.authService.logout(token);
            res.status(200).json(ApiResponse.success(null, 'Logged out successfully'));
        } catch (error) {
            res.status(400).json(ApiResponse.error(error));
        }
    }

    async validateToken(req: Request, res: Response) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(400).json(ApiResponse.error('Token is required'));
            }
            const result = await this.authService.validateToken(token);
            res.status(200).json(ApiResponse.success(result));
        } catch (error) {
            res.status(400).json(ApiResponse.error(error));
        }
    }
} 