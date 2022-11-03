import { getPagination } from '@utils';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import { Devices } from "../models/Devices";
import { userDetails, sensorTypeDetails } from '@controllers';
import { Preferences } from '../models/Preferences';

/**
 * Add new device
 *
 * @param
 */
export const addDevice = (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ success: false, "errors": errors.array({ onlyFirstError: true }) });
    }
    const payload = { ...req.body };
    if (!payload.device_organization) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: "NO ORGANIZATION"
        });
    }
    Devices.findOne({ deviceId: payload.device_id }, async function (err: any, data: any) {
        if (data) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Device already added"
            });
        } else {
            const deviceAdded: any = await deviceCount();
            let deviceLimit: any = await deviceLimitPreference();
            if (deviceAdded >= deviceLimit) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: "DEVICE LIMIT REACHED"
                });
            }
            const sensorSpec: any = await sensorTypeDetails(payload.device_sub_type);
            const paramDefinitions = [];
            for (let index = 0; index < sensorSpec.specs.length; index++) {
                const param = sensorSpec.specs[index];
                const definitions = payload.paramDefinitions.find((e: any) => { return e.paramName === param.paramName });
                param.maxRanges = definitions.maxRanges
                if (definitions.hasOwnProperty('filterType')) {
                    param.filteringMethod = definitions['filterType'];
                    param.filteringMethodDef = {
                        "weightT0": definitions['filter']['weightT0'],
                        "weightT1": definitions['filter']['weightT1']
                    }
                }
                if (definitions.hasOwnProperty('calibrationType')) {
                    param.calibration = {
                        type: definitions['calibrationType'],
                        "data": [
                            {
                                "offset": parseFloat(definitions['calibration']['offset']),
                                "min": parseFloat(definitions['calibration']['min']),
                                "max": parseFloat(definitions['calibration']['max'])
                            }
                        ]
                    }
                }
                paramDefinitions.push(param)
            }

            const device = new Devices({
                paramDefinitions: paramDefinitions,
                deviceId: payload.device_id,
                type: payload.device_type,
                devFamily: payload.device_family,
                subType: Types.ObjectId(payload.device_sub_type),
                customerName: payload.customer_name,
                lotNo: payload.lot_no,
                serialNo: payload.serial_no,
                grade: payload.device_grade,
                deployment: payload.device_deployment,
                activated: payload.device_status === 'enabled' ? true : false,
                location: {
                    locId: payload.location_id,
                    city: payload.city,
                    zone: payload.zone,
                    landMark: payload.land_mark,
                    latitude: payload.latitude,
                    longitude: payload.longitude,
                    building: payload.building,
                    floor: payload.floor
                },
                timeZone: payload.device_timezone,
                organizationId: Types.ObjectId(payload.device_organization),
            })

            device.save(function (err: any, data: any) {
                if (err) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        status: "BAD REQUEST",
                        message: "",
                        error: err
                    });
                }
                else {
                    return res.status(StatusCodes.OK).json({
                        success: true,
                        message: "Device successfully added",
                        device_details: data
                    });
                }
            })
        }
    })
}


/**
 * List device
 *
 * @param
 */
export const listDevice = async (req: Request, res: Response) => {
    let sort: any = { _id: -1 }
    const queryParams: any = req.query;
    const match: any = { $and: [] }

    switch (queryParams.status) {
        case 'enabled':
            match['$and'].push({ isDeleted: false })
            match['$and'].push({ activated: true })
            break;
        case 'disabled':
            match['$and'].push({ isDeleted: false })
            match['$and'].push({ activated: false })
            break;
        case 'deleted':
            match['$and'].push({ isDeleted: true })
            break;
        case 'online':
            var now = new Date();
            now.setMinutes(now.getMinutes() - 10); // timestamp
            match['$and'].push({ isDeleted: false })
            match['$and'].push({ activated: true })
            match['$and'].push({ lastDataReceiveTime: { $gte: new Date(now) } })
            break;
        default:
            match['$and'].push({ isDeleted: false })
            break;
    }
    if (queryParams.organization_id && queryParams.organization_id != 'all') {
        match['$and'].push({ organizationId: Types.ObjectId(queryParams.organization_id) })
    } else {
        const user: any = await userDetails(req.body.user_id);
        match['$and'].push({ organizationId: { $in: user.organization } })
    }

    if (queryParams.family && queryParams.family != 'all') {
        match['$and'].push({ devFamily: queryParams.family })
    }

    if (queryParams.search && queryParams.search != '') {
        match['$and'].push({
            $or: [
                { 'deviceId': { '$regex': queryParams.search, '$options': 'i' } },
                { 'location.city': { '$regex': queryParams.search, '$options': 'i' } },
                { 'location.landMark': { '$regex': queryParams.search, '$options': 'i' } }
            ],
        })
    }
    const dataSkip = parseInt(queryParams.skip) || 0;
    const dataLimit = parseInt(queryParams.limit) || 25;
    let pipeline = [
        { $match: match },
        {
            '$facet': {
                metadata: [{ $count: "total" }],
                data: [{ $sort: sort }, { $skip: dataSkip }, { $limit: dataLimit }]
            }
        }
    ]

    Devices.aggregate(pipeline, async function (err: any, data: any) {
        const response: any = {
            success: true,
            message: "Data successfull retrieved",
            device_list: [],
            pagination: await getPagination(0, dataSkip, dataLimit)
        };
        if (data[0]) {
            if (data[0].metadata[0]) {
                response.pagination = await getPagination(data[0].metadata[0].total, dataSkip, dataLimit)
            }
            // console.log("DEVICES", data[0].data)
            response.device_list = data[0].data
        }

        if (!err) {
            return res.status(200).json(response);
        }
        if (err) {
            console.log(err);
        }
    })
}

