import { Repository, DataSource, ObjectLiteral, FindOptionsWhere } from 'typeorm';

export class CommonRepository<T extends ObjectLiteral> {
    private repository: Repository<T>;

    constructor(entity: { new (): T }, dataSource: DataSource) {
        this.repository = dataSource.getRepository(entity);
    }

    async findAll(): Promise<T[]> {
        return this.repository.find();
    }

    async findOne(id: number | FindOptionsWhere<T>): Promise<T | null> {
        return this.repository.findOneBy(id as any);
    }

    async save(entity: T): Promise<T> {
        return this.repository.save(entity);
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }

    async update(id: number, partialEntity: Partial<T>): Promise<T> {
        await this.repository.update(id, partialEntity);
        return this.findOne(id) as Promise<T>;
    }

    async filter(criteria: Partial<T>): Promise<T[]> {
        return this.repository.find({ where: criteria });
    }

    async findWithRelations(relations: string[]): Promise<T[]> {
        return this.repository.find({ relations });
    }

    async findOneWithRelations(id: number, relations: string[]): Promise<T | null> {
        return this.repository.findOne({ where: { id } as any, relations });
    }
}