import { PrescriptionDetailRepository } from '../repositories/PrescriptionDetailRepository';
import { PrescriptionDetail } from '../orm/entities/PrescriptionDetail';
import { BadRequestException, NotFoundException } from '../exceptions';

export class PrescriptionDetailService {
    private prescriptionDetailRepository: PrescriptionDetailRepository;

    constructor(prescriptionDetailRepository: PrescriptionDetailRepository) {
        this.prescriptionDetailRepository = prescriptionDetailRepository;
    }

    async getAllPrescriptionDetails(): Promise<PrescriptionDetail[]> {
        return this.prescriptionDetailRepository.findAll();
    }

    async getPrescriptionDetailById(id: number): Promise<PrescriptionDetail> {
        const prescriptionDetail = await this.prescriptionDetailRepository.findOne(id);
        if (!prescriptionDetail) {
            throw new NotFoundException('Prescription detail not found');
        }
        return prescriptionDetail;
    }

    async createPrescriptionDetail(prescriptionDetailData: Partial<PrescriptionDetail>): Promise<PrescriptionDetail> {
        return this.prescriptionDetailRepository.save(prescriptionDetailData as PrescriptionDetail);
    }

    async updatePrescriptionDetail(id: number, prescriptionDetailData: Partial<PrescriptionDetail>): Promise<PrescriptionDetail> {
        const prescriptionDetail = await this.getPrescriptionDetailById(id);
        return this.prescriptionDetailRepository.update(id, prescriptionDetailData);
    }

    async deletePrescriptionDetail(id: number): Promise<void> {
        const prescriptionDetail = await this.getPrescriptionDetailById(id);
        await this.prescriptionDetailRepository.delete(id);
    }
} 