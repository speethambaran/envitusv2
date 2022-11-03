import { Request, Response } from 'express';
import request from 'request';
import { seedData, aqiCalculator } from '@utils';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { deviceDetails, handleDeviceErrors, generateAlerts } from '@controllers';
import { SensorData } from '../models/SensorData';
import { SensorRawData } from '../models/SensorRawData';
import { Types } from 'mongoose';
import { SensorSpecExclude } from '@helpers';
import { Devices } from '../models/Devices';
import { Aqi } from '../models/Aqi';
import moment from 'moment';
import { postSensorDatatoUrls } from './WebhookController';

//  Sensor data calibration process
const processCalibration = (val: any, paramDefinitions: any) => {
    if (val != undefined) {
        if (paramDefinitions.calibration != null) {
            for (let i = 0; i < paramDefinitions.calibration.data.length; i++) {
                const calibItem = paramDefinitions.calibration.data[i];
                if (calibItem.offset == undefined) {
                    calibItem.offset = 0;
                }

                if (val >= calibItem.min && val <= calibItem.max) {
                    if (paramDefinitions.calibration.type == null || paramDefinitions.calibration.type == "translate") {
                        val = val + calibItem.offset;
                    }
                    else if (paramDefinitions.calibration.type == "scale") {
                        val = val * calibItem.offset;
                    }
                    break;

                }
            }
        }
    }

    return val;
}

// Parameter conversions
const doParamConversion = function (param: string, value: number | null) {
    if (param === 'NO2' && value != null) {
        value = (value * 0.0409 * 46.01) * 1000;
    } else if (param === 'SO2' && value != null) {
        value = (value * 0.0409 * 64.06) * 1000;
    } else if (param === 'O3' && value != null) {
        value = (value * 0.0409 * 48) * 1000;
    } else if (param === 'CO' && value != null) {
        value = (value * 0.0409 * 28.01);
    } else if (param === 'NH3' && value != null) {
        value = (value * 0.0409 * 17.031) * 1000;
    }
    return value;
}

// AQMS parameter conversions
const getAqmsConversion = function (data: any) {
    if (data.NO2 != null) {
        data.NO2 = (data.NO2 * 0.0409 * 46.01) * 1000;
    }
    if (data.SO2 != null) {
        data.SO2 = (data.SO2 * 0.0409 * 64.06) * 1000;
    }
    if (data.O3 != null) {
        data.O3 = (data.O3 * 0.0409 * 48) * 1000;
    }
    if (data.CO != null) {
        data.CO = (data.CO * 0.0409 * 28.01);
    }
    if (data.NH3 != null) {
        data.NH3 = (data.NH3 * 0.0409 * 17.031) * 1000;
    }
    const currentdate = new Date();
    data.receivedTime = currentdate.valueOf();
    return data;
}

// Hashed conversion for multiple data post
const getHashedConversion = function (data: any) {
    const firstParam = data[Object.keys(data)[0]].toString().split("#");
    let returnData: any = Array(firstParam.length).fill({});
    for (const key of Object.keys(data)) {
        if (key !== 'time' && key !== 'samplingInterval') {
            let paramVals = data[key].toString().split("#");
            paramVals.forEach((val: any, count: string | number) => {
                val = doParamConversion(key, parseInt(val));
                returnData[count] = { ...returnData[count], ...{ [key]: parseInt(val) } }
            });
        } else if (key === 'time') {
            const latestDate = new Date(data.time).valueOf();
            for (let index = 0; index < firstParam.length; index++) {
                const datasetTime = latestDate - ((firstParam.length - (index + 1)) * data.samplingInterval * 1000);
                returnData[index] = { ...returnData[index], ...{ receivedTime: datasetTime } }
            }
        }
    }
    return returnData;
}

/**
 * Handle and Process post data from device
 *
 * @param
 */
