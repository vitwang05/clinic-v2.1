import { EmployeeShiftRepository } from '../repositories/EmployeeShiftRepository';
import { EmployeeShift } from '../orm/entities/EmployeeShift';
import { DataSource, MoreThanOrEqual, LessThanOrEqual, Between } from 'typeorm';
import { AppDataSource } from '../orm/dbCreateConnection';
import { CreateEmployeeShiftDTO } from '../dtos/employee-shift/employee-shift.dto';
import { UpdateEmployeeShiftDTO } from '../dtos/employee-shift/employee-shift.dto';
import { Employees } from '../orm/entities/Employees';
import { Shifts } from '../orm/entities/Shifts';
import { ShiftsRepository } from '../repositories/ShiftsRepository';
import { EmployeesRepository } from '../repositories/EmployeesRepository';
export class EmployeeShiftService {
    constructor(
        private employeeShiftRepository: EmployeeShiftRepository,
        private shiftRepository: ShiftsRepository,
        private employeeRepository: EmployeesRepository
    ) {}

    private async checkEmployeeExists(employeeId: number): Promise<boolean> {
        const employee = await this.employeeRepository.findOne(employeeId);
        return !!employee;
    }

    private async checkShiftExists(shiftId: number): Promise<boolean> {
        const shift = await this.shiftRepository.findOne(shiftId);
        return !!shift;
    }

    private async checkShiftOverlap(employeeId: number, shiftId: number, shiftDate: string): Promise<boolean> {
        const shift = await this.shiftRepository.findOne(shiftId);
        if (!shift) return false;

        const existingShifts = await this.employeeShiftRepository.find({
            where: {
                employee: { id: employeeId },
                shiftDate
            },
            relations: ['shift']
        });
        const toMinutes = (timeStr: string): number => {
            const [h, m, s] = timeStr.split(':').map(Number);
            return h * 60 + m;
        };
        
        const newStart = toMinutes(shift.startTime);
        const newEnd = toMinutes(shift.endTime);
        
      
        for (const existingShift of existingShifts) {
            const s = existingShift.shift;
            const existStart = toMinutes(s.startTime);
            const existEnd = toMinutes(s.endTime);
          
            if (newStart < existStart) {
                if (newEnd > existStart) {
                    return true;
                }
            }
            if (newStart > existStart) {
                if (newStart < existEnd) {
                    return true;
                }
            }
        }

        return false;
    }

    async getAllEmployeeShifts(): Promise<EmployeeShift[]> {
        return this.employeeShiftRepository.find({
            relations: ['employee', 'shift']
        });
    }

    async getEmployeeShiftById(id: number): Promise<EmployeeShift | null> {
        return this.employeeShiftRepository.findOne({
            where: { id },
            relations: ['employee', 'shift']
        });
    }

    async getEmployeeShiftsByEmployeeId(employeeId: number): Promise<EmployeeShift[]> {
        return this.employeeShiftRepository.find({
            where: { employee: { id: employeeId } },
            relations: ['employee', 'shift']
        });
    }

    async getEmployeeShiftsByShiftId(shiftId: number): Promise<EmployeeShift[]> {
        return this.employeeShiftRepository.find({
            where: { shift: { id: shiftId } },
            relations: ['employee', 'shift']
        });
    }

    async getEmployeeShiftsByDate(date: string): Promise<EmployeeShift[]> {
        return this.employeeShiftRepository.find({
            where: { shiftDate: date },
            relations: ['employee', 'shift']
        });
    }

    async getEmployeeShiftsByWeek(date: string): Promise<EmployeeShift[]> {
        const { startDateStr, endDateStr } = this.getWeekRange(date);

        return this.employeeShiftRepository.find({
            where: {
                shiftDate: Between(startDateStr, endDateStr)
            },
            relations: ['employee', 'shift'],
            order: {
                shiftDate: 'ASC',
                shift: { startTime: 'ASC' }
            }
        });
    }

    async getEmployeeShiftsByEmployeeIdAndWeek(employeeId: number, date: string): Promise<EmployeeShift[]> {
        const { startDateStr, endDateStr } = this.getWeekRange(date);

        return this.employeeShiftRepository.find({
            where: {
                employee: { id: employeeId },
                shiftDate: Between(startDateStr, endDateStr)
            },
            relations: ['employee', 'shift'],
            order: {
                shiftDate: 'ASC',
                shift: { startTime: 'ASC' }
            }
        });
    }

    async createEmployeeShift(dto: CreateEmployeeShiftDTO): Promise<EmployeeShift> {
    
        const employeeExists = await this.checkEmployeeExists(dto.employeeId);
        if (!employeeExists) throw new Error('Nhân viên không tồn tại');

        const shiftExists = await this.checkShiftExists(dto.shiftId);
        if (!shiftExists) throw new Error('Ca làm việc không tồn tại');

        const hasOverlap = await this.checkShiftOverlap(dto.employeeId, dto.shiftId, dto.shiftDate);
        if (hasOverlap) throw new Error('Ca làm việc trùng thời gian');

        const employee = await this.employeeRepository.findOne(dto.employeeId);
        const shift = await this.shiftRepository.findOne( dto.shiftId );

        const employeeShift = this.employeeShiftRepository.create({
            shiftDate: dto.shiftDate,
            employee,
            shift
        });

        return this.employeeShiftRepository.save(employeeShift);
    }

    async updateEmployeeShift(id: number, dto: UpdateEmployeeShiftDTO): Promise<EmployeeShift | null> {
        const existing = await this.getEmployeeShiftById(id);
        if (!existing) return null;

        const employeeId = dto.employeeId ?? existing.employee.id;
        const shiftId = dto.shiftId ?? existing.shift.id;
        const shiftDate = dto.shiftDate ?? existing.shiftDate;

        if (dto.employeeId && !(await this.checkEmployeeExists(employeeId))) {
            throw new Error('Nhân viên không tồn tại');
        }

        if (dto.shiftId && !(await this.checkShiftExists(shiftId))) {
            throw new Error('Ca làm việc không tồn tại');
        }

        const hasOverlap = await this.checkShiftOverlap(employeeId, shiftId, shiftDate);
        if (hasOverlap) throw new Error('Ca làm việc trùng thời gian');

        await this.employeeShiftRepository.update(id, dto);
        return this.getEmployeeShiftById(id);
    }

    async deleteEmployeeShift(id: number): Promise<boolean> {
        const existing = await this.getEmployeeShiftById(id);
        if (!existing) return false;

        await this.employeeShiftRepository.delete(id);
        return true;
    }

    private getWeekRange(dateStr: string): { startDateStr: string; endDateStr: string } {
        const targetDate = new Date(dateStr);
        const startOfWeek = new Date(targetDate);
        startOfWeek.setDate(targetDate.getDate() - targetDate.getDay());

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const startDateStr = startOfWeek.toISOString().split('T')[0];
        const endDateStr = endOfWeek.toISOString().split('T')[0];
        return { startDateStr, endDateStr };
    }
}
