import { TimeFrameRepository } from '../repositories/TimeFrameRepository';
import { TimeFrame } from '../orm/entities/TimeFrame';
import { CreateTimeFrameDTO, GetDoctorTimeFramesDTO } from '../dtos/time-frame/time-frame.dto';
import { UpdateTimeFrameDTO } from '../dtos/time-frame/time-frame.dto';
import { BadRequestException, NotFoundException } from '../exceptions';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../orm/dbCreateConnection';
import { EmployeeShift } from '../orm/entities/EmployeeShift';
import { Shifts } from '../orm/entities/Shifts';
import { EmployeeShiftRepository } from '../repositories/EmployeeShiftRepository';

export class TimeFrameService {
    private timeFrameRepository: TimeFrameRepository;
    private employeeShiftRepository: EmployeeShiftRepository;


    constructor(timeFrameRepository: TimeFrameRepository,  employeeShiftRepository: EmployeeShiftRepository) {
        this.timeFrameRepository = timeFrameRepository;
        this.employeeShiftRepository =employeeShiftRepository;
      
    }


    async getAllTimeFrames(): Promise<TimeFrame[]> {
        return this.timeFrameRepository.findAll();
    }

    async getTimeFrameById(id: number): Promise<TimeFrame> {
        const timeFrame = await this.timeFrameRepository.findOne(id);
        if (!timeFrame) {
            throw new NotFoundException('Time frame not found');
        }
        return timeFrame;
    }

    async createTimeFrame(timeFrameDTO: CreateTimeFrameDTO): Promise<TimeFrame> {
        const existingTimeFrame = await this.timeFrameRepository.findOne({ timeFrameName: timeFrameDTO.timeFrameName } as any);
        if (existingTimeFrame) {
            throw new BadRequestException('Time frame name already exists');
        }
        return this.timeFrameRepository.save(timeFrameDTO as TimeFrame);
    }

    async updateTimeFrame(id: number, timeFrameDTO: UpdateTimeFrameDTO): Promise<TimeFrame> {
        const timeFrame = await this.getTimeFrameById(id);
        if (timeFrameDTO.timeFrameName && timeFrameDTO.timeFrameName !== timeFrame.timeFrameName) {
            const existingTimeFrame = await this.timeFrameRepository.findOne({ timeFrameName: timeFrameDTO.timeFrameName } as any);
            if (existingTimeFrame) {
                throw new BadRequestException('Time frame name already exists');
            }
        }
        return this.timeFrameRepository.update(id, timeFrameDTO);
    }

    async deleteTimeFrame(id: number): Promise<void> {
        const timeFrame = await this.getTimeFrameById(id);
        await this.timeFrameRepository.delete(id);
    }

    async getDoctorTimeFrames(dto: GetDoctorTimeFramesDTO): Promise<TimeFrame[]> {
 
    
    
        // Lấy tất cả ca làm việc của bác sĩ trong ngày
        const employeeShifts = await this.employeeShiftRepository.find({
            where: {
                employee: { id: dto.doctorId },
                shiftDate: dto.date
            },
            relations: ['shift']
        });
        if (employeeShifts.length === 0) return [];
    
        // Lấy tất cả khung giờ
        const allTimeFrames = await this.timeFrameRepository.findAll();
    
        // Gom tất cả khung giờ hợp lệ
        const availableTimeFrames = allTimeFrames.filter((timeFrame) => {
            const tfStart = new Date(`1970-01-01T${timeFrame.startTime}`);
            const tfEnd = new Date(`1970-01-01T${timeFrame.endTime}`);
    
            return employeeShifts.some(({ shift }) => {
                const shiftStart = new Date(`1970-01-01T${shift.startTime}`);
                const shiftEnd = new Date(`1970-01-01T${shift.endTime}`);
                return tfStart >= shiftStart && tfEnd <= shiftEnd;
            });
        });
    
        return availableTimeFrames;
    }
    
} 