/**
 * Update device
 *
 * @param
 */
export const updateDevice = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ success: false, "errors": errors.array({ onlyFirstError: true }) });
    }
    const payload = { ...req.body };
    const update: any = {
        location: {}
    }

    const sensorSpec: any = await sensorTypeDetails(payload.device_sub_type);
    const paramDefinitions = [];
    for (let index = 0; index < sensorSpec.specs.length; index++) {
        const param = sensorSpec.specs[index];
        const definitions = payload.paramDefinitions.find((e: any) => { return e.paramName === param.paramName });
        if (definitions) {
            param.maxRanges = definitions.maxRanges
            if (definitions.hasOwnProperty('filterType') && definitions['filterType'] != 'none') {
                param.filteringMethod = definitions['filterType'];
                param.filteringMethodDef = {
                    "weightT0": definitions['filteringMethodDef']['weightT0'],
                    "weightT1": definitions['filteringMethodDef']['weightT1']
                }
            }
            if (definitions.hasOwnProperty('calibrationType') && definitions['calibrationType'] != 'none') {
                param.calibration = {
                    type: definitions['calibrationType'],
                    "data": [
                        {
                            "offset": parseFloat(definitions['calibration']['offset']),
                            "min": parseFloat(definitions['calibration']['min']),
                            "max": parseFloat(definitions['calibration']['max'])
                        }
                    ]
                }
            }
        }
        paramDefinitions.push(param)

    }
    update.paramDefinitions = paramDefinitions
    payload.customer_name ? update.customerName = payload.customer_name : ''
    payload.lot_no ? update.customerName = payload.lot_no : ''
    payload.serial_no ? update.customerName = payload.serial_no : ''
    payload.device_grade ? update.customerName = payload.device_grade : ''
    payload.location_id ? update.location.locId = payload.location_id : ''
    payload.city ? update.location.city = payload.city : ''
    payload.zone ? update.location.zone = payload.zone : ''
    payload.land_mark ? update.location.landMark = payload.land_mark : ''
    payload.latitude ? update.location.latitude = payload.latitude : ''
    payload.longitude ? update.location.longitude = payload.longitude : ''
    payload.building ? update.location.building = payload.building : ''
    payload.floor ? update.location.floor = payload.floor : ''
    if (payload.device_status) {
        payload.device_status === 'enabled' ? update.activated = true : update.activated = false
    }
    payload.device_type ? update.type = payload.device_type : ''
    payload.device_family ? update.devFamily = payload.device_family : ''
    payload.device_sub_type ? update.subType = Types.ObjectId(payload.device_sub_type) : ''
    payload.device_timezone ? update.subType = payload.device_timezone : ''
    payload.device_organization ? update.organizationId = Types.ObjectId(payload.device_organization) : ''

    Devices.findByIdAndUpdate(req.params.id, update, { new: true }, function (err: any, data: any) {
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Device successfully updated",
            device_details: data
        });
    })
}


/**
 * Get device details by id
 *
 * @param
 */
export const getDeviceDetails = (req: Request, res: Response) => {
    const pipeline: any = [
        {
            $match: {
                _id: Types.ObjectId(req.params.id)
            }
        },
        {
            $lookup: {
                from: 'organizations',
                localField: 'organizationId',
                foreignField: '_id',
                as: 'organization'
            }
        },
        {
            $lookup: {
                from: 'sensor_types',
                localField: 'subType',
                foreignField: '_id',
                as: 'subTypeDetails'
            }
        },
        {
            $unwind: {
                path: "$organization",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unwind: {
                path: "$subTypeDetails",
                preserveNullAndEmptyArrays: true
            }
        }
    ]
    Devices.aggregate(pipeline, function (err: any, data: any) {
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Data successfully retrieved",
            device_details: data[0] || {}
        });
    })
}


