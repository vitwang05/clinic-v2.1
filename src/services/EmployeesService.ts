import { EmployeesRepository } from "../repositories/EmployeesRepository";
import { Employees } from "../orm/entities/Employees";
import { DataSource } from "typeorm";
import { AppDataSource } from "../orm/dbCreateConnection";
import { CreateEmployeeDTO } from "../dtos/employee/employee.dto";
import { UpdateEmployeeDTO } from "../dtos/employee/employee.dto";
import { Positions } from "../orm/entities/Positions";
import { PositionsRepository } from "../repositories/PositionsRepository";

export class EmployeesService {
  private employeesRepository: EmployeesRepository;
  private positionsRepository: PositionsRepository;

  constructor(
    employeesRepository: EmployeesRepository,
    positionsRepository: PositionsRepository
  ) {
    this.employeesRepository = employeesRepository;
    this.positionsRepository = positionsRepository;
  }

  async getAllEmployees(): Promise<Employees[]> {
    // const employeeRepository = this.dataSource!.getRepository(Employees);
    return this.employeesRepository.findWithRelations(["position", "user"]);
  }

  async getEmployeeById(id: number): Promise<Employees | null> {
    // const this.employeesRepository = this.dataSource!.getRepository(Employees);
    return this.employeesRepository.findOneWithRelations(id, [
      "position",
      "user",
    ]);
  }

  async createEmployee(employeeDTO: CreateEmployeeDTO): Promise<Employees> {
    // const this.employeesRepository = this.dataSource!.getRepository(Employees);

    const position = await this.positionsRepository.findOne(
      employeeDTO.positionId
    );

    // this.dataSource!.getRepository(Positions).findOne({
    //   where: { id: employeeDTO.positionId },
    // });

    if (!position) {
      throw new Error("Position not found");
    }
    const employee = this.employeesRepository.create({
      ...employeeDTO,
      position: position,
    });
    return this.employeesRepository.save(employee);
  }

  async updateEmployee(
    id: number,
    employeeDTO: UpdateEmployeeDTO
  ): Promise<Employees | null> {
    // const this.employeesRepository = this.dataSource!.getRepository(Employees);
    await this.employeesRepository.update(id, employeeDTO);
    return this.employeesRepository.findOneWithRelations(id, [
      "position",
      "user",
    ]);
  }

  async deleteEmployee(id: number): Promise<void> {
    // const this.employeesRepository = this.dataSource!.getRepository(Employees);
    await this.employeesRepository.delete(id);
  }
}
