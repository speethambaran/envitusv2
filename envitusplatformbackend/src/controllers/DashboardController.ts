import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { deviceDetails, getDeviceLastData, getDeviceLastHourAQI } from '@controllers';
import mongoose from "mongoose";

/**
 * 
 *
 * @param
 */
export const dashboardStatistics = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ success: false, "errors": errors.array({ onlyFirstError: true }) });
    }
    const response: any = {
        aqi: -1,
        pollutants: {
            display: {
                PM2p5: true,
                PM10: true,
                CO: true,
                NO2: true,
                SO2: true,
                O3: true
            }
        },
        weather: {},
        device_details: {}
    }
    const device: any = await deviceDetails({ _id: mongoose.Types.ObjectId(req.params.deviceId), isDeleted: false, activated: true });
    if (device) {
        const deviceLastData: any = await getDeviceLastHourAQI(req.params.deviceId);
        if (deviceLastData) {
            response.aqi = Math.round(deviceLastData.aqi)
            response.pollutants.PM2p5 = deviceLastData.data.PM2p5
            response.pollutants.PM10 = deviceLastData.data.PM10
            response.pollutants.CO = deviceLastData.data.CO
            response.pollutants.NO2 = deviceLastData.data.NO2
            response.pollutants.SO2 = deviceLastData.data.SO2
            response.pollutants.O3 = deviceLastData.data.O3
            response.pollutants.prominentPollutant = deviceLastData.data.prominentPollutant

            response.weather = {
                temperature: deviceLastData.data.temperature,
                humidity: deviceLastData.data.humidity,
                UV: deviceLastData.data.UV,
                rain: deviceLastData.data.rain
            }
            const aqiParams = ['PM2p5', 'PM10', 'CO', 'NO2', 'SO2', 'O3'];
            aqiParams.forEach(param => {
                const paramIndex = device.paramDefinitions.findIndex((e: { paramName: string; }) => { return e.paramName === param })
                if (paramIndex == -1) {
                    response.pollutants.display[param] = false;
                }
            });
        }
        response.device_details = {
            _id: device._id,
            city: device.location.city,
            landMark: device.location.landMark,
            lastDataReceiveTime: device.dateTime
        }
    }

    return res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Data successfully retrieved",
        statistics: response
    });
}