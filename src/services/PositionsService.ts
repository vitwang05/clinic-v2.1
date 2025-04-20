import { PositionsRepository } from '../repositories/PositionsRepository';
import { Positions } from '../orm/entities/Positions';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../orm/dbCreateConnection';
import { CreatePositionDTO } from '../dtos/position/position.dto';
import { UpdatePositionDTO } from '../dtos/position/position.dto';

export class PositionsService {
    private positionsRepository: PositionsRepository;
    private dataSource: DataSource | null = null;
    private initializationPromise: Promise<void>;

    constructor(positionsRepository: PositionsRepository) {
        this.positionsRepository = positionsRepository;
        // this.initializationPromise = this.initializeDataSource();
    }

    // private async initializeDataSource() {
    //     this.dataSource = await AppDataSource();
    // }

    // private async ensureInitialized() {
    //     await this.initializationPromise;
    // }

    async getAllPositions(): Promise<Positions[]> {
        // await this.ensureInitialized();
        // const positionRepository = this.dataSource!.getRepository(Positions);
        // return positionRepository.find({
        //     relations: ['department']
        // });

        return this.positionsRepository.findWithRelations(["department"]);
    }

    async getPositionById(id: number): Promise<Positions | null> {
        return this.positionsRepository.findOneWithRelations(id,["department"]);
    }

    async createPosition(positionDTO: CreatePositionDTO): Promise<Positions> {
        const savedPosition = await this.positionsRepository.create(positionDTO);
        return this.positionsRepository.save(savedPosition);
    }

    async updatePosition(id: number, positionDTO: UpdatePositionDTO): Promise<Positions | null> {
        // await this.ensureInitialized();
        // const positionRepository = this.dataSource!.getRepository(Positions);
        await this.positionsRepository.update(id, positionDTO);
        // return positionRepository.findOne({
        //     where: { id },
        //     relations: ['department']
        // });
        return this.positionsRepository.findOneWithRelations(id,["department"]);
    }

    async deletePosition(id: number): Promise<void> {
        // await this.ensureInitialized();
        // const positionRepository = this.dataSource!.getRepository(Positions);
        await this.positionsRepository.delete(id);
    }
} 