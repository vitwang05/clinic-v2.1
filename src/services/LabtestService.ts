import { LabtestRepository } from '../repositories/LabtestRepository';
import { Labtest } from '../orm/entities/Labtest';
import { BadRequestException, NotFoundException } from '../exceptions';
import { CreateLabtestDTO } from '../dtos/lab/labtest.dto';
import { MedicalRecordRepository } from '../repositories/MedicalRecordRepository';
import { EmployeesRepository } from '../repositories/EmployeesRepository';
import { TestTypeRepository } from '../repositories/TestTypeRepository';
export class LabtestService {
    private labtestRepository: LabtestRepository;
    private medicalRecordRepository: MedicalRecordRepository;
    private doctorRepository: EmployeesRepository;
    private testTypeRepository: TestTypeRepository;
    constructor(labtestRepository: LabtestRepository, medicalRecordRepository: MedicalRecordRepository, doctorRepository: EmployeesRepository, testTypeRepository: TestTypeRepository) {
        this.labtestRepository = labtestRepository;
        this.medicalRecordRepository = medicalRecordRepository;
        this.doctorRepository = doctorRepository;
        this.testTypeRepository = testTypeRepository;
    }

    async getAllLabtests(): Promise<Labtest[]> {
        return this.labtestRepository.findWithRelations(['medicalRecord', 'doctor', 'testType']);
    }


    async getLabtestsByPatientId(patientId: number): Promise<Labtest[]> {

       return;
    }

    async getLabtestById(id: number): Promise<Labtest> {
        const labtest = await this.labtestRepository.findOne(id);
        if (!labtest) {
            throw new NotFoundException('Lab test not found');``
        }
        return labtest;
    }

    async createLabtest(labtestData: CreateLabtestDTO): Promise<Labtest> {
        const medicalRecord = await this.medicalRecordRepository.findOne(labtestData.medicalRecordId);
        if (!medicalRecord) {
            throw new NotFoundException('Medical record not found');
        }
        const doctor = await this.doctorRepository.findOne(labtestData.doctorId);
        if (!doctor) {
            throw new NotFoundException('Doctor not found');
        }
        const testType = await this.testTypeRepository.findOne(labtestData.testTypeId);
        if (!testType) {        
            throw new NotFoundException('Test type not found');
        }
        const labtest = this.labtestRepository.create({ ...labtestData, medicalRecord, doctor, testType });

        return this.labtestRepository.save(labtest);
    }

    async updateLabtest(id: number, labtestData: Partial<Labtest>): Promise<Labtest> {
        const labtest = await this.getLabtestById(id);
        return this.labtestRepository.update(id, labtestData);
    }

    async deleteLabtest(id: number): Promise<void> {
        const labtest = await this.getLabtestById(id);
        await this.labtestRepository.delete(id);
    }
} 