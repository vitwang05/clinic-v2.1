import { AppDataSource } from '../orm/dbCreateConnection';
import { Tokens } from '../orm/entities/Tokens';
import { Users } from '../orm/entities/Users';

export class TokensService {
    private tokenRepo = AppDataSource.getRepository(Tokens);

    async saveToken(token: string, user: Users): Promise<Tokens> {
        const newToken = this.tokenRepo.create({ token, user });
        return this.tokenRepo.save(newToken);
    }

    async deleteToken(token: string): Promise<void> {
        await this.tokenRepo.delete({ token });
    }

    async findToken(token: string): Promise<Tokens | null> {
        return this.tokenRepo.findOne({ where: { token } });
    }
}
