import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { SensorData } from '../models/SensorData';
import { Types } from 'mongoose';
import { getPagination } from '@utils';
import { StatusCodes } from 'http-status-codes';
import { SensorSpec } from '@helpers';
import { deviceDetails, getDeviceLastHourAQI } from '@controllers';

/**
 * Get device livedata
 * @method getLiveData
 * @param
 */
export const getLiveData = async (req: Request, res: Response) => {
    const { devs, params, skip, limit, startdate, enddate, deviceIds } = req.query;
    let devices: any = '';
    let devDetails: any = '';
    if (deviceIds) {
        devDetails = await deviceDetails({ "deviceId": deviceIds })
        devices = (devDetails._id).toString()
    } else if (devs) {
        const deviceId: any = devs
        devices = devs
        devDetails = await deviceDetails({ "_id": Types.ObjectId(deviceId) })
    }
    const start: any = startdate;
    const end: any = enddate;
    const pageSkip: any = skip || 0;
    const pageLimit: any = limit || 10;

    let livedata: any = [];
    const devParams: any = devDetails.paramDefinitions || [];

    for (var i = 0; i < devParams.length; i++) {
        if (devParams[i].valueType !== 'date') {
            livedata.push({
                paramName: devParams[i].paramName,
                displayName: devParams[i].displayName,
                displayImage: devParams[i].displayImage,
                unit: devParams[i].unit,
                value: "$data." + devParams[i].paramName,
                precision: devParams[i].valuePrecision,
                unitDisplayHtml: devParams[i].unitDisplayHtml
            });
        }
    }

    const pageQuery = (pageSkip === 'null' && pageLimit === 'null') ? [] : [
        { $skip: parseInt(pageSkip) }, { $limit: parseInt(pageLimit) }
    ]
    devices.split(',').forEach((device: any) => {
        SensorData.aggregate([
            {
                $match: {
                    $and: [
                        {
                            deviceId: Types.ObjectId(device)
                        },
                        {
                            receivedAt: { $gte: new Date(start) }
                        },
                        {
                            receivedAt: { $lt: new Date(end) }
                        }
                    ]
                }
            },
            { '$sort': { 'createdAt': -1 } },
            {
                '$facet': {
                    metadata: [{ $count: "total" }],
                    data: [...pageQuery, ...[{ $addFields: { parameters: livedata } },
                    { $unset: "data" }]
                    ]
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
            const deviceLastData: any = await getDeviceLastHourAQI(devDetails._id);
            if (deviceLastData) {
                response.aqi = Math.round(deviceLastData.aqi)
            }
            return res.status(StatusCodes.OK).json({
                success: true,
                message: "Successfully retrived data",
                livedata: response.list,
                pagination: response.pagination,
                device_details: {
                    description: devDetails.description,
                    aqi: response.aqi || 0,
                    rawAqi: devDetails.rawAqi,
                    deviceId: devDetails.deviceId,
                    type: devDetails.type,
                    devFamily: devDetails.devFamily,
                    customerName: devDetails.customerName,
                    lotNo: devDetails.lotNo,
                    serialNo: devDetails.serialNo,
                    grade: devDetails.grade,
                    deployment: devDetails.deployment,
                    location: devDetails.location
                }
            });
        })
    });

}