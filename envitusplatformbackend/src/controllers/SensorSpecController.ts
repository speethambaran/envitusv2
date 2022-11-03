import { Request, Response } from 'express';
import { StatusCodes } from "http-status-codes";
import { SensorTypes } from "../models/SensorTypes";
import { SensorParameters } from "../models/SensorParameters";
import { getPagination } from '@utils';
import { Types } from 'mongoose';
import { validationResult } from 'express-validator';
import { Devices } from '../models/Devices';
import { SensorSpec } from '@helpers';


/**
 * Add new sensor type
 *
 * @param
 */
export const addSensorType = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ success: false, "errors": errors.array({ onlyFirstError: true }) });
    }
    const { name, description, parameters } = req.body;
    SensorTypes.findOne({ name: name, isDeleted: false }, function (err: any, sensor: any) {
        if (sensor) {
            return res.status(StatusCodes.OK).json({
                success: false,
                message: "Sensor with same name already exists",
            });
        } else {
            const sensorTypeDetails: any = {
                name: name,
                description: description,
                sensorParamsIds: parameters ? parameters.map((x: string | number | undefined) => Types.ObjectId(x)) : []
            }
            const sensorType = new SensorTypes(sensorTypeDetails)
            sensorType.save(async function (err: any, sensorType: any) {
                if (err) { console.log(err) }
                if (sensorType) {
                    return res.status(StatusCodes.CREATED).json({
                        success: true,
                        message: "Document created successflly",
                        sensor_type: sensorType
                    });
                }
            })
        }
    })
}

/**
 * List sensor type
 *
 * @param
 */
export const listSensorType = async (req: Request, res: Response) => {
    const { skip, limit } = req.query;
    const pageSkip: any = skip || 0;
    const pageLimit: any = limit || 10;
    const match: any = { isDeleted: false };
    SensorTypes.aggregate([
        { $match: match },
        {
            $lookup: {
                "from": "sensor_parameters",
                "let": { "ids": "$sensorParamsIds" },
                "pipeline": [
                    { $match: { $expr: { $in: ["$_id", "$$ids"] } } },
                    { $project: { _id: 1, displayName: 1 } }
                ],
                as: "parameters"
            }
        },
        { $sort: { 'createdAt': -1 } },
        {
            $facet: {
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
            message: "Successfully retrieved data",
            sensor_types: response.list,
            pagination: response.pagination
        });
    })
}

/**
 * Update sensor type
 *
 * @param
 */
export const updateSensorType = async (req: Request, res: Response) => {
    const { name, description, parameters } = req.body;
    let updateData: any = {};
    name ? updateData.name = name : '';
    description ? updateData.description = description : '';
    parameters ? updateData.sensorParamsIds = parameters.map((x: string | number | undefined) => Types.ObjectId(x)) : []

    if (name) {
        SensorTypes.find({ name: name, isDeleted: false }, function (err: any, sensor: any) {
            if (err) { }
            if (sensor) {
                return res.status(StatusCodes.OK).json({
                    success: false,
                    message: "Sensor with same name already exists",
                });
            }
        })
    }
    SensorTypes.findByIdAndUpdate(req.params.id, updateData, { new: true }, function (err: any, sensorType: any) {
        if (err) { }
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Successfully updated sensor type details",
            sensor_type: sensorType
        });
    })

}

/**
 * Delete sensor type
 *
 * @param
 */
export const deleteSensorType = async (req: Request, res: Response) => {
    Devices.countDocuments({ subType: Types.ObjectId(req.params.id), isDeleted: false }, function (err: any, count: number) {
        if (count > 0) {
            return res.status(StatusCodes.OK).json({
                success: false,
                message: "Sensor type in use! please remove from device"
            });
        } else {
            SensorTypes.findByIdAndUpdate(req.params.id, { isDeleted: true }, {}, function (err: any, sensorType: any) {
                if (err) { }
                return res.status(StatusCodes.OK).json({
                    success: true,
                    message: "Successfully deleted sensor type"
                });
            })
        }
    });

}

/**
 * Get sensor type details
 *
 * @param
 */
export const getSensorTypeDetails = async (req: Request, res: Response) => {
    const pipeline: any = [
        {
            $match: { _id: Types.ObjectId(req.params.id) }
        },
        {
            $lookup: {
                "from": "sensor_parameters",
                "let": { "sensorParamsIds": "$sensorParamsIds" },
                "pipeline": [
                    { $match: { $expr: { $in: ["$_id", "$$sensorParamsIds"] } } }
                ],
                as: "specs"
            }
        },
    ]
    SensorTypes.aggregate(pipeline, function (err: any, sensorType: any) {
        if (err) {
            console.log(err)
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Sensor type details",
            sensor_type: sensorType[0]
        });
    })
}


/**
 * Add new sensor parameter
 *
 * @param
 */
