import { body, check, query } from 'express-validator';

export const validate = {
    login: [
        check('username', "Username doesn't exists").exists(),
        check('password').exists()
    ],
    register: [
        check('email', "Email doesn't exists").exists(),
        check('name', "Name doesn't exists").exists(),
        check('password').exists()
    ],
    userAdd: [
        check('email', "Email doesn't exists").exists(),
        check('name', "Name doesn't exists").exists(),
        check('password').exists()
    ],
    updateUserPassword: [
        check('current_password').exists(),
        check('confirm_password').exists(),
        check('password').exists()
    ],
    apikeyAdd: [
        check('name', "Name doesn't exists").exists(),
        check('limit', "Limit doesn't exists").exists(),
    ],
    webhookAdd: [
        check('url', "URL doesn't exists").exists(),
        check('key', "Secret key doesn't exists").exists(),
        check('sensor_data', "Sensor data doesn't exists").exists(),
        check('alerts', "Alerts doesn't exists").exists(),
    ],
    addPreference: [
        check('type', "Preference type doesn't exists").exists(),
        body('type', 'Preference type invalid.').isIn(['device:limit', 'email:config',
            'sms:config', 'report:schedule']),
        check('preference', "Preference values doesn't exists").exists(),
    ],
    getPreference: [
        query('type', "Preference type doesn't exists").exists(),
        query('type', 'Invalid preference type').optional().isIn(['device:limit', 'email:config',
            'sms:config', 'report:schedule', 'notification'])
    ]
}