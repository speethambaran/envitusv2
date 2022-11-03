import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { Calibration } from '../models/Calibration';
import { Types } from 'mongoose';
import { getPagination } from '@utils';
import { getDeviceId } from '@controllers';
const fs = require('fs');
const path = require('path');

/**
 * Add device calibration certificate
 * @method addCalibCert
 * @param
 */
export const addCalibCert = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ success: false, "errors": errors.array({ onlyFirstError: true }) });
    }
    /** Multer gives us file info in req.file object */
    if (!req.file) {
        return res
            .status(StatusCodes.UNPROCESSABLE_ENTITY)
            .json({ status: "UNPROCESSABLE_ENTITY", errors: "No file passed" });
    }

    const { cert_id, expire_date, device_id } = req.body;
    const device = await getDeviceId(device_id);
    const calibCert = new Calibration({
        certificateId: cert_id,
        expireDate: new Date(expire_date + ' 00:00:00').toISOString(),
        createdBy: Types.ObjectId(req.body.user_id),
        deviceId: Types.ObjectId(device_id),
        device: device,
        fileName: req.file.filename,
        fileLocation: req.file.path
    })
    calibCert.save(function (err: any, calib: any) {
        if (err) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Something went wrong please try later",
            });
        }
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Document created successflly",
            calib_details: calib
        });
    })
}

/**
 * List device calibration certificate
 * @method listCalibCert
 * @param
 */
export const listCalibCert = (req: Request, res: Response) => {
    const { skip, limit, status } = req.query;
    const pageSkip: any = skip || 0;
    const pageLimit: any = limit || 10;
    const match: any = { isDeleted: false };
    status == 'valid' ? match.activated = true : status == 'expired' ? match.activated = false : ''

    Calibration.aggregate([
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
            for (let i = 0; i < data[0].data.length; i++) {

                if (data[0].data[i].activated == true) {
                    let expiry = data[0].data[i].expireDate;
                    let currentDate = new Date();
                    let expiryDate = new Date(expiry);
                    if (currentDate.getTime() > expiryDate.getTime()) {
                        data[0].data[i].activated = false;
                    }
                }
                data[0].data[i].expireDate = new Date(data[0].data[i].expireDate).toISOString().slice(0, 10)
            }
            response.list = data[0].data;
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Successfully retrived data",
            calib_list: response.list,
            pagination: response.pagination
        });
    })
}

/**
 * Delete device calibration certificate
 * @method deleteCalibCert
 * @param
 */

export const deleteCalibCert = (req: Request, res: Response) => {
    Calibration.findByIdAndUpdate(req.params.id, { isDeleted: true }, {}, function (err: any, data: any) {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Error"
            })
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Successfully deleted alarm rule"
        });
    })
}

/**
 * Initiate calibration certificate files
 * @method initiateDownload
 * @param
 */

export const initiateDownload = (req: Request, res: Response) => {
    Calibration.findById(req.params.id, function (err: any, file: any) {
        if (err) { }
        try {
            res.download(file.fileLocation)
        } catch (error) {
            return res.status(StatusCodes.OK).json({
                success: false,
                message: "File not found"
            });
        }
    })
}