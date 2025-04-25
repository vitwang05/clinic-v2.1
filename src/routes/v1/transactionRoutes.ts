import { Router } from 'express';
import { TransactionsController } from '../../controllers/TransactionsController';
import { TransactionsService } from '../../services/TransactionsService';
import { TransactionsRepository } from '../../repositories/TransactionsRepository';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../orm/dbCreateConnection';
import { authMiddleware, roleMiddleware } from '../../middlewares/auth.middleware';
import { validateDTO } from '../../middlewares/validation.middleware';
import { CreateTransactionDTO, UpdateTransactionDTO } from '../../dtos/transaction/transaction.dto';

const router = Router();

const initializeRouter = async () => {
    const dataSource: DataSource = await AppDataSource.initialize();
    const transactionsRepository = new TransactionsRepository(dataSource);
    const transactionsService = new TransactionsService(dataSource);
    const transactionsController = new TransactionsController(transactionsService);

    // Apply auth middleware to all routes
    router.use(authMiddleware);

    // Only admin can create, update, delete transactions
    router.post('/', roleMiddleware(['admin','pharmacist','receptionist']), validateDTO(CreateTransactionDTO), (req, res) => transactionsController.createTransaction(req, res));
    router.put('/:id', roleMiddleware(['admin','pharmacist','receptionist']), validateDTO(UpdateTransactionDTO), (req, res) => transactionsController.updateTransaction(req, res));
    router.delete('/:id', roleMiddleware(['admin','pharmacist','receptionist']), (req, res) => transactionsController.deleteTransaction(req, res));

    // All authenticated users can view transactions
    router.get('/', (req, res) => transactionsController.getAllTransactions(req, res));
    router.get('/:id', (req, res) => transactionsController.getTransactionById(req, res));
};

initializeRouter().catch((err) => {
    console.error('Failed to initialize router:', err);
});

export default router;