import { Router } from 'express';
import { UsersController } from '../../controllers/UsersController';
import { UsersService } from '../../services/UsersService';
import { UsersRepository } from '../../repositories/UsersRepository';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../orm/dbCreateConnection';

const router = Router();

const initializeRouter = async () => {
  try {
    const dataSource: DataSource = await AppDataSource.initialize(); // Khởi tạo kết nối DB
    const usersRepository = new UsersRepository(dataSource);
    const usersService = new UsersService(usersRepository);
    const usersController = new UsersController(usersService);

    // Định nghĩa các route
    router.get('/', (req, res) => usersController.getAllUsers(req, res));
    router.get('/:id', (req, res) => usersController.getUserById(req, res));
    router.post('/', (req, res) => usersController.createUser(req, res));
    router.put('/:id', (req, res) => usersController.updateUser(req, res));
    router.delete('/:id', (req, res) => usersController.deleteUser(req, res));
    
  } catch (err) {
    console.error('Failed to initialize router:', err);
    throw new Error('Failed to initialize router');
  }
};

// Khởi tạo router khi server bắt đầu
initializeRouter().then(() => {
  console.log('Router initialized successfully');
}).catch((err) => {
  console.error('Error during router initialization:', err);
});

export default router;
