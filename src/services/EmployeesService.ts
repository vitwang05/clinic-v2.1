import { EmployeesRepository } from "../repositories/EmployeesRepository";
import { Employees } from "../orm/entities/Employees";
import { DataSource } from "typeorm";
import { AppDataSource } from "../orm/dbCreateConnection";
import { CreateEmployeeDTO } from "../dtos/employee/employee.dto";
import { UpdateEmployeeDTO } from "../dtos/employee/employee.dto";
import { Positions } from "../orm/entities/Positions";

export class EmployeesService {
  private employeesRepository: EmployeesRepository;
  private dataSource: DataSource | null = null;
  private initializationPromise: Promise<void>;

  constructor(employeesRepository: EmployeesRepository) {
    this.employeesRepository = employeesRepository;
    this.initializationPromise = this.initializeDataSource();
  }

  private async initializeDataSource() {
    this.dataSource = await AppDataSource();
  }

  private async ensureInitialized() {
    await this.initializationPromise;
  }

  async getAllEmployees(): Promise<Employees[]> {
    await this.ensureInitialized();
    const employeeRepository = this.dataSource!.getRepository(Employees);
    return employeeRepository.find({
      relations: ["position", "user"],
    });
  }

  async getEmployeeById(id: number): Promise<Employees | null> {
    await this.ensureInitialized();
    const employeeRepository = this.dataSource!.getRepository(Employees);
    return employeeRepository.findOne({
      where: { id },
      relations: ["position", "user"],
    });
  }

  async createEmployee(employeeDTO: CreateEmployeeDTO): Promise<Employees> {
    await this.ensureInitialized();
    const employeeRepository = this.dataSource!.getRepository(Employees);

    const position = await this.dataSource!.getRepository(Positions).findOne({
      where: { id: employeeDTO.positionId },
    });

    if (!position) {
      throw new Error("Position not found");
    }
    const employee = employeeRepository.create({
      ...employeeDTO,
      position: position,
    });
    return employeeRepository.save(employee);
  }

  async updateEmployee(
    id: number,
    employeeDTO: UpdateEmployeeDTO
  ): Promise<Employees | null> {
    await this.ensureInitialized();
    const employeeRepository = this.dataSource!.getRepository(Employees);
    await employeeRepository.update(id, employeeDTO);
    return employeeRepository.findOne({
      where: { id },
      relations: ["position", "user"],
    });
  }

  async deleteEmployee(id: number): Promise<void> {
    await this.ensureInitialized();
    const employeeRepository = this.dataSource!.getRepository(Employees);
    await employeeRepository.delete(id);
  }
}
