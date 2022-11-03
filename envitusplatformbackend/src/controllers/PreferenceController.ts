import { Request, Response } from 'express';
import { StatusCodes } from "http-status-codes";
import { Preferences } from "../models/Preferences";
import { validationResult } from 'express-validator';

/**
 * 
 * @method getPreferences
 * @param
 */
export const getPreferences = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ success: false, "errors": errors.array({ onlyFirstError: true }) });
    }
    Preferences.findOne({ type: req.query.type }, function (err: any, data: any) {
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Data successfully retrieved",
            preference: data
        });
    })
}


/**
 * 
 * @method addPreferences
 * @param
 */
export const addPreferences = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ success: false, "errors": errors.array({ onlyFirstError: true }) });
    }
    const { type, preference } = req.body;
    const preferenceModel = new Preferences({
        type: type,
        data: preference
    })
    preferenceModel.save(function (err: any, data: any) {
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Preference successfully added",
            preference: preferenceModel
        });
    })
}

/**
 * 
 * @method addPreferences
 * @param
 */
export const updatePreferences = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ success: false, "errors": errors.array({ onlyFirstError: true }) });
    }
    let update: any = {}
    const { email_notify, sms_notify, device_limit, is_schedule, schedule_frequency, email } = req.body
    if (email_notify != undefined) {
        update['data.email_notify'] = email_notify
    }
    if (sms_notify != undefined) {
        update['data.sms_notify'] = sms_notify
    }
    if (device_limit != undefined) {
        update['data.limit'] = device_limit
    }

    if (is_schedule != undefined) {
        update['data.is_schedule'] = is_schedule
    }
    if (schedule_frequency != undefined) {
        update['data.schedule_frequency'] = schedule_frequency
    }
    if (email != undefined) {
        update['data.email'] = email
    }

    Preferences.findByIdAndUpdate(req.params.id, { $set: update }, { new: true }, function (err: any, preferenceDetails: any) {
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Preference successfully updated",
            preference: preferenceDetails
        });
    })
}

/**
* Seed user data
*
* @method  seedPreferences
* 
* @param   req
* @param   res
*/
export const seedPreferences = () => {
    const preferences = [
        {
            "type": "device:limit",
            "data": {
                "limit": "25"
            }
        },
        {
            "type": "notification",
            "data": {
                "email_notify": false,
                "sms_notify": false
            }
        },
        {
            "type": "report:schedule",
            "data": {
                "is_schedule": true,
                "schedule_frequency": "monthly",
                "email": "admin@boustead.com"
            }
        }
    ]

    for (let index = 0; index < preferences.length; index++) {
        const element = preferences[index];
        Preferences.findOne({ type: element.type }, function (err: any, data: any) {
            if (!data) {
                const preferenceModel = new Preferences(element);
                preferenceModel.save(function (err: any, data: any) { })
            }
        })
    }
}