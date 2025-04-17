import { DataSource } from 'typeorm';
import { Users } from '../orm/entities/Users';
import { CommonRepository } from './CommonRepository';

export class UsersRepository extends CommonRepository<Users> {
    constructor(dataSource: DataSource) {
        super(Users, dataSource);
    }
}