export const processDeviceData = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ "success": false, "errors": errors.array({ onlyFirstError: true }) });
    }
    const { deviceId, data } = req.body;

    const deviceDeatails = await deviceDetails({ "deviceId": deviceId });
    if (deviceDeatails) {
        let sensorData = {};
        let isAqi = false;
        //  Convert data parameters
        switch (process.env.PROJECT_TYPE) {
            case 'AQMS':
                isAqi = true;
                if (process.env.SINGLET_POST === "false") {
                    sensorData = getHashedConversion(data)
                } else {
                    sensorData = getAqmsConversion(data);
                }
                break;
            case 'SOIL':
                sensorData = data;
                break;
            default:
                isAqi = true;
                sensorData = getAqmsConversion(data)
                break;
        }
        //  Parse incoming data
        parseInComingData(deviceDeatails, sensorData, isAqi);

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Data has been processed successfully"
        });
    } else {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
            success: false,
            message: "Device not found"
        });
    }
}

// Parse incoming data
const parseInComingData = async (deviceDeatails: any, sensorData: any, isAqi: boolean) => {
    let receivedAt = new Date();
    if (sensorData.time) {
        receivedAt = new Date(sensorData.time);
    }
    const rawData = {
        deviceId: Types.ObjectId(deviceDeatails._id),
        latitude: deviceDeatails.location.latitude,
        longitude: deviceDeatails.location.longitude,
        data: sensorData,
        receivedAt: receivedAt
    }

    const rawDataDetails: any = await saveRawDataAndGetId(rawData);
    if (rawDataDetails) {
        const processedData: any = await parseData(sensorData, deviceDeatails, deviceDeatails.paramDefinitions);
        processedData.receivedAt = receivedAt
        //Generate Alarms
        generateAlerts(deviceDeatails.deviceId, processedData);
        postSensorDatatoUrls(processedData);

        // to do raw aqi calculation
        if (isAqi) {
            const rawAqi: any = findAQIFromLiveData(processedData);
            if (rawAqi == -1) {
            } else {
                processedData.rawAQI = Number(rawAqi.AQI.toFixed(3));
                processedData.prominentPollutant = rawAqi.prominentPollutant;
            }

        }

        const sensorDataModel = new SensorData({
            deviceId: Types.ObjectId(deviceDeatails._id),
            rawDataId: Types.ObjectId(rawDataDetails._id),
            data: processedData,
            receivedAt: receivedAt
        })
        sensorDataModel.save(function (err: any, result: any) {
            //  Device error handler
            handleDeviceErrors(deviceDeatails, sensorData, result)
            Devices.findByIdAndUpdate(deviceDeatails._id, { lastDataReceiveTime: receivedAt, rawAqi: processedData.rawAQI }, {}, function (err: any, device: any) { })
        })
    }
}
export const findAQIFromLiveData = (currentData: any) => {
    const resAqi = -1;
    let count = 0;
    let aqiDetails = { AQI: -9999999999, prominentPollutant: '' };
    let paramValueMap: any = {};
    let isPM = false;
    for (let paramName in currentData) {
        if (!isAQIApplicableForParamType(paramName))
            continue;
        const subIndexValue: any = aqiCalculator(paramName.toUpperCase(), currentData[paramName]);
        paramValueMap[paramName.toUpperCase()] = subIndexValue;
        if (subIndexValue) {
            if (aqiDetails.AQI < subIndexValue) {
                aqiDetails.AQI = subIndexValue;
                aqiDetails.prominentPollutant = paramName;
            }
            (paramName === "PM2p5" || paramName == "PM10") ? isPM = true : '';
            count++;
        }

    }
    return (count >= 3 && isPM) ? aqiDetails : resAqi;
}

const isAQIApplicableForParamType = (paramName: any) => {
    paramName = paramName.toUpperCase();

    if (paramName == "PM2P5" || paramName == "PM10" || paramName == "SO2" || paramName == "NO2" ||
        paramName == "CO" || paramName == "O3" || paramName == "NH3" || paramName == "C6H6")
        return true;
    return false;
}

// WMAFilter
const WMAFilter = (oldValue: any, newValue: any, filter: any) => {
    return oldValue * filter.weightT0 + newValue * filter.weightT1;
}

