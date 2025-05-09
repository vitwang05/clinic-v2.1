import { Router } from 'express';
import { TimeFrameController } from '../../controllers/TimeFrameController';
import { TimeFrameService } from '../../services/TimeFrameService';
import { TimeFrameRepository } from '../../repositories/TimeFrameRepository';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../orm/dbCreateConnection';
import { authMiddleware, roleMiddleware } from '../../middlewares/auth.middleware';
import { EmployeeShiftRepository } from '../../repositories/EmployeeShiftRepository';
import { validateDTO } from '../../middlewares/validation.middleware';
import { CreateTimeFrameDTO, UpdateTimeFrameDTO } from '../../dtos/time-frame/time-frame.dto';

const router = Router();

const initializeRouter = async () => {
    const dataSource: DataSource = await AppDataSource.initialize(); // Ensure DB connection is established

    const timeFrameRepository = new TimeFrameRepository(dataSource);
    const employeeShiftRepository = new EmployeeShiftRepository(dataSource);
    const timeFrameService = new TimeFrameService(timeFrameRepository, employeeShiftRepository);
    const timeFrameController = new TimeFrameController(timeFrameService);

    router.use(authMiddleware);

    // Lấy tất cả khung giờ
    router.get('/', (req, res) => timeFrameController.getAllTimeFrames(req, res));

    // Lấy khung giờ theo ID
    router.get('/:id', (req, res) => timeFrameController.getTimeFrameById(req, res));

    // Lấy khung giờ theo ID của bác sĩ
    router.get('/:doctorId/:date', (req, res) => timeFrameController.getDoctorTimeFrames(req, res));

    // Tạo khung giờ mới (chỉ admin)
    router.post('/', roleMiddleware(['admin']), validateDTO(CreateTimeFrameDTO), (req, res) => timeFrameController.createTimeFrame(req, res));

    // Cập nhật khung giờ (chỉ admin)
    router.put('/:id', roleMiddleware(['admin']), validateDTO(UpdateTimeFrameDTO), (req, res) => timeFrameController.updateTimeFrame(req, res));

    // Xóa khung giờ (chỉ admin)
    router.delete('/:id', roleMiddleware(['admin']), (req, res) => timeFrameController.deleteTimeFrame(req, res));
};

initializeRouter().catch((err) => {
    console.error('Failed to initialize router:', err);
});

export default router; 