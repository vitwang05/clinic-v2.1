import { EmployeeShiftRepository } from '../repositories/EmployeeShiftRepository';
import { EmployeeShift } from '../orm/entities/EmployeeShift';
import { DataSource, MoreThanOrEqual, LessThanOrEqual, Between } from 'typeorm';
import { AppDataSource } from '../orm/dbCreateConnection';
import { CreateEmployeeShiftDTO } from '../dtos/employee-shift/employee-shift.dto';
import { UpdateEmployeeShiftDTO } from '../dtos/employee-shift/employee-shift.dto';
import { Employees } from '../orm/entities/Employees';
import { Shifts } from '../orm/entities/Shifts';

export class EmployeeShiftService {
    private employeeShiftRepository: EmployeeShiftRepository;
    private dataSource: DataSource | null = null;
    private initializationPromise: Promise<void>;

    constructor(employeeShiftRepository: EmployeeShiftRepository) {
        this.employeeShiftRepository = employeeShiftRepository;
        this.initializationPromise = this.initializeDataSource();
    }

    private async initializeDataSource() {
        this.dataSource = await AppDataSource();
    }

    private async ensureInitialized() {
        await this.initializationPromise;
    }

    private async checkEmployeeExists(employeeId: number): Promise<boolean> {
        const employeeRepository = this.dataSource!.getRepository(Employees);
        const employee = await employeeRepository.findOne({ where: { id: employeeId } });
        return !!employee;
    }

    private async checkShiftExists(shiftId: number): Promise<boolean> {
        const shiftRepository = this.dataSource!.getRepository(Shifts);
        const shift = await shiftRepository.findOne({ where: { id: shiftId } });
        return !!shift;
    }

    private async checkShiftOverlap(employeeId: number, shiftId: number, shiftDate: string): Promise<boolean> {
        const employeeShiftRepository = this.dataSource!.getRepository(EmployeeShift);
        const shiftRepository = this.dataSource!.getRepository(Shifts);

        // Lấy thông tin ca làm việc
        const shift = await shiftRepository.findOne({ where: { id: shiftId } });
        if (!shift) return false;

        // Tìm các ca làm việc của nhân viên trong ngày
        const existingShifts = await employeeShiftRepository.find({
            where: {
                employee: { id: employeeId },
                shiftDate: shiftDate
            },
            relations: ['shift']
        });

        // Kiểm tra xem có ca nào trùng thời gian không
        for (const existingShift of existingShifts) {
            const existingShiftInfo = existingShift.shift;
            if (
                (shift.startTime <= existingShiftInfo.endTime && shift.endTime >= existingShiftInfo.startTime) ||
                (existingShiftInfo.startTime <= shift.endTime && existingShiftInfo.endTime >= shift.startTime)
            ) {
                return true; // Có trùng lặp
            }
        }

        return false; // Không trùng lặp
    }

    async getAllEmployeeShifts(): Promise<EmployeeShift[]> {
        await this.ensureInitialized();
        const employeeShiftRepository = this.dataSource!.getRepository(EmployeeShift);
        return employeeShiftRepository.find({
            relations: ['employee', 'shift']
        });
    }

    async getEmployeeShiftById(id: number): Promise<EmployeeShift | null> {
        await this.ensureInitialized();
        const employeeShiftRepository = this.dataSource!.getRepository(EmployeeShift);
        return employeeShiftRepository.findOne({
            where: { id },
            relations: ['employee', 'shift']
        });
    }

    async getEmployeeShiftsByEmployeeId(employeeId: number): Promise<EmployeeShift[]> {
        await this.ensureInitialized();
        const employeeShiftRepository = this.dataSource!.getRepository(EmployeeShift);
        return employeeShiftRepository.find({
            where: { employee: { id: employeeId } },
            relations: ['employee', 'shift']
        });
    }

    async getEmployeeShiftsByShiftId(shiftId: number): Promise<EmployeeShift[]> {
        await this.ensureInitialized();
        const employeeShiftRepository = this.dataSource!.getRepository(EmployeeShift);
        return employeeShiftRepository.find({
            where: { shift: { id: shiftId } },
            relations: ['employee', 'shift']
        });
    }

    async getEmployeeShiftsByDate(date: string): Promise<EmployeeShift[]> {
        await this.ensureInitialized();
        const employeeShiftRepository = this.dataSource!.getRepository(EmployeeShift);
        return employeeShiftRepository.find({
            where: { shiftDate: date },
            relations: ['employee', 'shift']
        });
    }

    async getEmployeeShiftsByWeek(date: string): Promise<EmployeeShift[]> {
        await this.ensureInitialized();
        const employeeShiftRepository = this.dataSource!.getRepository(EmployeeShift);
        
        // Chuyển đổi ngày thành đối tượng Date
        const targetDate = new Date(date);
        
        // Tính ngày đầu tuần (Chủ nhật)
        const startOfWeek = new Date(targetDate);
        startOfWeek.setDate(targetDate.getDate() - targetDate.getDay());
        
        // Tính ngày cuối tuần (Thứ 7)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        // Format ngày thành chuỗi YYYY-MM-DD
        const startDateStr = startOfWeek.toISOString().split('T')[0];
        const endDateStr = endOfWeek.toISOString().split('T')[0];

        return employeeShiftRepository.find({
            where: {
                shiftDate: Between(startDateStr, endDateStr)
            },
            relations: ['employee', 'shift'],
            order: {
                shiftDate: 'ASC',
                shift: {
                    startTime: 'ASC'
                }
            }
        });
    }

