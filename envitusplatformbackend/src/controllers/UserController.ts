import { Request, Response } from 'express';
import { StatusCodes } from "http-status-codes";
import { User } from "../models/Users";
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import { getPagination } from '@utils';

/**
 * List -  User
 *
 * @method  userstList
 * 
 * @param   req
 * @param   res
 */

export const usersList = (req: Request, res: Response) => {
    const { skip, limit, role, status } = req.query;
    const pageSkip: any = skip || 0;
    const pageLimit: any = limit || 10;
    const match: any = { isDeleted: false, visible: true };
    status == 'active' ? match.activated = true : status == 'inactive' ? match.activated = false : '';
    if (role) {
        match.role = role;
    } else if (req.body.user_role !== 'Super Admin') {
        match.role = { $ne: 'Super Admin' }
    }

    User.aggregate([
        { $match: match },
        { '$sort': { 'createdAt': -1 } },
        {
            '$facet': {
                metadata: [{ $count: "total" }],
                data: [{ $skip: parseInt(pageSkip) }, { $limit: parseInt(pageLimit) }]
            }
        }
    ], async function (err: any, data: any) {
        const response: any = {
            pagination: await getPagination(0, parseInt(pageSkip), parseInt(pageLimit)),
            list: []
        }
        if (data[0]) {
            if (data[0].metadata[0]) {
                response.pagination = await getPagination(data[0].metadata[0].total, parseInt(pageSkip), parseInt(pageLimit))
            }
            response.list = data[0].data
        }
        return res.status(StatusCodes.OK).json({
            ssuccess: true,
            message: "Successfully retrived data",
            users_list: response.list,
            pagination: response.pagination
        });
    })
}


/**
 * Add -  User
 *
 * @method  addUser
 * 
 * @param   req
 * @param   res
 */
export const addUser = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ success: false, "errors": errors.array({ onlyFirstError: true }) });
    }
    const { name, password, role, username, email } = req.body;
    const user = new User({
        name: name,
        role: role,
        userName: username,
        password: password,
        email: email
    })
    user.save(function (err: any, data: any) {
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "User account successfully created",
            user_details: data
        });
    })
}

/**
 * Edit -  User by id
 *
 * @method  editUser
 * 
 * @param   req
 * @param   res
 */
export const editUser = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ success: false, "errors": errors.array({ onlyFirstError: true }) });
    }
    const { name, password, role, status } = req.body;
    const update: any = {
        name: name
    }
    if (password != undefined) {
        update.password = await passwordHash(password)
    }
    role ? update.role = role : ''
    if (status || !status) {
        update.activated = status
    }
    User.findByIdAndUpdate(req.params.id, update, { new: true }, function (err: any, data: any) {
        if (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Something went wrong! Please try later",
            });
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Successfully updated",
            user_details: data
        });
    })
}


/**
 * Update -  User details, auth user
 *
 * @method  updateUserDetails
 * 
 * @param   req
 * @param   res
 */
export const updateUserDetails = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ success: false, "errors": errors.array({ onlyFirstError: true }) });
    }

    const { name } = req.body;
    const update: any = {
        name: name,
    }
    User.findByIdAndUpdate(req.body.user_id, update, { new: true }, function (err: any, data: any) {
        if (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Something went wrong! Please try later",
            });
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Successfully updated",
            user_details: data
        });
    })
}

/**
* Get -  User details
*
* @method  getUserDetails
* 
* @param   req
* @param   res
*/
export const getUserDetails = async (req: Request, res: Response) => {
    User.findById(req.body.user_id, function (err: any, data: any) {
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Data successfully retrived",
            user_details: data
        });
    })
}

/**
* Get -  Password hash value
*
* @method  passwordHash
* 
* @param   req
* @param   res
*/
const passwordHash = (password: any) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err: any, hash: string) => {
                resolve(hash)
            });
        });
    })
}

/**
* Update user password
*
* @method  updateUserPassword
* 
* @param   req
* @param   res
*/
export const updateUserPassword = (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ success: false, "errors": errors.array({ onlyFirstError: true }) });
    }
    const { current_password, confirm_password, password } = req.body;
    if (confirm_password != password) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: "Your password and confirmation password do not match",
        });
    }
    User.findById(req.body.user_id, (err: any, user: any) => {
        if (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Something went wrong! Please try later",
            });
        }
        if (user) {
            bcrypt.compare(current_password, user.password, async function (err, userAuth) {
                if (userAuth) {
                    if (current_password == password) {
                        return res.status(StatusCodes.BAD_REQUEST).json({
                            success: false,
                            message: "Password already in use",
                        });
                    } else {
                        const hash = await passwordHash(password)
                        const update: any = {
                            password: hash
                        }
                        User.findByIdAndUpdate(req.body.user_id, update, { new: true }, function (err: any, data: any) {
                            if (err) {
                                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                                    success: false,
                                    message: "Something went wrong! Please try later",
                                });
                            }
                            return res.status(StatusCodes.OK).json({
                                success: true,
                                message: "Successfully updated",
                                user_details: data
                            });
                        })
                    }
                } else {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        success: false,
                        message: "Invalid Password",
                    });
                }
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
* Fetch user details by id
*
* @method  getUserDetailsById
* 
* @param   req
* @param   res
*/
export const getUserDetailsById = (req: Request, res: Response) => {
    User.findById(req.params.id, function (err: any, data: any) {
        if (err) { }
        if (data) {
            return res.status(StatusCodes.OK).json({
                success: true,
                message: "Data successfully retrived",
                user_details: data
            });
        } else {
            return res.status(StatusCodes.OK).json({
                success: false,
                message: "User account not found"
            });
        }
    })
}

/**
* Fetch active user ids
*
* @method  getUserIds
* 
* @param   req
* @param   res
*/
export const getUserIds = (req: Request, res: Response) => {
    User.find({ activated: true, isDeleted: false, visible: true }, { _id: 1, name: 1 }, {}, function (err: any, ids: any) {
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Data successfully retrieved",
            user_ids: ids
        });
    })
}

/**
* Get -  User details
*
* @method  userDetails
* 
*/
export const userDetails = (user_id: string) => {
    return new Promise((resolve, reject) => {
        User.findById(user_id, function (err: any, data: any) {
            resolve(data);
        })
    })
}

/**
* Delete user
*
* @method  deleteUser
* 
* @param   req
* @param   res
*/
export const deleteUser = (req: Request, res: Response) => {
    User.findByIdAndUpdate(req.params.id, { activated: false, isDeleted: true }, {}, function (err: any, ids: any) {
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "User account successfully deleted"
        });
    })
}

/**
* Seed user data
*
* @method  seedUsers
* 
* @param   req
* @param   res
*/
export const seedUsers = () => {
    const rootUser = {
        name: "Root ES",
        email: "root@envitus.com",
        password: process.env.ROOT_USER_PASSWORD,
        role: 'Super Admin',
        userName: 'root',
        isActive: true
    }
    User.findOne({ email: rootUser.email }, function (err: any, data: any) {
        if (!data) {
            const userModel = new User(rootUser);
            userModel.save(function (err: any, data: any) { })
        }
    })
}