import { Request, Response } from 'express';
import { StatusCodes } from "http-status-codes";

export const getServerPreferences = (req: Request, res: Response) => {
    return res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Successfully retrieved data",
        preferences: {
            date: new Date(),
            offset: new Date().getTimezoneOffset()
        }
    });
}