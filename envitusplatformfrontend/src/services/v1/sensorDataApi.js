/* eslint-disable eol-last */
import { API } from '../api';

/**
 * Get - Livedata
 *
 * @param
 */
export async function getLivedata(params) {
    const urlParam = {};
    const livedata = await new Promise(resolve => {
        API.get("/device/sensor/livedata?" + new URLSearchParams(Object.assign(urlParam, params))).then(res => {
            resolve(res.data);
        })
    });
    return livedata;
}

/**
 * Get - Statistics
 *
 * @param
 */
export async function getStatistics(params) {
    const urlParam = {};
    const statistics = await new Promise(resolve => {
        API.get("/device/sensor/statistics?" + new URLSearchParams(Object.assign(urlParam, params))).then(res => {
            resolve(res.data);
        })
    });
    return statistics;
}

/**
 * Get - Rawdata
 *
 * @param
 */
export async function getRawdata(params) {
    const urlParam = {};
    const rawdata = await new Promise(resolve => {
        API.get("/device/sensor/rawdata?" + new URLSearchParams(Object.assign(urlParam, params))).then(res => {
            resolve(res.data);
        })
    });
    return rawdata;
}