// Parse Data
const parseData = (data: any, device: any, paramDefinitions: any) => {
    return new Promise(async (resolve, reject) => {
        let filterResult: any = {};

        for (var i = 0; i < paramDefinitions.length; i++) {

            if (paramDefinitions[i].maxRanges != null) {
                if (paramDefinitions[i].maxRanges.max != null && data[paramDefinitions[i].paramName] > paramDefinitions[i].maxRanges.max) {
                    data[paramDefinitions[i].paramName] = paramDefinitions[i].maxRanges.max;

                }
                if (paramDefinitions[i].maxRanges.min != null && data[paramDefinitions[i].paramName] < paramDefinitions[i].maxRanges.min) {
                    data[paramDefinitions[i].paramName] = paramDefinitions[i].maxRanges.min;
                }
            }
            filterResult[paramDefinitions[i].paramName] = data[paramDefinitions[i].paramName];
            if (!SensorSpecExclude.includes(paramDefinitions[i].paramName)) {
                if (filterResult[paramDefinitions[i].paramName]) {
                    filterResult[paramDefinitions[i].paramName] = Number(parseFloat(filterResult[paramDefinitions[i].paramName]).toFixed(3))
                }
            }
            filterResult[paramDefinitions[i].paramName] = processCalibration(filterResult[paramDefinitions[i].paramName], paramDefinitions[i]);

            if (paramDefinitions[i] && paramDefinitions[i].filteringMethod == "WMAFilter") {
                const originalVal = filterResult[paramDefinitions[i].paramName];
                SensorData.findOne({ deviceId: Types.ObjectId(device._id), isDeleted: 0 }, { sort: { 'createdAt': -1 } }, {}, function (err: any, oldData: any) {
                    if (oldData && paramDefinitions[i] && oldData[paramDefinitions[i].paramName] != null) {
                        var oldValue = data[paramDefinitions[i].paramName];
                        var newValue = processCalibration(originalVal, paramDefinitions[i]);;
                        var res = WMAFilter(oldValue, newValue, paramDefinitions[i].filteringMethodDef);
                        filterResult[paramDefinitions[i].paramName] = res;
                    }
                })
            }
            resolve(filterResult);
        }

    });
}

//  Save and get raw data id
const saveRawDataAndGetId = (data: any) => {
    return new Promise((resolve, reject) => {
        const rawData = new SensorRawData(data);
        rawData.save(function (err: any, data: any) {
            if (err) { reject(null) }
            resolve(data)
        })
    });
}

/**
 * Device dummy data seed
 *
 * @param
 */
export const dummyDataSeed = () => {
    seedData.devices.forEach(deviceId => {
        const data: any = {}
        seedData.params.forEach(param => {
            if (param == 'receivedTime') {
                data['time'] = new Date()
            } else {
                data[param] = Math.floor(Math.random() * 10);
            }
        });
        const sensorData: any = {
            deviceId: deviceId,
            data: data
        }
        request.post(
            'http://localhost:3200/v1.0/device/sensor/livedata',
            {
                json: sensorData,
            },
            (error, res, body) => {
                if (error) {
                    console.error(error)
                    return
                }
            }
        )
    });
}

/**
 * Get Device last data
 * @getDeviceLastData
 * @param
 */
export const getDeviceLastData = (deviceId: any) => {
    return new Promise((resolve, reject) => {
        SensorData.findOne({ deviceId: Types.ObjectId(deviceId) }).sort('-createdAt').exec(function (err: any, data: any) {
            console.log(data)
            resolve(data)
        })
    })
}

/**
 * Get Device last hour AQI Details
 * @getDeviceLastData
 * @param
 */
export const getDeviceLastHourAQI = (deviceId: any) => {
    return new Promise((resolve, reject) => {
        Aqi.findOne({ deviceId: Types.ObjectId(deviceId), dateTime: { $gte: new Date(moment().subtract(60, 'minutes').format()) } }).sort('-createdAt').exec(function (err: any, data: any) {
            resolve(data)
        })
    })
}