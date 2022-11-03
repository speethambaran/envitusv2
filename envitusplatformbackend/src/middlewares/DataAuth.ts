import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

// Middleware to verify if user is an admin
export const dataAuth = () => {
    return async function (req: Request, res: Response, next: NextFunction) {
        if (req.headers['es-api-key']) {
            if (req.headers['es-api-key'] == process.env.ES_API_KEY) {
                next();
            } else {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    status: 'failed',
                    message: "Authentication failed",
                    error: "Invalid authorization token"
                });
            }
        }
        else {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: 'failed',
                message: "Authentication failed",
                error: "Authorization token missing",
            });
        }
    }
}