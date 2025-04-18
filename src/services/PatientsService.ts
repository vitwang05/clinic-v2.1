import { PatientsRepository } from '../repositories/PatientsRepository';
import { Patients } from '../orm/entities/Patients';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../orm/dbCreateConnection';
import { CreatePatientDTO } from '../dtos/patient/patient.dto';
import { UpdatePatientDTO } from '../dtos/patient/patient.dto';
import { Users } from '../orm/entities/Users';

export class PatientsService {
    private patientsRepository: PatientsRepository;
    private dataSource: DataSource | null = null;
    private initializationPromise: Promise<void>;

    constructor(patientsRepository: PatientsRepository) {
        this.patientsRepository = patientsRepository;
        this.initializationPromise = this.initializeDataSource();
    }

    private async initializeDataSource() {
        this.dataSource = await AppDataSource();
    }

    private async ensureInitialized() {
        await this.initializationPromise;
    }

    async getAllPatients(userId?: number, isAdmin: boolean = false): Promise<Patients[]> {
        await this.ensureInitialized();
        const patientRepository = this.dataSource!.getRepository(Patients);
        const whereCondition = isAdmin ? {} : { user: { id: userId } };
        return patientRepository.find({
            where: whereCondition,
            relations: ['user']
        });
    }

    async getPatientById(id: number, userId?: number, isAdmin: boolean = false): Promise<Patients | null> {
        await this.ensureInitialized();
        const patientRepository = this.dataSource!.getRepository(Patients);
        const whereCondition = isAdmin ? { id } : { id, user: { id: userId } };
        return patientRepository.findOne({
            where: whereCondition,
            relations: ['user']
        });
    }

    async getPatientsByUserId(userId: number): Promise<Patients[]> {
        await this.ensureInitialized();
        const patientRepository = this.dataSource!.getRepository(Patients);
        return patientRepository.find({
            where: { user: { id: userId } },
            relations: ['user']
        });
    }

    async createPatient(patientDTO: CreatePatientDTO): Promise<Patients> {
        await this.ensureInitialized();
        const patientRepository = this.dataSource!.getRepository(Patients);
        const userRepository = this.dataSource!.getRepository(Users);
        
        // Find the user
        const user = await userRepository.findOne({
            where: { id: patientDTO.userId }
        });

        if (!user) {
            throw new Error('User not found');
        }

        // Create patient with user relationship
        const patient = patientRepository.create({
            ...patientDTO,
            user: user
        });

        return patientRepository.save(patient);
    }

    async updatePatient(id: number, patientDTO: UpdatePatientDTO, userId?: number, isAdmin: boolean = false): Promise<Patients | null> {
        await this.ensureInitialized();
        const patientRepository = this.dataSource!.getRepository(Patients);
        
        // Check if patient exists and user has permission
        const existingPatient = await this.getPatientById(id, userId, isAdmin);
        if (!existingPatient) {
            return null;
        }

        await patientRepository.update(id, patientDTO);
        return patientRepository.findOne({
            where: { id },
            relations: ['user']
        });
    }

    async deletePatient(id: number, userId?: number, isAdmin: boolean = false): Promise<boolean> {
        await this.ensureInitialized();
        const patientRepository = this.dataSource!.getRepository(Patients);
        
        // Check if patient exists and user has permission
        const existingPatient = await this.getPatientById(id, userId, isAdmin);
        if (!existingPatient) {
            return false;
        }

        await patientRepository.delete(id);
        return true;
    }

    async findByCCCD(cccd: string, userId?: number, isAdmin: boolean = false): Promise<Patients | null> {
        await this.ensureInitialized();
        const patientRepository = this.dataSource!.getRepository(Patients);
        const whereCondition = isAdmin ? { cccd } : { cccd, user: { id: userId } };
        return patientRepository.findOne({
            where: whereCondition,
            relations: ['user']
        });
    }

    async findByPhoneNumber(phoneNumber: string, userId?: number, isAdmin: boolean = false): Promise<Patients | null> {
        await this.ensureInitialized();
        const patientRepository = this.dataSource!.getRepository(Patients);
        const whereCondition = isAdmin ? { phoneNumber } : { phoneNumber, user: { id: userId } };
        return patientRepository.findOne({
            where: whereCondition,
            relations: ['user']
        });
    }

    async findByEmail(email: string, userId?: number, isAdmin: boolean = false): Promise<Patients | null> {
        await this.ensureInitialized();
        const patientRepository = this.dataSource!.getRepository(Patients);
        const whereCondition = isAdmin ? { email } : { email, user: { id: userId } };
        return patientRepository.findOne({
            where: whereCondition,
            relations: ['user']
        });
    }
}