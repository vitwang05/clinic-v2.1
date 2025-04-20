import { UsersRepository } from "../repositories/UsersRepository";
import { Users } from "../orm/entities/Users";
import { DataSource } from "typeorm";
import { AppDataSource } from "../orm/dbCreateConnection";

export class UsersService {
  private usersRepository: UsersRepository;
  // private dataSource: DataSource | null = null;
  // private initializationPromise: Promise<void>;

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
    // this.initializationPromise = this.initializeDataSource();
  }

  // private async initializeDataSource() {
  //     this.dataSource = await AppDataSource();
  // }

  // private async ensureInitialized() {
  //     await this.initializationPromise;
  // }

  async getAllUsers(): Promise<Users[]> {
    // await this.ensureInitialized();
    // const userRepository = this.dataSource!.getRepository(Users);
    // return userRepository.find({
    //     relations: ['role']
    // });
    return this.usersRepository.findWithRelations(["role"]);
  }

  async getUserById(id: number): Promise<Users | null> {
    // await this.ensureInitialized();
    // const userRepository = this.dataSource!.getRepository(Users);
    return this.usersRepository.findOneWithRelations(id, ["role"]);
  }

  async createUser(user: Users): Promise<Users> {
    // await this.ensureInitialized();
    const savedUser = await this.usersRepository.save(user);
    // const userRepository = this.dataSource!.getRepository(Users);
    return this.usersRepository.findOneWithRelations(savedUser.id, ["role"]);
  }

  async updateUser(id: number, user: Partial<Users>): Promise<Users> {
    // await this.ensureInitialized();
    await this.usersRepository.update(id, user);
    // const userRepository = this.dataSource!.getRepository(Users);
    return this.usersRepository.findOneWithRelations(id, ["role"]);
  }

  async deleteUser(id: number): Promise<void> {
    // await this.ensureInitialized();
    await this.usersRepository.delete(id);
  }

  async findByEmail(email: string): Promise<Users | null> {
    // await this.ensureInitialized();
    // const userRepository = this.dataSource!.getRepository(Users);
    return this.usersRepository.findOneByFieldWithRelations(
        { email },
        ['role']
      );
  }

  async findByPhoneNumber(phoneNumber: string): Promise<Users | null> {
    return this.usersRepository.findOneByFieldWithRelations(
        { phoneNumber },
        ['role']
      );
  }
}
