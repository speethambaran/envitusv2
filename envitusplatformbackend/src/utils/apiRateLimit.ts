import { ApiKey } from '../models/ApiKey';
import { ApiLog } from '../models/ApiLog';
import { scheduleJob } from 'node-schedule';

export const livedataApiLimit = async (req: any) => {
    const key: any = req.headers.apikey;
    const apikey: any = await validateApiKey(key);

    return new Promise((resolve, reject) => {
        if (apikey) {
            const apiLog = new ApiLog({
                apikey: key,
                status: apikey.status,
                logs: req.url
            })
            apiLog.save(function (err: any, data: any) {
                if (err) {
                    console.log(err)
                }
                if (!err) {
                    return ({
                        status: "OK",
                        message: "Document created",
                        log_details: data
                    });
                }
            })
        }
        resolve(apikey.status);
    })

}

const validateApiKey = (apikey: any) => {
    return new Promise((resolve, reject) => {
        ApiKey.findOne({ apiKey: apikey, isDeleted: false }, function (err: any, key: any) {

            let rateLimit: any = {
                status: 'Error'
            }
            if (key) {
                let current = key.currentLimit + 1;
                let freq = key.frequency - 1;
                if (current <= key.limit) {
                    if (key.frequency > 0) {
                        ApiKey.findOneAndUpdate({ apiKey: apikey, isDeleted: false }, { currentLimit: current, frequency: freq }, {}, function (err: any, data: any) {

                            if (err) {
                                console.log(err)
                            }
                            else {
                                rateLimit = {
                                    status: 'OK'
                                }
                            }
                            resolve(rateLimit);
                        })
                    }
                    else {
                        rateLimit = {
                            status: 'Limit Exceeded'
                        }
                        resolve(rateLimit);
                    }
                }

            }
            else {
                resolve(rateLimit);
            }

        })
    })
}

export const resetAllLimits = function () {
    ApiKey.updateMany({ isDeleted: false }, { currentLimit: 0 }, {}, function (err: any, data: any) {
        if (err)
            console.log(err);
    })
}

export const resetFrequency = function () {

    setInterval(() => {
        ApiKey.updateMany({ isDeleted: false }, { frequency: 10 }, {}, function (err: any, data: any) {
            if (err)
                console.log(err);
        })
    }, 60000)

}