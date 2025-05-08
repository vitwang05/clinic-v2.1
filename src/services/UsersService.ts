import { UsersRepository } from "../repositories/UsersRepository";
import { Users } from "../orm/entities/Users";
import { DataSource } from "typeorm";
import { AppDataSource } from "../orm/dbCreateConnection";
import { Roles } from "../orm/entities/Roles";
import { RegisterDTO } from "../dtos/auth/register.dto";
import { EmployeesRepository } from "../repositories/EmployeesRepository";
import { Employees } from "../orm/entities/Employees";
import { BadRequestException } from "../exceptions";

export class UsersService {
  private usersRepository: UsersRepository;
  private employeesRepository: EmployeesRepository;
  private dataSource: DataSource 
  // private dataSource: DataSource | null = null;
  // private initializationPromise: Promise<void>;

  constructor(usersRepository: UsersRepository, employeesRepository: EmployeesRepository, dataSource: DataSource) {
    this.usersRepository = usersRepository;
    this.employeesRepository = employeesRepository;
    this.dataSource = dataSource;
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
    user.role = await this.dataSource.getRepository(Roles).findOne({
      where: { name: 'patient' }
    });
    const savedUser = await this.usersRepository.save(user);
    // const userRepository = this.dataSource!.getRepository(Users);
    return this.usersRepository.findOneWithRelations(savedUser.id, ["role"]);
  }

  async createUserForEmployee(user: Users, roleId: number, employeeId: number): Promise<Users> {
    let employee: Employees | null = null;
    if(employeeId){
      employee = await this.employeesRepository.findOneWithRelations(employeeId, ["user"]);
      if(!employee){
        throw new BadRequestException('Employee not found');
      }
      if(employee.user){
        throw new BadRequestException('Employee already has a user');
      }
    }
    user.role = await this.dataSource.getRepository(Roles).findOne({
      where: { id: roleId }
    });
    const savedUser = await this.usersRepository.save(user as Users);

    if(savedUser){
      if(employee){
        employee.user = savedUser;
        await this.employeesRepository.save(employee);
      }
    }

    return savedUser;
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
