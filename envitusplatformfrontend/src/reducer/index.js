import userReducer from './userReducer';
import deviceReducer from './deviceReducer';
import liveDataReducer from './liveDataReducer';
import formReducer from './formReducer';
import alarmReducer from './alarmReducer';
import thirdPartyUserReducer from './thirdPartyUserReducer';
import { combineReducers } from 'redux';
import { reducer as toastrReducer } from 'react-redux-toastr';
import diagnosticsReducer from './diagnosticsReducer';
import organizationReducer from './organizationReducer';
import { loadingBarReducer } from 'react-redux-loading-bar'
import sensorReducer from './sensorReducer';
import dashboardReducer from './dashboardReducer';
import calibrationReducer from './calibrationReducer';
import webhookReducer from './webhookReducer';
import preferenceReducer from './preferenceReducer';

export const reducers = combineReducers({
    user: userReducer,
    devices: deviceReducer,
    formData: formReducer,
    liveData: liveDataReducer,
    alarmData: alarmReducer,
    thirdPartyUser: thirdPartyUserReducer,
    toastr: toastrReducer,
    diagnostics: diagnosticsReducer,
    organization: organizationReducer,
    loadingBar: loadingBarReducer,
    sensors: sensorReducer,
    dashboard: dashboardReducer,
    calibration: calibrationReducer,
    webhook: webhookReducer,
    preference: preferenceReducer
});
