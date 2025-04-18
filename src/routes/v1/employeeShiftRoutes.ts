import { Router } from 'express';
import { EmployeeShiftController } from '../../controllers/EmployeeShiftController';
import { EmployeeShiftService } from '../../services/EmployeeShiftService';
import { EmployeeShiftRepository } from '../../repositories/EmployeeShiftRepository';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../orm/dbCreateConnection';
import { authMiddleware, roleMiddleware } from '../../middlewares/auth.middleware';


const router = Router();

const initializeRouter = async () => {
    const dataSource: DataSource = await AppDataSource();
    const employeeShiftRepository = new EmployeeShiftRepository(dataSource);
    const employeeShiftService = new EmployeeShiftService(employeeShiftRepository);
    const employeeShiftController = new EmployeeShiftController(employeeShiftService);
    router.use(authMiddleware);

    // Lấy tất cả ca làm việc
    router.get('/', (req, res) => employeeShiftController.getAllEmployeeShifts(req, res));

    // Lấy ca làm việc theo ID
    router.get('/:id',  (req, res) => employeeShiftController.getEmployeeShiftById(req, res));

    // Lấy ca làm việc của một nhân viên
    router.get('/employee/:employeeId', (req, res) => employeeShiftController.getEmployeeShiftsByEmployeeId(req, res));

    // Lấy nhân viên của một ca làm việc
    router.get('/shift/:shiftId',  (req, res) => employeeShiftController.getEmployeeShiftsByShiftId(req, res));

    // Lấy ca làm việc theo ngày
    router.get('/date/:date',  (req, res) => employeeShiftController.getEmployeeShiftsByDate(req, res));

    // Lấy ca làm việc theo tuần (tất cả nhân viên)
    router.get('/week/:date', (req, res) => employeeShiftController.getEmployeeShiftsByWeek(req, res));

    // Lấy ca làm việc theo tuần của một nhân viên
    router.get('/employee/:employeeId/week/:date', roleMiddleware(['admin']), (req, res) => employeeShiftController.getEmployeeShiftsByEmployeeIdAndWeek(req, res));

    // Tạo ca làm việc mới
    router.post('/', roleMiddleware(['admin']), (req, res) => employeeShiftController.createEmployeeShift(req, res));

    // Cập nhật ca làm việc
    router.put('/:id', roleMiddleware(['admin']), (req, res) => employeeShiftController.updateEmployeeShift(req, res));

    // Xóa ca làm việc
    router.delete('/:id', roleMiddleware(['admin']), (req, res) => employeeShiftController.deleteEmployeeShift(req, res));
};

initializeRouter().catch((err) => {
    console.error('Failed to initialize router:', err);
});

export default router; 