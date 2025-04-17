import { UsersService } from './UsersService';
import { Users } from '../orm/entities/Users';
import { Tokens } from '../orm/entities/Tokens';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../orm/dbCreateConnection';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { BadRequestException, UnauthorizedException } from '../exceptions';

export class AuthService {
    private usersService: UsersService;
    private dataSource: DataSource | null = null;
    private initializationPromise: Promise<void>;

    constructor(usersService: UsersService) {
        this.usersService = usersService;
        this.initializationPromise = this.initializeDataSource();
    }

    private async initializeDataSource() {
        this.dataSource = await AppDataSource();
    }

    private async ensureInitialized() {
        await this.initializationPromise;
    }

    async register(userData: Partial<Users>): Promise<Users> {
        const existingUserByEmail = await this.usersService.findByEmail(userData.email);
        if (existingUserByEmail) {
            throw new BadRequestException('Email already exists');
        }

        const existingUserByPhone = await this.usersService.findByPhoneNumber(userData.phoneNumber);
        if (existingUserByPhone) {
            throw new BadRequestException('Phone number already exists');
        }

        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }

        return this.usersService.createUser(userData as Users);
    }

    async login(email: string, password: string): Promise<{ user: Users; token: string }> {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password || '');
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!user.role) {
            throw new UnauthorizedException('User role not found');
        }

        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        await this.ensureInitialized();
        const tokenRepository = this.dataSource!.getRepository(Tokens);
        await tokenRepository.save({ token, user });

        return { user, token };
    }

    async logout(token: string): Promise<void> {
        await this.ensureInitialized();
        const tokenRepository = this.dataSource!.getRepository(Tokens);
        await tokenRepository.delete({ token });
    }

    async validateToken(token: string): Promise<Users | null> {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
            if (!decoded || !decoded.userId) {
                return null;
            }

            await this.ensureInitialized();
            const userRepository = this.dataSource!.getRepository(Users);
            return userRepository.findOne({
                where: { id: decoded.userId },
                relations: ['role']
            });
        } catch (error) {
            return null;
        }
    }
} 