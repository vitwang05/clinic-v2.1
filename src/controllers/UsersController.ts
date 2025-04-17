import { Request, Response } from 'express';
import { UsersService } from '../services/UsersService';
import { ApiResponse } from '../utils/ApiResponse';
import { Users } from '../orm/entities/Users';

export class UsersController {
    private usersService: UsersService;

    constructor(usersService: UsersService) {
        this.usersService = usersService;
    }

    async getAllUsers(req: Request, res: Response): Promise<void> {
        const users = await this.usersService.getAllUsers();
        res.status(200).json(ApiResponse.success(users));
    }

    async getUserById(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const user = await this.usersService.getUserById(id);
        if (user) {
            res.status(200).json(ApiResponse.success(user));
        } else {
            res.status(404).send('User not found');
        }
    }

    async createUser(req: Request, res: Response): Promise<void> {
        const user: Users = req.body;

        const newUser = await this.usersService.createUser(user);
        res.status(201).json(ApiResponse.success(newUser));
    }

    async updateUser(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const user: Partial<Users> = req.body;
        const updatedUser = await this.usersService.updateUser(id, user);
        res.status(200).json(ApiResponse.success(updatedUser));
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        await this.usersService.deleteUser(id);
        res.status(204).json(ApiResponse.success(null));
    }
}