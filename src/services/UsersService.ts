import { UsersRepository } from '../repositories/UsersRepository';
import { Users } from '../orm/entities/Users';

export class UsersService {
    private usersRepository: UsersRepository;

    constructor(usersRepository: UsersRepository) {
        this.usersRepository = usersRepository;
    }

    async getAllUsers(): Promise<Users[]> {
        return this.usersRepository.findAll();
    }

    async getUserById(id: number): Promise<Users | null> {
        return this.usersRepository.findOne(id);
    }

    async createUser(user: Users): Promise<Users> {
        return this.usersRepository.save(user);
    }

    async updateUser(id: number, user: Partial<Users>): Promise<Users> {
        return this.usersRepository.update(id, user);
    }

    async deleteUser(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }
}