import { DepartmentsRepository } from '../repositories/DepartmentsRepository';
import { Departments } from '../orm/entities/Departments';
import { BadRequestException, NotFoundException } from '../exceptions';
import { CreateDepartmentDTO } from '../dtos/department/department.dto';
export class DepartmentsService {
    private departmentsRepository: DepartmentsRepository;

    constructor(departmentsRepository: DepartmentsRepository) {
        this.departmentsRepository = departmentsRepository;
    }

    async getAllDepartments(): Promise<Departments[]> {
        return this.departmentsRepository.findAll();
    }

    async getDepartmentById(id: number): Promise<Departments> {
        const department = await this.departmentsRepository.findOne(id);
        if (!department) {
            throw new NotFoundException('Department not found');
        }
        return department;
    }

    async createDepartment(departmentData: CreateDepartmentDTO): Promise<Departments> {
        // const existingDepartment = await this.departmentsRepository.findOne({ departmentName: departmentData.departmentName } as any);
        // if (existingDepartment) {
        //     throw new BadRequestException('Department name already exists');
        // }
        const createDepartment = this.departmentsRepository.create(departmentData);
        return this.departmentsRepository.save(createDepartment);
    }

    async updateDepartment(id: number, departmentData: Partial<Departments>): Promise<Departments> {
        const department = await this.getDepartmentById(id);
        if (departmentData.departmentName && departmentData.departmentName !== department.departmentName) {
            const existingDepartment = await this.departmentsRepository.findOne({ departmentName: departmentData.departmentName } as any);
            if (existingDepartment) {
                throw new BadRequestException('Department name already exists');
            }
        }
        return this.departmentsRepository.update(id, departmentData);
    }

    async deleteDepartment(id: number): Promise<void> {
        const department = await this.getDepartmentById(id);
        await this.departmentsRepository.delete(id);
    }
} 