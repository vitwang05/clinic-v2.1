import { Router } from 'express';
import { TimeFrameController } from '../../controllers/TimeFrameController';
import { TimeFrameService } from '../../services/TimeFrameService';
import { TimeFrameRepository } from '../../repositories/TimeFrameRepository';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../orm/dbCreateConnection';
import { authMiddleware, roleMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

const initializeRouter = async () => {
    const dataSource: DataSource = await AppDataSource();
    const timeFrameRepository = new TimeFrameRepository(dataSource);
    const timeFrameService = new TimeFrameService(timeFrameRepository);
    const timeFrameController = new TimeFrameController(timeFrameService);

    router.use(authMiddleware);

    // Lấy tất cả khung giờ
    router.get('/', (req, res) => timeFrameController.getAllTimeFrames(req, res));

    // Lấy khung giờ theo ID
    router.get('/:id', (req, res) => timeFrameController.getTimeFrameById(req, res));

    // Lấy khung giờ theo ID của bác sĩ
    router.get('/:doctorId/:date', (req, res) => timeFrameController.getDoctorTimeFrames(req, res));

    // Tạo khung giờ mới (chỉ admin)
    router.post('/', roleMiddleware(['admin']), (req, res) => timeFrameController.createTimeFrame(req, res));

    // Cập nhật khung giờ (chỉ admin)
    router.put('/:id', roleMiddleware(['admin']), (req, res) => timeFrameController.updateTimeFrame(req, res));

    // Xóa khung giờ (chỉ admin)
    router.delete('/:id', roleMiddleware(['admin']), (req, res) => timeFrameController.deleteTimeFrame(req, res));
};

initializeRouter().catch((err) => {
    console.error('Failed to initialize router:', err);
});

export default router; 