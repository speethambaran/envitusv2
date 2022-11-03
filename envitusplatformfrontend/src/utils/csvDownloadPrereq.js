import { assign, filter, map, uniq } from 'lodash'

export const checkPrerequisite = (startDate, endDate, limit, toUTC, timeFrame) => {
    let returnObject;

    if(startDate === '' || endDate === '') {
        returnObject = {
            returnValue: 0, warningMsg: 'Enter Both Start and End Dates'
        }
        return returnObject;
    }
    
    const splitStartDate = startDate.split('-');
    const splitEndDate = endDate.split('-');
    
    let epochStartDate; let epochEndDate;
    
    if(toUTC) {
        epochStartDate = new Date(splitStartDate[0], splitStartDate[1] - 1, splitStartDate[2],
            0, 0, 0, 0).toISOString();
        epochStartDate = new Date(epochStartDate).valueOf();
        epochEndDate = new Date(splitEndDate[0], splitEndDate[1] - 1, splitEndDate[2],
            23, 59, 59, 999).toISOString();  
        epochEndDate = new Date(epochEndDate).valueOf();
    }

    else {
        const formattedStartDate = new Date(splitStartDate[0], splitStartDate[1] - 1, splitStartDate[2],
            0, 0, 0, 0);
        epochStartDate = formattedStartDate.valueOf();

        const formattedEndDate = new Date(splitEndDate[0], splitEndDate[1] - 1, splitEndDate[2],
            23, 59, 59, 999);
        epochEndDate = formattedEndDate.valueOf();
    }

    const epochDifference = Math.abs(epochEndDate - epochStartDate);
    const oneDay = 24 * 60 * 60 * 1000;
    if(timeFrame && (timeFrame === 'hourly') && epochDifference / oneDay > 1) {
        returnObject = {
            returnValue: 0,
            warningMsg: 'Selected period exceeds ' + 1 + ' days! Please select a date within'
        }
        return returnObject;
    } else if(epochDifference / oneDay > limit) {
        returnObject = {
            returnValue: 0,
            warningMsg: 'Selected period exceeds ' + limit + ' days! Please select a date within'
        }
        return returnObject;
    }

    returnObject = {
        epochStartDate: epochStartDate, epochEndDate: epochEndDate, returnValue: 1
    }
    return returnObject;
};

export const formatCsv = (datas, isDataStat, deviceData) => {
    const exportData = [];
    if(isDataStat) {
        const timeFrame = Object.getOwnPropertyNames( datas )[0];
        const tempData = datas[timeFrame];
        const keys = uniq(map(tempData, 'key'));
        keys.forEach(key => {
            const data = {Date: key};
            if(timeFrame === 'hourlyStat') {
                let date = new Date(key).toLocaleString();
                date = date.split(','); date = date.join(' ::')
                data.Date = date;
            }
            deviceData.paramDefinitions.forEach(param => {
                if(param.isCsvParam) {
                    const paramStats = filter(tempData, {'paramName': param.paramName, key: key});
                    paramStats.forEach(selectedParam => {
                        const paramHead = (param.csvHead) ? param.csvHead : param.displayName;
                        if(param.isDerived) {
                            if(param.valueType === "time" && selectedParam.statParams.latestValue !== 'None') {
                                data[paramHead] = 
                                    new Date(parseInt(selectedParam.statParams.latestValue, 10)).toLocaleTimeString();
                            } else if(param.valueType === "date"  && selectedParam.statParams.latestValue !== 'None') {
                                let date = new Date(parseInt(selectedParam.statParams.latestValue, 10)).toLocaleString();
                                date = date.split(','); date = date.join(' ::')
                                data[paramHead] = date + param.unit;
                            } else {
                                data[paramHead] = selectedParam.statParams.latestValue + param.unit;
                            }
                        } else {
                            const sumAvg = Boolean(param.needCumil) ? (selectedParam.statParams.sum) :
                                (selectedParam.statParams.sum/selectedParam.statParams.count).toFixed(2)
                            data[paramHead] = sumAvg + param.unit;
                        }
                    });
                }
            });
            exportData.push(data)
        });
    } else {
        datas.forEach(data => {
            const newProperties = {DeviceId: data.logicalDeviceId,
                receivedTime: new Date(data.data.receivedTime).toLocaleString()
            }
            let row = data.data; delete row["receivedTime"];
            row = assign(newProperties, row)
            exportData.push(row);
        })
    }
    return exportData;
};
