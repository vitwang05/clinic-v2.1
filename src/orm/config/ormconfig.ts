import { ConnectionOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import dotenv from 'dotenv';
dotenv.config();

const config: ConnectionOptions = {
  type: 'postgres',
  name: 'default',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // Đặt thành true để tự động tạo bảng
  logging: false,
  entities: ['src/orm/entities/*.ts'],
  migrations: ['src/orm/migrations/*.ts'],
  namingStrategy: new SnakeNamingStrategy(),
};

export = config;