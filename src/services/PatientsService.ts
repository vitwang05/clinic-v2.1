import { PatientsRepository } from "../repositories/PatientsRepository";
import { Patients } from "../orm/entities/Patients";
import { DataSource } from "typeorm";
import { AppDataSource } from "../orm/dbCreateConnection";
import { CreatePatientDTO } from "../dtos/patient/patient.dto";
import { UpdatePatientDTO } from "../dtos/patient/patient.dto";
import { Users } from "../orm/entities/Users";
import { UsersRepository } from "../repositories/UsersRepository";

export class PatientsService {
  private patientsRepository: PatientsRepository;
  private usersRepository: UsersRepository;
  // private dataSource: DataSource | null = null;
  // private initializationPromise: Promise<void>;

  constructor(
    patientsRepository: PatientsRepository,
    usersRepository: UsersRepository
  ) {
    this.patientsRepository = patientsRepository;
    this.usersRepository = usersRepository;
    // this.initializationPromise = this.initializeDataSource();
  }

  // private async initializeDataSource() {
  //     this.dataSource = await AppDataSource();
  // }

  // private async ensureInitialized() {
  //     await this.initializationPromise;
  // }

  async getAllPatients(
    userId?: number,
    isAdmin: boolean = false
  ): Promise<Patients[]> {
    // const patientRepository = this.dataSource!.getRepository(Patients);
    const whereCondition = isAdmin ? {} : { user: { id: userId } };
    return this.patientsRepository.findWithCondition(whereCondition, ["user"]);
  }

  async getPatientById(
    id: number,
    userId?: number,
    isAdmin: boolean = false
  ): Promise<Patients | null> {
    // const patientRepository = this.dataSource!.getRepository(Patients);
    const whereCondition = isAdmin ? { id } : { id, user: { id: userId } };
    return this.patientsRepository.findOneWithCondition(whereCondition, [
      "user",
    ]);
  }

  async getPatientsByUserId(userId: number): Promise<Patients[]> {
    return this.patientsRepository.findWithCondition(
      { user: { id: userId } }, // Bọc điều kiện trong đối tượng `where`
      ["user"] // Danh sách các mối quan hệ cần truy vấn
    );
  }

  async createPatient(patientDTO: CreatePatientDTO): Promise<Patients> {
    let user: Users | null = null;
    // Find the user
    if(patientDTO.userId){
      user = await this.usersRepository.findOne(patientDTO.userId);
      
      if (!user) {
        throw new Error("User not found");
      }
    }
      
    // Create patient with user relationship
    const patient = this.patientsRepository.create({
      ...patientDTO,
      user: user,
    });
    
    return this.patientsRepository.save(patient);
  }

  async updatePatient(
    id: number,
    patientDTO: UpdatePatientDTO,
    userId?: number,
    isAdmin: boolean = false
  ): Promise<Patients | null> {
    // const patientRepository = this.dataSource!.getRepository(Patients);

    // Check if patient exists and user has permission
    const existingPatient = await this.getPatientById(id, userId, isAdmin);
    if (!existingPatient) {
      return null;
    }

    await this.patientsRepository.update(id, patientDTO);
    return this.patientsRepository.findOneWithRelations(id, ["user"]);
  }

  async deletePatient(
    id: number,
    userId?: number,
    isAdmin: boolean = false
  ): Promise<boolean> {
    // const patientRepository = this.dataSource!.getRepository(Patients);

    // Check if patient exists and user has permission
    const existingPatient = await this.getPatientById(id, userId, isAdmin);
    if (!existingPatient) {
      return false;
    }

    await this.patientsRepository.delete(id);
    return true;
  }

  async findByCCCD(
    cccd: string,
    userId?: number,
    isAdmin: boolean = false
  ): Promise<Patients | null> {
    // const patientRepository = this.dataSource!.getRepository(Patients);
    const whereCondition = isAdmin ? { cccd } : { cccd, user: { id: userId } };
    return this.patientsRepository.findOneWithCondition(whereCondition, [
      "user",
    ]);
  }

  async findByPhoneNumber(
    phoneNumber: string,
    userId?: number,
    isAdmin: boolean = false
  ): Promise<Patients | null> {
    // const patientRepository = this.dataSource!.getRepository(Patients);
    const whereCondition = isAdmin
      ? { phoneNumber }
      : { phoneNumber, user: { id: userId } };
    return this.patientsRepository.findOneWithCondition(whereCondition, [
      "user",
    ]);
  }

  async findByEmail(
    email: string,
    userId?: number,
    isAdmin: boolean = false
  ): Promise<Patients | null> {
    // const patientRepository = this.dataSource!.getRepository(Patients);
    const whereCondition = isAdmin
      ? { email }
      : { email, user: { id: userId } };
    return this.patientsRepository.findOneWithCondition(whereCondition, [
      "user",
    ]);
  }
}
