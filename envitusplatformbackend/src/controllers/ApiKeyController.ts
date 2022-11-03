import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { ApiKey } from '../models/ApiKey';
import { v4 as uuidv4 } from 'uuid';
import { Types } from 'mongoose';
import { getPagination } from '@utils';
import schedule from 'node-schedule';

/**
 * Api key -  Add
 *
 * @param
 */
export const addApiKey = (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ success: false, "errors": errors.array({ onlyFirstError: true }) });
    }
    const { name, limit } = req.body;
    const apiKey = new ApiKey({
        name: name,
        limit: limit,
        currentLimit: 0,
        apiKey: uuidv4(),
        createdBy: Types.ObjectId(req.body.user_id)
    })
    apiKey.save(function (err: any, api: any) {
        if (err) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Document with same name already exists",
            });
        }
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Document created successflly",
            api_details: api
        });
    })
}

/**
 * Api key -  Update
 *
 * @param
 */
export const updateApiKey = (req: Request, res: Response) => {
    const { name, limit, status } = req.body;
    let updateData: any = {};
    name ? updateData.name = name : '';
    limit ? updateData.limit = limit : '';
    status != undefined ? updateData.activated = status : '';
    ApiKey.findByIdAndUpdate(req.params.id, updateData, { new: true }, function (err: any, api: any) {
        if (err) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Document with same name already exists",
            });
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Successfully updated api details",
            api_details: api
        });
    })
}

/**
 * Api key -  List
 *
 * @param
 */
export const listApiKey = (req: Request, res: Response) => {
    const { skip, limit, status } = req.query;
    const pageSkip: any = skip || 0;
    const pageLimit: any = limit || 10;
    const match: any = { isDeleted: false };
    status == 'enabled' ? match.activated = true : status == 'disabled' ? match.activated = false : ''

    ApiKey.aggregate([
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
            pagination: {},
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
            api_list: response.list,
            pagination: response.pagination
        });
    })
}

/**
 * Api key -  Details
 *
 * @param
 */
export const getApiKeyDetails = (req: Request, res: Response) => {
    ApiKey.findById(req.params.id, function (err: any, api: any) {
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Api key details",
            api_details: api
        });
    })
}

/**
 * Api key -  delete
 *
 * @param
 */
export const deleteApiKey = (req: Request, res: Response) => {
    ApiKey.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true }, function (err: any, api: any) {
        if (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Error"
            })
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Successfully deleted api key"
        });
    })
}
