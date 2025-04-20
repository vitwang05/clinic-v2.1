import { DataSource } from 'typeorm';
import config from './config/ormconfig';

export const AppDataSource = new DataSource(config);

// Hàm khởi tạo kết nối
export const initializeDataSource = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log(`✅ Database connected: '${AppDataSource.options.database}'`);
    }
  } catch (err) {
    console.error('❌ Database connection error:', err);
    throw new Error('Failed to establish a database connection.');
  }
};
