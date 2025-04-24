import { TransactionsRepository } from '../repositories/TransactionsRepository';
import { Transactions } from '../orm/entities/Transactions';
import { BadRequestException, NotFoundException } from '../exceptions';
import { CreateTransactionDTO, UpdateTransactionDTO } from '../dtos/transaction/transaction.dto';
import { DataSource } from "typeorm";
import { Prescriptions } from '../orm/entities/Prescriptions';
import { Appointments } from '../orm/entities/Appointments';
import { Labtest } from '../orm/entities/Labtest';
import { MedicalRecord } from '../orm/entities/MedicalRecord';
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
            const transaction = transactionRepo.create({...transactionData, totalMoney: totalMoney.toString()});
            return transactionRepo.save(transaction);
        }
        if(transactionData.appointmentId){
            const repo = this.dataSource.getRepository(Appointments);
            const appointment = await repo.findOne({ where: { id: transactionData.appointmentId } });
            if (!appointment) {
                throw new NotFoundException('Appointment not found');
            }
            const medicalRecordRepo = this.dataSource.getRepository(MedicalRecord);
            const medicalRecord = await medicalRecordRepo.findOne({ where: { id: appointment.medicalRecord.id } });
            if (!medicalRecord) {
                throw new NotFoundException('Medical record not found');
            }
            const labtest = await this.dataSource.getRepository(Labtest).findOne({ where: { medicalRecord: medicalRecord } });
            if (!labtest) {
                throw new NotFoundException('Lab test not found');
            }
            totalMoney = Number(labtest.testType.price);
            transactionData.prescriptionId = null;
            const transactionRepo = this.dataSource.getRepository(Transactions);
            const transaction = transactionRepo.create({...transactionData, totalMoney: totalMoney.toString()});
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
            totalMoney: transactionData.totalMoney?.toString()
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