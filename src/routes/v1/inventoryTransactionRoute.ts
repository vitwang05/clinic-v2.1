import { Router } from 'express';
import { InventoryTransactionController } from '../../controllers/InventoryTransactionController';
import { InventoryTransactionService } from '../../services/InventoryTransactionService';
import { InventoryTransactionRepository } from '../../repositories/InventoryTransactionRepository';
import { MedicinesRepository } from '../../repositories/MedicineRepository';
import { AppDataSource } from '../../orm/dbCreateConnection';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/auth.middleware';
import { validateDTO } from '../../middlewares/validation.middleware';
import { CreateInventoryTransactionDTO } from '../../dtos/inventory/inventory-transaction.dto';

const router = Router();

const initializeRouter = async () => {
    const dataSource = await AppDataSource.initialize();
    const inventoryTransactionRepository = new InventoryTransactionRepository(dataSource);
    const medicinesRepository = new MedicinesRepository(dataSource);
    const service = new InventoryTransactionService(inventoryTransactionRepository, medicinesRepository);
    const controller = new InventoryTransactionController(service);

    router.use(authMiddleware);

    // Only admin can create/delete transactions
    router.post('/', roleMiddleware(['admin']), validateDTO(CreateInventoryTransactionDTO), (req, res) => controller.createTransaction(req, res));
    router.delete('/:id', roleMiddleware(['admin']), (req, res) => controller.deleteTransaction(req, res));

    // All authenticated users can view
    router.get('/', (req, res) => controller.getAllTransactions(req, res));
    router.get('/:id', (req, res) => controller.getTransactionById(req, res));
};

initializeRouter().catch((err) => console.error('Failed to initialize inventory transaction router:', err));

export default router; 