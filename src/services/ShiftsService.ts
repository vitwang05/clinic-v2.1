import { ShiftsRepository } from "../repositories/ShiftsRepository";
import { Shifts } from "../orm/entities/Shifts";
import { DataSource } from "typeorm";
import { AppDataSource } from "../orm/dbCreateConnection";
import { CreateShiftDTO } from "../dtos/shift/shift.dto";
import { UpdateShiftDTO } from "../dtos/shift/shift.dto";

export class ShiftsService {
  private shiftsRepository: ShiftsRepository;
  // private dataSource: DataSource | null = null;
  // private initializationPromise: Promise<void>;

  constructor(shiftsRepository: ShiftsRepository) {
    this.shiftsRepository = shiftsRepository;
    // this.initializationPromise = this.initializeDataSource();
  }

  // private async initializeDataSource() {
  //     this.dataSource = await   AppDataSource();
  // }

  // private async ensureInitialized() {
  //     await this.initializationPromise;
  // }

  async getAllShifts(): Promise<Shifts[]> {
    // const this.shiftsRepository = this.dataSource!.getRepository(Shifts);
    return this.shiftsRepository.findWithRelations(["employeeShifts"]);
  }

  async getShiftById(id: number): Promise<Shifts | null> {
    // const this.shiftsRepository = this.dataSource!.getRepository(Shifts);
    return this.shiftsRepository.findOneWithRelations(id, ["employeeShifts"]);
  }

  async createShift(shiftDTO: CreateShiftDTO): Promise<Shifts> {
    // const this.shiftsRepository = this.dataSource!.getRepository(Shifts);
    const shift = this.shiftsRepository.create(shiftDTO);
    return this.shiftsRepository.save(shift);
  }

  async updateShift(
    id: number,
    shiftDTO: UpdateShiftDTO
  ): Promise<Shifts | null> {
    // const this.shiftsRepository = this.dataSource!.getRepository(Shifts);

    const existingShift = await this.getShiftById(id);
    if (!existingShift) {
      return null;
    }

    await this.shiftsRepository.update(id, shiftDTO);
    return this.shiftsRepository.findOneWithRelations(id, ["employeeShifts"]);

  }

  async deleteShift(id: number): Promise<boolean> {
    // const this.shiftsRepository = this.dataSource!.getRepository(Shifts);

    const existingShift = await this.getShiftById(id);
    if (!existingShift) {
      return false;
    }

    await this.shiftsRepository.delete(id);
    return true;
  }
}
