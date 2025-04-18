import { ShiftsRepository } from '../repositories/ShiftsRepository';
import { Shifts } from '../orm/entities/Shifts';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../orm/dbCreateConnection';
import { CreateShiftDTO } from '../dtos/shift/shift.dto';
import { UpdateShiftDTO } from '../dtos/shift/shift.dto';

export class ShiftsService {
    private shiftsRepository: ShiftsRepository;
    private dataSource: DataSource | null = null;
    private initializationPromise: Promise<void>;

    constructor(shiftsRepository: ShiftsRepository) {
        this.shiftsRepository = shiftsRepository;
        this.initializationPromise = this.initializeDataSource();
    }

    private async initializeDataSource() {
        this.dataSource = await AppDataSource();
    }

    private async ensureInitialized() {
        await this.initializationPromise;
    }

    async getAllShifts(): Promise<Shifts[]> {
        await this.ensureInitialized();
        const shiftRepository = this.dataSource!.getRepository(Shifts);
        return shiftRepository.find({
            relations: ['employeeShifts']
        });
    }

    async getShiftById(id: number): Promise<Shifts | null> {
        await this.ensureInitialized();
        const shiftRepository = this.dataSource!.getRepository(Shifts);
        return shiftRepository.findOne({
            where: { id },
            relations: ['employeeShifts']
        });
    }

    async createShift(shiftDTO: CreateShiftDTO): Promise<Shifts> {
        await this.ensureInitialized();
        const shiftRepository = this.dataSource!.getRepository(Shifts);
        const shift = shiftRepository.create(shiftDTO);
        return shiftRepository.save(shift);
    }

    async updateShift(id: number, shiftDTO: UpdateShiftDTO): Promise<Shifts | null> {
        await this.ensureInitialized();
        const shiftRepository = this.dataSource!.getRepository(Shifts);
        
        const existingShift = await this.getShiftById(id);
        if (!existingShift) {
            return null;
        }

        await shiftRepository.update(id, shiftDTO);
        return shiftRepository.findOne({
            where: { id },
            relations: ['employeeShifts']
        });
    }

    async deleteShift(id: number): Promise<boolean> {
        await this.ensureInitialized();
        const shiftRepository = this.dataSource!.getRepository(Shifts);
        
        const existingShift = await this.getShiftById(id);
        if (!existingShift) {
            return false;
        }

        await shiftRepository.delete(id);
        return true;
    }
} 