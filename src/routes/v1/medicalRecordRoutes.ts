import { Router } from "express";
import { MedicalRecordController } from "../../controllers/medicalRecordController";
import { MedicalRecordService } from "../../services/MedicalRecordService";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../orm/dbCreateConnection";
import { authMiddleware, roleMiddleware } from "../../middlewares/auth.middleware";
const router = Router();
const initializeRouter = async () => {
    const dataSource: DataSource = await AppDataSource.initialize(); 
    console.log("zo");
    const medicalRecordService = new MedicalRecordService(dataSource);
    const medicalRecordController = new MedicalRecordController(medicalRecordService);
    router.use(authMiddleware);
    router.get("/:patientId",roleMiddleware(['admin','doctor','patient']), (req, res) => medicalRecordController.getMedicalRecord(req, res));
    router.put("/:medicalRecordId",roleMiddleware(['admin','doctor']), (req, res) => medicalRecordController.updateMedicalRecord(req, res));
};
initializeRouter().catch((err) => {
    console.error('Failed to initialize appointments router:', err);
});
export default router;
