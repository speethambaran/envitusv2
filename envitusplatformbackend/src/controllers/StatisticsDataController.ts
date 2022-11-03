import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { SensorData } from '../models/SensorData';
import { Types } from 'mongoose';
import { getPagination } from '@utils';
import { StatusCodes } from 'http-status-codes';
import { SensorSpec } from '@helpers';
import { deviceDetails } from '@controllers';

/**
 * Get device statistics
 * @method getStatistics
 * @param
 */
export const getStatistics = async(req: Request, res: Response) => {
    const { devs, params, skip, limit, statType, timeZone, startdate, enddate, deviceId } = req.query;
    let device: any = '';
    let devDetails: any = '';
    deviceId? devDetails = await deviceDetails({ "deviceId": deviceId }): devDetails = await deviceDetails({ "_id": devs })
    devs? device = devs: device = devDetails._id;
    const parameters: any = params;
    const start: any = startdate; const end: any = enddate;
    const pageSkip: any = skip || 0;
    const pageLimit: any = limit || 10;
    const basis: any = statType || 'daily';
    const tZone: any = timeZone;

    let group: any = {
        _id: { timelyStat: "$timeLocal." + basis },
        sample_count: { $sum: 1 }
    }

    let statistics = [];
    const devParams: any = devDetails.paramDefinitions || [];

    for (var i = 0; i < devParams.length; i++) {
        if (devParams[i].valueType !== 'string' && devParams[i].valueType !== 'date') {
            group[devParams[i].paramName + '_min'] = { $min: "$data." + devParams[i].paramName }
            group[devParams[i].paramName + '_max'] = { $max: "$data." + devParams[i].paramName }
            group[devParams[i].paramName + '_avg'] = { $avg: "$data." + devParams[i].paramName }
            statistics.push({
                paramName: devParams[i].paramName,
                displayName: devParams[i].displayName,
                displayImage: devParams[i].displayImage,
                unitDisplayHtml: devParams[i].unitDisplayHtml,
                unit: devParams[i].unit,
                avg: "$" + devParams[i].paramName + '_avg',
                max: "$" + devParams[i].paramName + '_max',
                min: "$" + devParams[i].paramName + '_min',
                precision: devParams[i].valuePrecision
            });
        }
    }

    const pageQuery = (pageSkip === 'null' && pageLimit ==='null') ? [] : [
        { $skip: parseInt(pageSkip) }, { $limit: parseInt(pageLimit) }
    ]

    const query = [
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
        {
            $addFields: {
                timeLocal: {
                    yearly: { $dateToString: { format: "%Y", date: '$receivedAt', timezone: tZone } },
                    monthly: { $dateToString: { format: "%Y-%m", date: '$receivedAt', timezone: tZone } },
                    daily: { $dateToString: { format: "%Y-%m-%d", date: '$receivedAt', timezone: tZone } },
                    hourly: { $dateToString: { format: "%Y-%m-%d-%H", date: '$receivedAt', timezone: tZone } }
                }
            }
        },
        {
            $group: group
        },
        { "$sort": { "_id": -1 } },
        {
            '$facet': {
                metadata: [{ $count: "total" }],
                data: [...pageQuery, ...[{
                    $project: {
                        "parameters": statistics,
                        "sample_count": 1
                    }
                }]]
            }
        }
    ];

    SensorData.aggregate(query, async function (err: any, data: any) {
        const response: any = {
            pagination: await getPagination(0, parseInt(pageSkip), parseInt(pageLimit)),
            list: []
        }
        if (data[0]) {
            if (data[0].metadata[0]) {
                response.pagination = await getPagination(data[0].metadata[0].total, parseInt(pageSkip), parseInt(pageLimit))
            }
            response.list = data[0].data;
            // console.log("RES", data[0]);
        }
        if(!err){
            return res.status(StatusCodes.OK).json({
                success: true,
                message: "Successfully retrived data",
                statistics: response.list,
                pagination: response.pagination
            });
        }
        if(err){
            console.log(err)
        }
        
    })    
}