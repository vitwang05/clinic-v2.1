import { TestTypeRepository } from '../repositories/TestTypeRepository';
import { TestType } from '../orm/entities/TestType';
import { BadRequestException, NotFoundException } from '../exceptions';

export class TestTypeService {
    private testTypeRepository: TestTypeRepository;

    constructor(testTypeRepository: TestTypeRepository) {
        this.testTypeRepository = testTypeRepository;
    }

    async getAllTestTypes(): Promise<TestType[]> {
        return this.testTypeRepository.findAll();
    }

    async getTestTypeById(id: number): Promise<TestType> {
        const testType = await this.testTypeRepository.findOne(id);
        if (!testType) {
            throw new NotFoundException('Test type not found');
        }
        return testType;
    }

    async createTestType(testTypeData: Partial<TestType>): Promise<TestType> {
        const existingTestType = await this.testTypeRepository.findOne({ name: testTypeData.name } as any);
        if (existingTestType) {
            throw new BadRequestException('Test type name already exists');
        }
        return this.testTypeRepository.save(testTypeData as TestType);
    }

    async updateTestType(id: number, testTypeData: Partial<TestType>): Promise<TestType> {
        const testType = await this.getTestTypeById(id);
        if (testTypeData.name && testTypeData.name !== testType.name) {
            const existingTestType = await this.testTypeRepository.findOne({ name: testTypeData.name } as any);
            if (existingTestType) {
                throw new BadRequestException('Test type name already exists');
            }
        }
        return this.testTypeRepository.update(id, testTypeData);
    }

    async deleteTestType(id: number): Promise<void> {
        const testType = await this.getTestTypeById(id);
        await this.testTypeRepository.delete(id);
    }
} 