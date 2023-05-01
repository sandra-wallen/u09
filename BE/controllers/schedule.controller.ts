import { Request, Response } from "express";
import Schedule from "../database/models/schedule.model";

const getAllSchedules = async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        const schedules = await Schedule.find({ ownerId: req.body.id });

        if (schedules) {
            return res.status(200).json({
                success: true,
                schedules,
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "Something went wrong",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error,
        });
    }
};

const getSchedule = async (req: Request, res: Response) => {
    const scheduleId = req.params.scheduleId;
    try {
        const schedule = await Schedule.findById(scheduleId);

        if (schedule) {
            return res.status(200).json({
                success: true,
                schedule,
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "Could not find schedule",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error,
        });
    }
};

const createSchedule = async (req: Request, res: Response) => {
    const { ownerId, title, duration } = req.body;

    if (ownerId && title && duration) {
        try {
            const schedule = await new Schedule({
                ownerId,
                title,
                duration,
            }).save();

            return res.status(201).json({
                success: true,
                schedule,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error,
            });
        }
    }
};

const updateSchedule = async (req: Request, res: Response) => {
    const { scheduleId } = req.params;

    try {
        const updatedSchedule = await Schedule.findByIdAndUpdate(
            scheduleId,
            req.body,
            { new: true }
        );

        if (updatedSchedule) {
            return res.status(200).json({
                success: true,
                updatedSchedule,
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "Could not update schedule",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error,
        });
    }
};

const deleteSchedule = async (req: Request, res: Response) => {
    const { scheduleId } = req.params;

    try {
        const deletedSchedule = await Schedule.findByIdAndDelete(scheduleId);

        if (deletedSchedule) {
            return res.status(200).json({
                success: true,
                deletedSchedule,
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "Could not find schedule",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error,
        });
    }
};

export {
    getAllSchedules,
    getSchedule,
    createSchedule,
    updateSchedule,
    deleteSchedule,
};
