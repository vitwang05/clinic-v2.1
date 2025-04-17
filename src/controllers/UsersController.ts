import { Request, Response } from 'express';
import { UsersService } from '../services/UsersService';
import { Users } from '../orm/entities/Users';

export class UsersController {
    private usersService: UsersService;

    constructor(usersService: UsersService) {
        this.usersService = usersService;
    }

    async getAllUsers(req: Request, res: Response): Promise<void> {
        const users = await this.usersService.getAllUsers();
        res.json(users);
    }

    async getUserById(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const user = await this.usersService.getUserById(id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('User not found');
        }
    }

    async createUser(req: Request, res: Response): Promise<void> {
        const user: Users = req.body;
        const newUser = await this.usersService.createUser(user);
        res.status(201).json(newUser);
    }

    async updateUser(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const user: Partial<Users> = req.body;
        const updatedUser = await this.usersService.updateUser(id, user);
        res.json(updatedUser);
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        await this.usersService.deleteUser(id);
        res.status(204).send();
    }
}