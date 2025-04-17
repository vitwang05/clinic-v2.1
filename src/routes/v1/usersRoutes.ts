import { Router } from 'express';
import { UsersController } from '../../controllers/UsersController';
import { UsersService } from '../../services/UsersService';
import { UsersRepository } from '../../repositories/UsersRepository';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../orm/dbCreateConnection';

const router = Router();

const initializeRouter = async () => {
  const dataSource: DataSource = await AppDataSource();
  const usersRepository = new UsersRepository(dataSource);
  const usersService = new UsersService(usersRepository);
  const usersController = new UsersController(usersService);

  router.get('/', (req, res) => usersController.getAllUsers(req, res));
  router.get('/:id', (req, res) => usersController.getUserById(req, res));
  router.post('/', (req, res) => usersController.createUser(req, res));
  router.put('/:id', (req, res) => usersController.updateUser(req, res));
  router.delete('/:id', (req, res) => usersController.deleteUser(req, res));
};

initializeRouter().catch((err) => {
  console.error('Failed to initialize router:', err);
});

export default router;