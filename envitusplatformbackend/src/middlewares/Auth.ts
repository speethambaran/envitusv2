import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { JwtService } from '../utils';
import { livedataApiLimit } from '../utils/apiRateLimit';

const jwtService = new JwtService();

// Middleware to verify if user is an admin
export const auth = (...allowed: String[]) => {
    const isAllowed = (role: String) => allowed.indexOf(role) > -1;
    return async function (req: Request, res: Response, next: NextFunction) {
        let token: any;
        let apiKey: any;
        if (req.headers.authorization) {
            try {
                let userToken = req.headers.authorization
                const tokenRegex = /Bearer\s(?<token>.*)/i
                token = tokenRegex.test(userToken) ? tokenRegex.exec(userToken): ''
                
                const userData = await jwtService.decodeJwt(token.groups.token);
                
                if (isAllowed(userData.user_role)){
                    req.body.user_id = userData.user_id;
                    req.body.user_role = userData.user_role;
                    next();
                }else{
                    return res.status(StatusCodes.UNAUTHORIZED).json({
                        status: 'failed',
                        message: "Authentication failed",
                        error: "Permission denied",
                    });
                }
            } catch (error) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    status: 'failed',
                    message: "Authentication failed",
                    error: "Invalid authorization token"
                });
            }
        }
        else if(req.headers.apikey){
            try{
                apiKey = await livedataApiLimit(req);
                if(apiKey == 'OK'){
                    next();
                }
                else {
                    return res.status(StatusCodes.UNAUTHORIZED).json({
                        status: 'failed',
                        message: "Authentication failed",
                        error: "Permission denied",
                    });
                }
            }
            catch(err){
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    status: 'failed',
                    message: "Authentication failed",
                    error: "Invalid authorization token"
                });
            }
        }
        else{
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: 'failed',
                message: "Authentication failed",
                error: "Permission denied",
            });
        }

    }
};