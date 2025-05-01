import { Router } from 'express';
import { ServiceController } from '../../controllers/ServiceController';
import { ServiceService } from '../../services/ServiceService';
import { AppDataSource } from '../../orm/dbCreateConnection';
import { authMiddleware, roleMiddleware } from '../../middlewares/auth.middleware';
import { validateDTO } from '../../middlewares/validation.middleware';
import { CreateServiceDTO, UpdateServiceDTO } from '../../dtos/service/service.dto';
import { ServiceRepository } from '../../repositories/ServiceRepository';

const router = Router();

const initializeRouter = async () => {
    const dataSource = await AppDataSource.initialize();
    const serviceRepository = new ServiceRepository(dataSource);
    const serviceService = new ServiceService(serviceRepository);
    const serviceController = new ServiceController(serviceService);

    // Apply auth middleware to all routes
    router.use(authMiddleware);

    // Only admin can create, update, delete services
    router.post('/', 
        roleMiddleware(['admin']), 
        validateDTO(CreateServiceDTO), 
        (req, res) => serviceController.createService(req, res)
    );

    router.put('/:id', 
        roleMiddleware(['admin']), 
        validateDTO(UpdateServiceDTO), 
        (req, res) => serviceController.updateService(req, res)
    );

    router.delete('/:id', 
        roleMiddleware(['admin']), 
        (req, res) => serviceController.deleteService(req, res)
    );

    // All authenticated users can view services
    router.get('/', (req, res) => serviceController.getAllServices(req, res));
    router.get('/:id', (req, res) => serviceController.getServiceById(req, res));
};

initializeRouter().catch((err) => {
    console.error('Failed to initialize services router:', err);
});

export default router; 