export const addSensorSpec = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ success: false, "errors": errors.array({ onlyFirstError: true }) });
    }
    const { param_name, display_name, display_name_html,
        unit, unit_html, display_enabled, display_image,
        is_primary, value_precision, filterable, range_min, range_max, limits } = req.body;
    const sensorParamDetails: any = {
        paramName: param_name,
        displayName: display_name,
        displayNameHtml: display_name_html,
        unit: unit,
        unitDisplayHtml: unit_html,
        isDisplayEnabled: display_enabled,
        displayImage: display_image,
        isPrimary: is_primary,
        valuePrecision: value_precision,
        isFilterable: filterable,
        maxRanges: {
            min: range_min,
            max: range_max
        },
        limits: limits,
    }

    const sensorParam = new SensorParameters(sensorParamDetails)
    sensorParam.save(async function (err: any, result: any) {
        if (err) { return }
        if (result) {
            return res.status(StatusCodes.CREATED).json({
                success: true,
                message: "Document created successflly",
                sensor_type: result
            });
        }
    })
}

/**
 * List sensor type
 *
 * @param
 */
export const listSensorSpec = async (req: Request, res: Response) => {
    const { skip, limit } = req.query;
    const pageSkip: any = skip || 0;
    const pageLimit: any = limit || 10;
    const match: any = { isDeleted: false };
    SensorParameters.aggregate([
        { $match: match },
        { $sort: { 'createdAt': -1 } },
        {
            $facet: {
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
            message: "Successfully retrieved data",
            sensor_parameters: response.list,
            pagination: response.pagination
        });
    })
}

/**
 * Update sensor type
 *
 * @param
 */
export const updateSensorSpec = async (req: Request, res: Response) => {
    const { param_name, display_name, display_name_html,
        unit, unit_html, display_enabled, display_image,
        is_primary, value_precision, filterable, range_min, range_max, limits } = req.body;
    let updateData: any = {};
    param_name ? updateData.paramName = param_name : '';
    display_name ? updateData.displayName = display_name : '';
    display_name_html ? updateData.displayNameHtml = display_name : '';
    unit ? updateData.unit = unit : '';
    unit_html ? updateData.unitDisplayHtml = unit_html : '';
    value_precision ? updateData.valuePrecision = value_precision : '';

    if (display_enabled != undefined) {
        updateData.isDisplayEnabled = display_enabled
    }

    if (filterable != undefined) {
        updateData.isFilterable = filterable
    }

    range_min ? updateData['maxRanges.min'] = range_min : '';
    range_max ? updateData['maxRanges.max'] = range_max : '';

    SensorParameters.findByIdAndUpdate(req.params.id, updateData, { new: true }, function (err: any, sensorType: any) {
        if (err) { }
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Successfully updated sensor parameter details",
            sensor_type: sensorType
        });
    })
}

/**
 * Delete sensor type
 *
 * @param
 */
export const deleteSensorSpec = async (req: Request, res: Response) => {
    SensorTypes.countDocuments({
        sensorParamsIds: { $in: [Types.ObjectId(req.params.id)] },
        isDeleted: false
    }, function (err: any, count: number) {
        if (count > 0) {
            return res.status(StatusCodes.OK).json({
                success: false,
                message: "Sensor Spec in use! please remove from sensor type"
            });
        } else {
            SensorParameters.findByIdAndUpdate(req.params.id, { isDeleted: true }, {}, function (err: any, sensorType: any) {
                if (err) { }
                return res.status(StatusCodes.OK).json({
                    success: true,
                    message: "Successfully deleted sensor spec"
                });
            })
        }
    });
}

/**
 * Get sensor type details
 *
 * @param
 */
export const getSensorSpecDetails = async (req: Request, res: Response) => {
}


/**
 * Get sensor spec ids
 *
 * @param
 */
export const listSensorSpecIds = async (req: Request, res: Response) => {
    SensorParameters.find({ isDeleted: false }, { _id: 1, displayName: 1 }, {}, function (err: any, ids: any) {
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Data successfully retrieved",
            spec_ids: ids || []
        });
    })
}

/**
 * Get sensor type ids
 *
 * @param
 */
export const listSensorTypeIds = async (req: Request, res: Response) => {
    SensorTypes.find({ isDeleted: false }, { _id: 1, name: 1 }, {}, function (err: any, ids: any) {
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Data successfully retrieved",
            sensor_type_ids: ids || []
        });
    })
}

/**
 * sensor type details
 *
 * @param
 */
export const sensorTypeDetails = async (id: string) => {
    const pipeline: any = [
        {
            $match: { _id: Types.ObjectId(id) }
        },
        {
            $lookup: {
                "from": "sensor_parameters",
                "let": { "sensorParamsIds": "$sensorParamsIds" },
                "pipeline": [
                    { $match: { $expr: { $in: ["$_id", "$$sensorParamsIds"] } } }
                ],
                as: "specs"
            }
        },
    ]
    return new Promise((resolve, reject) => {
        SensorTypes.aggregate(pipeline, function (err: any, sensorType: any) {
            resolve(sensorType[0])
        })
    })
}

/**
 * Get sensor parameters
 *
 * @param
 */
export const getSensorParameters = async (req: Request, res: Response) => {
    SensorParameters.find({ isDeleted: false }, { _id: 1, displayName: 1, paramName: 1 }, {}, function (err: any, parameters: any) {
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Data successfully retrieved",
            parameters: parameters || []
        });
    })
}