import { TransactionsRepository } from '../repositories/TransactionsRepository';
import { Transactions } from '../orm/entities/Transactions';
import { BadRequestException, NotFoundException } from '../exceptions';
import { CreateTransactionDTO, UpdateTransactionDTO } from '../dtos/transaction/transaction.dto';
import { DataSource } from "typeorm";
import { Prescriptions } from '../orm/entities/Prescriptions';
import { Appointments } from '../orm/entities/Appointments';
import { Labtest } from '../orm/entities/Labtest';
import { MedicalRecord } from '../orm/entities/MedicalRecord';
import { AppointmentStatus } from '../dtos/appointment/appointment.dto';
import { Users } from '../orm/entities/Users';
export class TransactionsService {
    constructor(
        private readonly dataSource: DataSource // Inject AppDataSource ở ngoài
      ) {}

    async getAllTransactions(): Promise<Transactions[]> {
        const repo = this.dataSource.getRepository(Transactions);
        return repo.find();
    }

    async getTransactionById(id: number): Promise<Transactions> {
        const repo = this.dataSource.getRepository(Transactions);
        const transaction = await repo.findOne({ where: { id } });
        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }
        return transaction;
    }

    async createTransaction(transactionData: CreateTransactionDTO): Promise<Transactions> {
        let totalMoney = 0;
        if(transactionData.prescriptionId){
            const repo = this.dataSource.getRepository(Prescriptions);
            const prescription = await repo.findOne({ where: { id: transactionData.prescriptionId } });
            if (!prescription) {
                throw new NotFoundException('Prescription not found');
            }
            totalMoney = Number(prescription.total);
            transactionData.appointmentId = null;
            const transactionRepo = this.dataSource.getRepository(Transactions);
            const transaction = transactionRepo.create({...transactionData, prescription: prescription, totalMoney: totalMoney});
            return transactionRepo.save(transaction);
        }
        if(transactionData.appointmentId){
            const repo = this.dataSource.getRepository(Appointments);
            const appointment = await repo.findOne({ where: { id: transactionData.appointmentId }, relations: ['patient', 'patient.user'], });
          
            const userRepo = this.dataSource.getRepository(Users);
            if (!appointment) {
                throw new NotFoundException('Appointment not found');
            }
            const user = await userRepo.findOne({ where: { id:appointment.patient.user.id } });
            if (!user) {
                throw new NotFoundException('User not found');
            }
            if(appointment.status !== AppointmentStatus.COMPLETED){
                throw new BadRequestException('Appointment is not completed');
            }
            const medicalRecordRepo = this.dataSource.getRepository(MedicalRecord);
            const medicalRecord = await medicalRecordRepo.findOne({ where: { appointmentId: appointment.id }, relations: ['appointment'] });
            if (!medicalRecord) {
                throw new NotFoundException('Medical record not found');
            }

            const labtest = await this.dataSource.getRepository(Labtest).find({ where: { medicalRecord: { id: medicalRecord.id }}, relations: ['testType'] });
   
            if (labtest.length === 0) {
                throw new NotFoundException('Lab test not found');
            }
            for (const test of labtest) {
                if(test.testType){
                    totalMoney += Number(test.testType.price);
                }
            }
            transactionData.prescriptionId = null;
            const transactionRepo = this.dataSource.getRepository(Transactions);
            const transaction = transactionRepo.create({...transactionData, appointment: appointment, totalMoney: totalMoney, user: user});
            return transactionRepo.save(transaction);
        }
    }

    async updateTransaction(id: number, transactionData: UpdateTransactionDTO): Promise<Transactions> {
        const repo = this.dataSource.getRepository(Transactions);
        const transaction = await repo.findOne({ where: { id } });
        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }
        const updateData = {
            ...transactionData,
            totalMoney: transactionData.totalMoney
        };
        await repo.update(id, updateData);
        return await repo.findOne({ where: { id } });
    }

    async deleteTransaction(id: number): Promise<void> {
        const repo = this.dataSource.getRepository(Transactions);
        const transaction = await repo.findOne({ where: { id } });
        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }
        await repo.delete(id);
    }
}