    async getEmployeeShiftsByEmployeeIdAndWeek(employeeId: number, date: string): Promise<EmployeeShift[]> {
        await this.ensureInitialized();
        const employeeShiftRepository = this.dataSource!.getRepository(EmployeeShift);
        
        // Chuyển đổi ngày thành đối tượng Date
        const targetDate = new Date(date);
        
        // Tính ngày đầu tuần (Chủ nhật)
        const startOfWeek = new Date(targetDate);
        startOfWeek.setDate(targetDate.getDate() - targetDate.getDay());
        
        // Tính ngày cuối tuần (Thứ 7)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        // Format ngày thành chuỗi YYYY-MM-DD
        const startDateStr = startOfWeek.toISOString().split('T')[0];
        const endDateStr = endOfWeek.toISOString().split('T')[0];

        return employeeShiftRepository.find({
            where: {
                employee: { id: employeeId },
                shiftDate: Between(startDateStr, endDateStr)
            },
            relations: ['employee', 'shift'],
            order: {
                shiftDate: 'ASC',
                shift: {
                    startTime: 'ASC'
                }
            }
        });
    }

    async createEmployeeShift(employeeShiftDTO: CreateEmployeeShiftDTO): Promise<EmployeeShift> {
        await this.ensureInitialized();
        const employeeShiftRepository = this.dataSource!.getRepository(EmployeeShift);
        const employeeRepository = this.dataSource!.getRepository(Employees);
        const shiftRepository = this.dataSource!.getRepository(Shifts);

        // Kiểm tra nhân viên tồn tại
        const employeeExists = await this.checkEmployeeExists(employeeShiftDTO.employeeId);
        if (!employeeExists) {
            throw new Error('Nhân viên không tồn tại');
        }

        // Kiểm tra ca làm việc tồn tại
        const shiftExists = await this.checkShiftExists(employeeShiftDTO.shiftId);
        if (!shiftExists) {
            throw new Error('Ca làm việc không tồn tại');
        }

        // Kiểm tra trùng lặp ca làm việc
        const hasOverlap = await this.checkShiftOverlap(
            employeeShiftDTO.employeeId,
            employeeShiftDTO.shiftId,
            employeeShiftDTO.shiftDate
        );
        if (hasOverlap) {
            throw new Error('Nhân viên đã có ca làm việc trùng thời gian trong ngày này');
        }

        // Lấy thông tin employee và shift
        const employee = await employeeRepository.findOne({ where: { id: employeeShiftDTO.employeeId } });
        const shift = await shiftRepository.findOne({ where: { id: employeeShiftDTO.shiftId } });

        if (!employee || !shift) {
            throw new Error('Không tìm thấy thông tin nhân viên hoặc ca làm việc');
        }

        // Tạo employee shift
        const employeeShift = employeeShiftRepository.create({
            shiftDate: employeeShiftDTO.shiftDate,
            employee: employee,
            shift: shift
        });

        return employeeShiftRepository.save(employeeShift);
    }

    async updateEmployeeShift(id: number, employeeShiftDTO: UpdateEmployeeShiftDTO): Promise<EmployeeShift | null> {
        await this.ensureInitialized();
        const employeeShiftRepository = this.dataSource!.getRepository(EmployeeShift);
        
        const existingEmployeeShift = await this.getEmployeeShiftById(id);
        if (!existingEmployeeShift) {
            return null;
        }

        // Nếu có thay đổi employeeId, shiftId hoặc shiftDate, cần kiểm tra lại
        if (employeeShiftDTO.employeeId || employeeShiftDTO.shiftId || employeeShiftDTO.shiftDate) {
            const employeeId = employeeShiftDTO.employeeId || existingEmployeeShift.employee.id;
            const shiftId = employeeShiftDTO.shiftId || existingEmployeeShift.shift.id;
            const shiftDate = employeeShiftDTO.shiftDate || existingEmployeeShift.shiftDate;

            // Kiểm tra nhân viên tồn tại
            if (employeeShiftDTO.employeeId) {
                const employeeExists = await this.checkEmployeeExists(employeeId);
                if (!employeeExists) {
                    throw new Error('Nhân viên không tồn tại');
                }
            }

            // Kiểm tra ca làm việc tồn tại
            if (employeeShiftDTO.shiftId) {
                const shiftExists = await this.checkShiftExists(shiftId);
                if (!shiftExists) {
                    throw new Error('Ca làm việc không tồn tại');
                }
            }

            // Kiểm tra trùng lặp ca làm việc (trừ ca hiện tại)
            const hasOverlap = await this.checkShiftOverlap(employeeId, shiftId, shiftDate);
            if (hasOverlap) {
                throw new Error('Nhân viên đã có ca làm việc trùng thời gian trong ngày này');
            }
        }

        await employeeShiftRepository.update(id, employeeShiftDTO);
        return employeeShiftRepository.findOne({
            where: { id },
            relations: ['employee', 'shift']
        });
    }

    async deleteEmployeeShift(id: number): Promise<boolean> {
        await this.ensureInitialized();
        const employeeShiftRepository = this.dataSource!.getRepository(EmployeeShift);
        
        const existingEmployeeShift = await this.getEmployeeShiftById(id);
        if (!existingEmployeeShift) {
            return false;
        }

        await employeeShiftRepository.delete(id);
        return true;
    }
} 