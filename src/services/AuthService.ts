import { UsersService } from './UsersService';
import { TokensService } from './TokensService'; // service riêng cho tokens
import { Users } from '../orm/entities/Users';
import { Tokens } from '../orm/entities/Tokens';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { BadRequestException, UnauthorizedException } from '../exceptions';
import { RegisterDTO } from '../dtos/auth/register.dto';
export class AuthService {
    private usersService: UsersService;
    private tokensService: TokensService;

    constructor(usersService: UsersService, tokensService: TokensService) {
        this.usersService = usersService;
        this.tokensService = tokensService;
    }

    async register(userData: RegisterDTO): Promise<Users> {
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

    async registerForEmployee(userData: RegisterDTO): Promise<Users> {
        const existingUserByEmail = await this.usersService.findByEmail(userData.email);
        if (existingUserByEmail) {
            throw new BadRequestException('Email already exists');
        };

        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }
     
        return this.usersService.createUserForEmployee(userData as Users, userData.roleId, userData.employeeId);
        
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

        await this.tokensService.saveToken(token, user);

        return { user, token };
    }

    async logout(token: string): Promise<void> {
        await this.tokensService.deleteToken(token);
    }

    async validateToken(token: string): Promise<Users | null> {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
            if (!decoded || !decoded.userId) {
                return null;
            }

            const isTokenValid = await this.tokensService.findToken(token);
            if (!isTokenValid) {
                return null;
            }

            return this.usersService.getUserById(decoded.userId);
        } catch (error) {
            return null;
        }
    }
}
