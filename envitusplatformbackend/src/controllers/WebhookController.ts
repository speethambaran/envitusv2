import { Request, Response } from 'express';
import { StatusCodes } from "http-status-codes";
import { getPagination } from '@utils';
import { validationResult } from 'express-validator';
import { Webhook } from '../models/Webhooks';
import { Types } from 'mongoose';
import axios from 'axios';

export const addWebhook = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
            "status": 'UNPROCESSABLE_ENTITY', "errors": errors.array({ onlyFirstError: true })
        });
    }
    const { url, sensor_data, alerts, key } = req.body;

    const pattern = /(https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    if (pattern.test(url) == false) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
            success: false,
            message: "Please provide https url",
        });
    }

    const webhook = new Webhook({
        url: url,
        sensorData: sensor_data,
        alerts: alerts,
        secretKey: key,
        createdBy: Types.ObjectId(req.body.user_id)
    })
    webhook.save(async function (err: any, data: any) {
        if (err) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Document with same name already exists",
            });
        }
        const isReachableUrl = await postJsonToUrl([url], { "message": "test" }, [key]);
        if (isReachableUrl == 201) {
            return res.status(StatusCodes.CREATED).json({
                success: true,
                message: "Document created successflly, URL is reachable",
                webhook_details: data
            });
        }
        else {
            return res.status(StatusCodes.CREATED).json({
                success: true,
                message: "Document created successflly, URL is not reachable",
                webhook_details: data
            });
        }

    })
}

export const deleteWebhook = (req: Request, res: Response) => {
    Webhook.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true }, function (err: any, data: any) {
        if (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Error"
            })
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Successfully deleted webhook"
        });
    })
}

export const listWebhook = (req: Request, res: Response) => {
    const { skip, limit, status } = req.query;
    const pageSkip: any = skip || 0;
    const pageLimit: any = limit || 10;
    const match: any = { isDeleted: false };
    status == 'enabled' ? match.activated = true : status == 'disabled' ? match.activated = false : ''
    Webhook.aggregate([
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
                if (data[0].data[i].sensorData == true)
                    data[0].data[i].sensorData = "Yes";
                else
                    data[0].data[i].sensorData = "No"
                if (data[0].data[i].alerts == true)
                    data[0].data[i].alerts = "Yes";
                else
                    data[0].data[i].alerts = "No";
            }
            response.list = data[0].data
        }
        return res.status(StatusCodes.OK).json({
            ssuccess: true,
            message: "Successfully retrived data",
            webhook_list: response.list,
            pagination: response.pagination
        });
    })
}

export const postSensorDatatoUrls = async (postData: any) => {
    let sensorArray: any = [];
    let token: any = [];
    Webhook.find({ sensorData: true, isDeleted: false }, function (err: any, data: any) {
        if (err)
            console.log(err)
        else {
            for (let i = 0; i < data.length; i++) {
                sensorArray.push(data[i].url);
                token.push(data[i].secretKey)
            }
            if (sensorArray.length > 0) {
                postJsonToUrl(sensorArray, postData, token);
            }
        }
    })
}

export const postAlertsToUrls = async (postData: any) => {
    let alertsArray: any = [];
    let token: any = [];
    Webhook.find({ alerts: true, isDeleted: false }, function (err: any, data: any) {
        if (err)
            console.log(err)
        else {
            for (let i = 0; i < data.length; i++) {
                alertsArray.push(data[i].url)
                token.push(data[i].secretKey)
            }
            if (alertsArray.length > 0) {
                postJsonToUrl(alertsArray, postData, token);
            }
        }
    })
}

export const postJsonToUrl = (urls: any, data: any, key: any) => {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            axios.post(url, data, {
                headers: {
                    'Authorization': `Basic ${key[i]}`
                }
            })
                .then((res) => {
                    console.log(`Status: ${res.status}`);
                    resolve(res.status)
                }).catch((err) => {
                    // console.error(err);
                    resolve(500)
                });
        }
    })

    // return status;
}

export const getWebhookDetails = (req: Request, res: Response) => {
    Webhook.findById(req.params.id, function (err: any, data: any) {
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Webhook details",
            hook_details: data
        });
    })
}

export const updateWebhook = (req: Request, res: Response) => {
    const { url, key, sensor_data, alerts } = req.body;
    let updateData: any = {};
    url ? updateData.url = url : '';
    key ? updateData.secretKey = key : '';
    sensor_data ? updateData.sensorData = sensor_data : '';
    alerts ? updateData.alerts = alerts : '';

    Webhook.findByIdAndUpdate(req.params.id, updateData, { new: true }, function (err: any, data: any) {
        if (err) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Document with same name already exists",
            });
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Successfully updated webhook details",
            hook_details: data
        });
    })
}

