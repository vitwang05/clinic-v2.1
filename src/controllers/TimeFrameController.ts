import { Request, Response } from 'express';
import { TimeFrameService } from '../services/TimeFrameService';
import { TimeFrameRepository } from '../repositories/TimeFrameRepository';
import { CreateTimeFrameDTO, GetDoctorTimeFramesDTO } from '../dtos/time-frame/time-frame.dto';
import { UpdateTimeFrameDTO } from '../dtos/time-frame/time-frame.dto';
import { ApiResponse } from '../utils/ApiResponse';

export class TimeFrameController {
    constructor(private timeFrameService: TimeFrameService) {}

    async getAllTimeFrames(req: Request, res: Response): Promise<void> {
        try {
            const timeFrames = await this.timeFrameService.getAllTimeFrames();
            res.status(200).json(ApiResponse.success(timeFrames));
        } catch (error) {
            res.status(500).json(ApiResponse.error('Error fetching time frames'));
        }
    }

    async getTimeFrameById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            const timeFrame = await this.timeFrameService.getTimeFrameById(id);
            res.status(200).json(ApiResponse.success(timeFrame));
        } catch (error) {
            if (error.message === 'Time frame not found') {
                res.status(404).json(ApiResponse.error('Time frame not found'));
            } else {
                res.status(500).json(ApiResponse.error('Error fetching time frame'));
            }
        }
    }

    async createTimeFrame(req: Request, res: Response): Promise<void> {
        try {
            const timeFrameDTO: CreateTimeFrameDTO = req.body;
            const timeFrame = await this.timeFrameService.createTimeFrame(timeFrameDTO);
            res.status(201).json(ApiResponse.success(timeFrame));
        } catch (error) {
            if (error.message === 'Time frame name already exists') {
                res.status(400).json(ApiResponse.error('Time frame name already exists'));
            } else {
                res.status(500).json(ApiResponse.error('Error creating time frame'));
            }
        }
    }

    async updateTimeFrame(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            const timeFrameDTO: UpdateTimeFrameDTO = req.body;
            const timeFrame = await this.timeFrameService.updateTimeFrame(id, timeFrameDTO);
            res.status(200).json(ApiResponse.success(timeFrame));
        } catch (error) {
            if (error.message === 'Time frame not found') {
                res.status(404).json(ApiResponse.error('Time frame not found'));
            } else if (error.message === 'Time frame name already exists') {
                res.status(400).json(ApiResponse.error('Time frame name already exists'));
            } else {
                res.status(500).json(ApiResponse.error('Error updating time frame'));
            }
        }
    }

    async deleteTimeFrame(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            await this.timeFrameService.deleteTimeFrame(id);
            res.status(200).json(ApiResponse.success(null, 'Time frame deleted successfully'));
        } catch (error) {
            if (error.message === 'Time frame not found') {
                res.status(404).json(ApiResponse.error('Time frame not found'));
            } else {
                res.status(500).json(ApiResponse.error('Error deleting time frame'));
            }
        }
    }

    async getDoctorTimeFrames(req: Request, res: Response): Promise<void> {
        try {
            console.log("run");
            const dto: GetDoctorTimeFramesDTO = {
                doctorId: Number(req.params.doctorId),
                date: req.params.date
            };
            console.log(dto);

            const timeFrames = await this.timeFrameService.getDoctorTimeFrames(dto);
            res.status(200).json(ApiResponse.success(timeFrames));
        } catch (error) {
            res.status(500).json(ApiResponse.error(error.message));
        }
    }
} 