import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { getStatistics } from '../../../services/v1/sensorDataApi';
import BarChart from '../../../components/charts/barChart';
import { chartColors, getTimeZoneOffset } from '../../../utils/helpers';
import moment from 'moment';

const Historical = (props) => {
    const [selectOptions, setSelectOptions] = useState({ params: [] });
    const [selectedParam, setSelectedParam] = useState(process.env.REACT_APP_PARAM_DEFAULT);
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        props.selectedDev._id ? initSelects() : ''
    }, [props.selectedDev]);

    const initSelects = () => {
        const params = props.selectedDev.paramDefinitions.filter(
            param => param.isDisplayEnabled
        ).map(param => {
            return {
                type: 'select_params',
                value: param.paramName,
                label: param.displayName
            }
        })
        setSelectOptions({ params: params })
        getChartData(selectedParam);
    }

    const getChartData = async (param) => {
        const stat = await getStatistics({
            devs: props.selectedDev._id,
            params: param,
            skip: 0,
            limit: 25,
            statType: 'hourly',
            timeZone: getTimeZoneOffset(),
            startdate: new Date(moment().startOf('day').toISOString()),
            enddate: new Date(moment().endOf('day').toISOString())
        })
        drawChart(stat.statistics, param)
    }

    const drawChart = (datas, paramSelected) => {
        const labels = []; const avg = [];
        let displayName = '';
        const datasRev = datas.reverse();
        for (let index = 0; index < datasRev.length; index++) {
            const data = datasRev[index];
            labels.push(data._id.timelyStat);
            const param = data.parameters.find(parameter => parameter.paramName === paramSelected);
            if (param) {
                avg.push(Number(param.avg));
                displayName = param.displayName;
            }
        }

        const datasets = [{
            fill: false,
            lineTension: 0.5,
            backgroundColor: chartColors[0],
            borderWith: 1,
            label: displayName,
            data: avg
        }]

        setChartData({
            labels: labels,
            datasets: datasets
        })
    }

    const getDefaultValue = (value, type) => {
        let data = '';
        switch (type) {
            case 'select_params':
                data = selectOptions.params.find((element) => { return element.value === value })
                break;
            default:
                break;
        }
        return data;
    }

    const updateSelect = (option) => {
        switch (option.type) {
            case 'select_params':
                setSelectedParam(option.value)
                getChartData(option.value)
                break;
            default:
                break;
        }

    }

    return (
        <div className="block">
            <div className="block-content block-content-sm">
                <form className="js-form-search mb-10">
                    <div className="row">
                        <div className="col-8">
                            <h3 className="block-title text-uppercase">Historical Data</h3>
                        </div>
                        <div className="col-4">
                            <Select
                                value={getDefaultValue(selectedParam, 'select_params')}
                                options={selectOptions.params} onChange={updateSelect}
                            />
                        </div>
                    </div>
                </form>
                <div className="row">
                    <div className="col-12">
                        <BarChart chartData={chartData} />
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Historical;