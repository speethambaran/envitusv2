import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import Page from '../../../components/paginations/page';
import LineChart from '../../../components/charts/lineChart';
import { statTypes, chartColors, userAccess } from '../../../utils/helpers';
import { getStatistics, getLivedata } from '../../../services/v1/sensorDataApi';

import Select from 'react-select';
import { Row, Col } from 'react-bootstrap';
import { toastr } from 'react-redux-toastr';
import ScrollBar from "react-perfect-scrollbar";
import { ExportToCsv } from 'export-to-csv';
import { WindRose, calculateWindRose } from "react-windrose-chart";
import moment from 'moment';

const Statistics = (props) => {
    const dispatch = useDispatch();
    const { role } = useSelector(
        state => ({
            role: state.user.currentUser.role
        })
    );

    const [tab, setTab] = useState('table');
    const [selectOptions, setSelectOptions] = useState({ devs: [], params: [], statTypes: [] });
    const [selectedDevs, setSelectedDevs] = useState({});
    const [selectedParams, setSelectedParams] = useState('');
    const [selectedStat, setSelectedStat] = useState('');
    const [tableData, setTableData] = useState({});
    const [chartData, setChartData] = useState({});
    const [windChartData, setWindChartData] = useState({});
    const [pagination, setPagination] = useState({ totalItems: 0, skip: 0, limit: 0, totalPages: 0, currentPage: 1 })
    const [filter, setFilter] = useState({ skip: 0, limit: 50 })

    useEffect(() => {
        if (props.list.length > 0) { initSelectOptions() }
    }, [props.list, tab]);

    useEffect(() => {
        if (props.dateRange.valid && selectedDevs.value && selectedParams && selectedStat) { fetchStat() }
    }, [selectedDevs, selectedParams, selectedStat, filter, props.dateRange.start, props.dateRange.end]);

    const initSelectOptions = () => {
        const devs = props.list.map(dev => {
            return {
                type: 'select_dev',
                value: dev._id,
                label: dev.deviceId
            }
        });

        let params = props.list[0].paramDefinitions.filter(
            param => param.isDisplayEnabled && param.valueType !== 'string' && param.valueType !== 'date'
        ).map(param => {
            return {
                type: 'select_params',
                value: param.paramName,
                label: param.displayName
            }
        })

        if (tab === 'table') {
            params = [...[{ type: 'select_params', value: 'all', label: 'ALL' }], ...params]
        }

        setSelectOptions({ devs: devs, params: params, statTypes: statTypes })
        if (props.preselectedDev) {
            const devLabVal = devs.find((dev) => { return dev.label === props.preselectedDev })
            if (devLabVal) {
                setSelectedDevs({ label: devLabVal.label, value: devLabVal.value })
            } else {
                toastr.warning("Device not found", "")
            }
        } else {
            setSelectedDevs({ label: devs[0].label, value: devs[0].value })
        }
        setSelectedParams(params[0].value)
        setSelectedStat('daily')
    }

    const getDefaultValue = (value, type) => {
        let data = '';
        switch (type) {
            case 'select_dev':
                data = selectOptions.devs.find((element) => { return element.value === value })
                break;
            case 'select_params':
                data = selectOptions.params.find((element) => { return element.value === value })
                break;
            case 'stat_type':
                data = selectOptions.statTypes.find((element) => { return element.value === value })
            default:
                break;
        }
        return data;
    }

    const updateSelect = (option) => {
        switch (option.type) {
            case 'select_dev':
                setSelectedDevs({ label: option.label, value: option.value })
                break;
            case 'select_params':
                setSelectedParams(option.value)
                break;
            case 'stat_type':
                setSelectedStat(option.value)
                break;
            default:
                break;
        }
    }

    const getTimeZoneOffset = () => {
        const timeZoneOffsetMin = Math.abs(new Date().getTimezoneOffset());
        let timeZoneOffset = ((timeZoneOffsetMin / 60) < 10 ? '0' + String(Math.floor(timeZoneOffsetMin / 60)) : String(Math.floor(timeZoneOffsetMin / 60))) +
            (((timeZoneOffsetMin % 60)) < 10 ? '0' + String(Math.floor((timeZoneOffsetMin % 60))) : String(Math.floor((timeZoneOffsetMin % 60))));
        timeZoneOffset = (new Date().getTimezoneOffset() > 0) ? (timeZoneOffset = '-' + timeZoneOffset) : (timeZoneOffset = '+' + timeZoneOffset);
        return timeZoneOffset;
    }

    const downloadStat = async () => {
        const stat = await getStatistics({
            devs: selectedDevs.value,
            params: selectedParams,
            skip: 'null',
            limit: 'null',
            statType: selectedStat,
            timeZone: getTimeZoneOffset(),
            startdate: props.dateRange.start,
            enddate: props.dateRange.end
        })
        if (stat.statistics.length > 0) {
            const data = formatStat(stat.statistics);
            const options = {
                filename: selectedDevs.label + '-Stat',
                showLabels: true,
                useKeysAsHeaders: true,
            };
            const csvExporter = new ExportToCsv(options);
            csvExporter.generateCsv(data);
        } else {
            toastr.error('Oops !!', 'No data On selected Dates')
        }
    }

    const formatStat = (datas) => {
        const csvdata = []
        datas.forEach((data, count1) => {
            data.parameters.forEach((param, count2) => {
                csvdata.push({
                    Slno: (count1 * data.parameters.length) + count2,
                    Device: selectedDevs.label,
                    Date: data._id.timelyStat,
                    Parameter: param.unit ? (param.displayName + ' ' + param.unitDisplayHtml) : param.displayName,
                    Min: param.min === null ? '-' : Number(param.min).toFixed(param.precision),
                    Max: param.max === null ? '-' : Number(param.max).toFixed(param.precision),
                    Avg: param.avg === null ? '-' : Number(param.avg).toFixed(param.precision),
                    Count: data.sample_count
                })
            })
        });
        return csvdata;
    }

    const fetchStat = async () => {
        dispatch(showLoading('sectionBar'))
        let live;
        if (selectedParams === 'windSpeedAvg') {
            live = await getLivedata({
                devs: selectedDevs.value,
                params: selectedParams,
                skip: filter.skip,
                limit: filter.limit,
                startdate: props.dateRange.start,
                enddate: props.dateRange.end
            })
        }
        const stat = await getStatistics({
            devs: selectedDevs.value,
            params: selectedParams,
            skip: filter.skip,
            limit: filter.limit,
            statType: selectedStat,
            timeZone: getTimeZoneOffset(),
            startdate: props.dateRange.start,
            enddate: props.dateRange.end
        })
        dispatch(hideLoading('sectionBar'))
        setPagination(stat.pagination);
        setWindChartData(false);
        if (tab === 'table') { fillTable(stat.statistics) }
        if (tab === 'chart') { drawChart(stat.statistics) }
        if (live) { drawWindRose(live.livedata) }
    }

    const fillTable = (datas) => {
        const head = ['#', 'Date', 'Param', 'Min', 'Max', 'Avg', 'Count']; const body = [];
        datas.forEach((data, count1) => {
            if (selectedParams === 'all') {
                data.parameters.forEach((param, count2) => {
                    body.push([((count1 * data.parameters.length) + count2 + 1), data._id.timelyStat,
                    (param.unit ? (param.displayName + ' ' + param.unitDisplayHtml) : param.displayName),
                    (param.min === null ? '-' : Number(param.min).toFixed(param.precision)),
                    (param.max === null ? '-' : Number(param.max).toFixed(param.precision)),
                    (param.avg === null ? '-' : Number(param.avg).toFixed(param.precision)),
                    data.sample_count
                    ])
                })
            } else {
                const param = data.parameters.find(parameter => parameter.paramName === selectedParams);
                body.push([count1, data._id.timelyStat,
                    (param.unit ? (param.displayName + ' ' + param.unitDisplayHtml) : param.displayName),
                    (param.min === null ? '-' : Number(param.min).toFixed(param.precision)),
                    (param.max === null ? '-' : Number(param.max).toFixed(param.precision)),
                    (param.avg === null ? '-' : Number(param.avg).toFixed(param.precision)),
                    data.sample_count
                ])
            }
        })

        setTableData({
            head: head,
            body: body
        })
    }

    const drawChart = (datas) => {
        const labels = []; let datasets = [];
        const commonPty = {
            fill: false,
            borderWidth: 2
        }
        const datasRev = datas.reverse();
        datasRev.forEach((data, count) => {
            labels.push(data._id.timelyStat);
            const param = data.parameters.find(parameter => parameter.paramName === selectedParams);
            if (count === 0) {
                datasets = [
                    { ...commonPty, ...{ borderColor: [chartColors[0]], label: 'Min', data: [param.min] } },
                    { ...commonPty, ...{ borderColor: [chartColors[1]], label: 'Avg', data: [param.avg] } },
                    { ...commonPty, ...{ borderColor: [chartColors[2]], label: 'Max', data: [param.max] } }
                ]
            } else {
                datasets[0].data.push(param.min);
                datasets[1].data.push(param.avg);
                datasets[2].data.push(param.max);
            }
        })

        setChartData({
            labels: labels,
            datasets: datasets
        })
    }

    const drawWindRose = (datas) => {

        const timeFrame = { daily: 'day', hourly: 'hour', monthly: 'month', yearly: 'year' };
        const columns = ["angle", "0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7+"];
        const windData = [];
        let windObj = { direction: [], speed: [] }
        let prevKey = '';
        datas.forEach((data, count) => {
            if ((prevKey !== moment(data.receivedAt).get(timeFrame[selectedStat])) && count !== 0) {
                const windRoseData = calculateWindRose(windObj);
                windData.push({ data: windRoseData, columns: columns, key: prevKey + ' :: ' + timeFrame[selectedStat] })
                windObj = { direction: [], speed: [] }
            }
            const windDirection = data.parameters.find(parameter => parameter.paramName === 'windDirection');
            const windSpeed = data.parameters.find(parameter => parameter.paramName === 'windSpeedAvg');
            windObj.direction.push(windDirection.value.toFixed(windDirection.precision));
            windObj.speed.push(windSpeed.value.toFixed(windSpeed.precision));
            prevKey = moment(data.receivedAt).get(timeFrame[selectedStat]);

        })
        const windRoseData = calculateWindRose(windObj);
        windData.push({ data: windRoseData, columns: columns, key: prevKey + ' :: ' + timeFrame[selectedStat] })
        setWindChartData(windData)

    }

    const handlePageChange = (pageNumber) => {
        setFilter({
            skip: (pageNumber - 1) * pagination.limit,
            limit: pagination.limit
        })
    }

    return (
        <div className="block">
            <div className="block-header block-header-default">
                <h3 className="block-title">Statistics</h3>
                <div className="block-options">
                    <button type="button" className="btn-block-option" data-toggle="tooltip" title="Table"
                        onClick={() => setTab('table')}
                    >
                        <i className="fa fa-table" />
                    </button>
                    <button type="button" className="btn-block-option" data-toggle="tooltip" title="Chart"
                        onClick={() => setTab('chart')}
                    >
                        <i className="fa fa-bar-chart" />
                    </button>
                    {userAccess.liveDataManagement.download.includes(role) &&
                        <button type="button" className="btn-block-option" data-toggle="tooltip" title="Download"
                            onClick={() => downloadStat()}
                        >
                            <i className="fa fa-download" />
                        </button>
                    }
                    <button type="button" className="btn-block-option" data-toggle="tooltip" title="Refresh List"
                        onClick={() => fetchStat()}>
                        <i className="si si-refresh" />
                    </button>
                </div>
            </div>

            <div className="col-12 block-content">
                {(tab === 'table') &&
                    <div>
                        <div className="mb-3 row">
                            <Col lg={4}>
                                <label>Device</label>
                                <Select
                                    value={getDefaultValue(selectedDevs.value, 'select_dev')}
                                    options={selectOptions.devs} onChange={updateSelect}
                                />
                            </Col>
                            <Col lg={4}>
                                <label>Parameter</label>
                                <Select
                                    value={getDefaultValue(selectedParams, 'select_params')}
                                    options={selectOptions.params} onChange={updateSelect}
                                />
                            </Col>
                            <Col lg={4}>
                                <label>Statistics Type</label>
                                <Select
                                    value={getDefaultValue(selectedStat, 'stat_type')}
                                    options={selectOptions.statTypes} onChange={updateSelect}
                                />
                            </Col>
                        </div>
                        <ScrollBar component="div" className="mb-3">
                            <div style={{ height: '50vh' }}>
                                <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                    <thead>
                                        <tr>
                                            {tableData.head && tableData.head.map(head => {
                                                return (<th key={head}>{head}</th>)
                                            })}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableData.body && tableData.body.map((body, count1) => {
                                            return (
                                                <tr key={count1}>
                                                    {body && body.map((content, count2) => {
                                                        return (<td key={String(count1) + '-' + String(count2)} className="d-none d-sm-table-cell">{content}</td>)
                                                    })}
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </ScrollBar>

                    </div>
                }
                {(tab === 'chart') &&
                    <div>
                        <Row className="mb-3">
                            <Col lg={4}>
                                <label>Device</label>
                                <Select
                                    value={getDefaultValue(selectedDevs.value, 'select_dev')}
                                    options={selectOptions.devs} onChange={updateSelect}
                                />
                            </Col>
                            <Col lg={4}>
                                <label>Parameter</label>
                                <Select
                                    value={getDefaultValue(selectedParams, 'select_params')}
                                    options={selectOptions.params} onChange={updateSelect}
                                />
                            </Col>
                            <Col lg={4}>
                                <label>Statistics Type</label>
                                <Select
                                    value={getDefaultValue(selectedStat, 'stat_type')}
                                    options={selectOptions.statTypes} onChange={updateSelect}
                                />
                            </Col>
                        </Row>
                        {(!windChartData) &&
                            <div style={{ width: '60vw', margin: '0 auto', marginBottom: '2%' }}>
                                <LineChart chartData={chartData} />
                            </div>
                        }
                        {(windChartData) &&
                            <Row>
                                {windChartData.map(data => {
                                    return (
                                        <Col sm={6} key={data.key} >
                                            <p className="text-center">{data.key}</p>
                                            <WindRose data={data.data} columns={data.columns} />
                                        </Col>
                                    )
                                })}
                            </Row>
                        }
                    </div>
                }
                <div style={{ textAlign: 'center', 'marginTop': 10 }}>
                    <Page
                        activePage={pagination.currentPage}
                        itemsCountPerPage={pagination.limit}
                        totalItemsCount={pagination.totalItems}
                        handlePageChange={(pageNumber) => handlePageChange(pageNumber)}
                    />
                </div>
            </div>
        </div>
    )
}

export default Statistics;
