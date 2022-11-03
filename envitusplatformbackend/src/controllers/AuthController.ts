import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { User } from '../models/Users';
import { StatusCodes } from 'http-status-codes';
import {
    JwtService
} from '@utils';
const jwtService = new JwtService();

/**
 * Authenticate -  User
 *
 * @method register
 * 
 * @param req
 * @param res
 */
export const login = (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ success: false, "errors": errors.array({ onlyFirstError: true }) });
    }
    const { username, password } = req.body;
    User.findOne({ $or: [{ email: username }, { userName: username }], activated: true }, (err: any, user: any) => {
        if (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Something went wrong! Please try later",
            });
        }
        if (user) {
            bcrypt.compare(password, user.password, async function (err, userAuth) {
                if (userAuth) {
                    const token = await jwtService.getJwt({
                        user_id: user._id,
                        user_role: user.role
                    });
                    return res.status(StatusCodes.OK).json({
                        success: true,
                        message: "Successfully authenticated",
                        user_details: user,
                        token: token
                    });
                }
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: "Invalid Password",
                });
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Account not found"
            });
        }
    });
}

/**
 * Register -  User
 *
 * @method register
 * 
 * @param req
 * @param res
 */
export const register = (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ "status": 'UNPROCESSABLE_ENTITY', "errors": errors.array({ onlyFirstError: true }) });
    }
    const { name, email, password, user_name, role, contact } = req.body;
    const user = new User({
        name: name,
        email: email,
        password: password,
        userName: user_name,
        role: role,
        contact: contact
    });

    User.findOne({ email: email }, (err: any, existingUser: any) => {
        if (err) {
            console.log(err)
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "",
                error: err
            });
        }
        if (existingUser) {
            return res.status(StatusCodes.CONFLICT).json({
                success: false,
                message: "Oh!, it's strange. Account is already registered"
            });
        }
        user.save(function (err: any, userInfo: any) {
            if (err) {
                console.log(err)
                return err
            }
            return res.status(StatusCodes.CREATED).json({
                success: true,
                message: "User document created",
                user_details: userInfo
            });
        });
    })
}