/**
 * Delete device
 *
 * @param
 */
export const deleteDevice = (req: Request, res: Response) => {
    if (req.body.delete) {
        Devices.findByIdAndDelete(req.params.id, {}, function (err: any, data: any) {
            return res.status(StatusCodes.OK).json({
                success: true,
                message: "Device successfully deleted"
            });
        })
    } else {
        Devices.findByIdAndUpdate(req.params.id, { isDeleted: true, activated: false }, { new: true }, function (err: any, data: any) {
            return res.status(StatusCodes.OK).json({
                success: true,
                message: "Device successfully deleted"
            });
        })
    }
}

/**
 * Delete device
 *
 * @param
 */
export const deleteDevicePermanently = (req: Request, res: Response) => {
    Devices.findByIdAndDelete(req.params.id, {}, function (err: any, data: any) {
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Device successfully deleted"
        });
    })

}


/**
 * Get device statistics
 * @method getDeviceStatistics
 * @param
 */
export const getDeviceStatistics = async (req: Request, res: Response) => {
    var now = new Date();
    now.setMinutes(now.getMinutes() - 10); // timestamp
    const dateTime = new Date(now);
    const user: any = await userDetails(req.body.user_id);
    const pipeline: any = [
        { $match: { isDeleted: false, organizationId: { $in: user.organization } } },
        {
            $group: {
                _id: "$isDeleted",
                devices_total: { $sum: 1 },
                devices_enabled: {
                    "$sum": {
                        "$cond": [{ "$eq": ["$activated", true] }, 1, 0]
                    }
                },
                devices_disabled: {
                    "$sum": {
                        "$cond": [{ "$eq": ["$activated", false] }, 1, 0]
                    }
                },
                devices_online: {
                    "$sum": {
                        "$cond": [{ $and: [{ "$gte": ["$lastDataReceiveTime", dateTime] }, { "$eq": ["$activated", true] }] }, 1, 0]
                    }
                }
            }
        },
        {
            $project: {
                devices_total: 1,
                devices_enabled: 1,
                devices_disabled: 1,
                devices_online: 1
            }
        },
    ]
    Devices.aggregate(pipeline, function (err: any, data: any) {
        let statistics: any = {
            devices_total: 0,
            devices_enabled: 0,
            devices_disabled: 0,
            devices_online: 0
        }
        if (data && data[0]) {
            statistics = {
                ...data[0]
            }
            delete (statistics._id)
        }
        return res.status(StatusCodes.OK).json({
            ssuccess: true,
            message: "Successfully retrieved data",
            device_statistics: statistics
        });
    })
}


/**
* Fetch active device ids
*
* @method  getDeviceIds
* 
* @param   req
* @param   res
*/
export const getDeviceIds = (req: Request, res: Response) => {
    let filter: any = { activated: true, isDeleted: false };
    const query: any = { ...req.query };
    if (query.type) {
        switch (query.type) {
            case 'organization':
                filter['$or'] = []
                const pushItem: any = {
                    organizationId: {}
                }
                pushItem['organizationId']['$' + query.operation] = Types.ObjectId(query.value)
                filter['$or'].push(pushItem)
                filter['$or'].push({ 'organizationId': { '$eq': null } })
                break;
            case 'organization-add':
                filter['organizationId'] = { '$eq': null };
                break;
            default:
                break;
        }
    }
    Devices.find(filter, { _id: 1, deviceId: 1 }, {}, function (err: any, ids: any) {
        console.log(err)
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Data successfully retrieved",
            device_ids: ids
        });
    })
}

// Fetch Device details
export const deviceDetails = (query: object) => {
    return new Promise((resolve, reject) => {
        Devices.findOne(query)
            .then((device) => {
                resolve(device);
            })
            .catch(() => {
                reject(null);
            });
    });
}

/**
 * Restore device
 *
 * @param
 */
export const restoreDevice = (req: Request, res: Response) => {
    Devices.findByIdAndUpdate(req.params.id, { isDeleted: false, activated: true }, { new: true }, function (err: any, data: any) {
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Device successfully restored",
            device_details: data
        });
    })
}

/**
 * Find device count
 *
 * @param
 */
const deviceCount = () => {
    return new Promise((resolve, reject) => {
        Devices.countDocuments({ isDeleted: false, activated: true }, function (err: any, deviceCount: number) {
            resolve(deviceCount)
        })
    })
}

/**
 * Get device limit preference
 *
 * @param
 */
const deviceLimitPreference = () => {
    return new Promise((resolve, reject) => {
        Preferences.findOne({ type: 'device:limit' }, function (err: any, data: any) {
            resolve(data.data.limit)
        })
    })
}