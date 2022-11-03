import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Page from '../../../components/paginations/page';
import { getRawdata } from '../../../services/v1/sensorDataApi';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import Select from 'react-select';
import { Row, Col } from 'react-bootstrap';
import { toastr } from 'react-redux-toastr';
import ScrollBar from "react-perfect-scrollbar";
import { ExportToCsv } from 'export-to-csv';

const RawData = (props) => {
    const [selectOptions, setSelectOptions] = useState({ devs: [] });
    const [selectedDevs, setSelectedDevs] = useState({});
    const [tableData, setTableData] = useState({});
    const [pagination, setPagination] = useState({ totalItems: 0, skip: 0, limit: 0, totalPages: 0, currentPage: 1 })
    const [filter, setFilter] = useState({ skip: 0, limit: 50 })
    const dispatch = useDispatch();
    useEffect(() => {
        if (props.list.length > 0) { initSelectOptions() }
    }, [props.list]);

    useEffect(() => {
        if (props.dateRange.valid && selectedDevs.value) { fetchRaw() }
    }, [selectedDevs, filter, props.dateRange.start, props.dateRange.end]);

    const initSelectOptions = () => {
        const devs = props.list.map(dev => {
            return {
                type: 'select_dev',
                value: dev._id,
                label: dev.deviceId
            }
        });

        setSelectOptions({ devs: devs })
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
    }

    const getDefaultValue = (value, type) => {
        let data = '';
        switch (type) {
            case 'select_dev':
                data = selectOptions.devs.find((element) => { return element.value === value })
                break;
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
            default:
                break;
        }
    }

    const downloadRaw = async () => {
        const raw = await getRawdata({
            devs: selectedDevs.value,
            skip: 'null',
            limit: 'null',
            startdate: props.dateRange.start,
            enddate: props.dateRange.end
        })
        if (raw.rawdata.length > 0) {
            const data = formatRaw(raw.rawdata);
            const options = {
                filename: selectedDevs.label + '-Raw',
                showLabels: true,
                useKeysAsHeaders: true,
            };
            const csvExporter = new ExportToCsv(options);
            csvExporter.generateCsv(data);
        } else {
            toastr.error('Oops !!', 'No data On selected Dates')
        }
    }

    const formatRaw = (datas) => {
        const csvdata = []
        datas.forEach((data, count) => {
            let row = {
                Slno: count, Device: selectedDevs.label,
                Data: new Date(data.receivedAt).toLocaleString("en-GB")
            }
            data.parameters.forEach(param => {
                const head = param.unit ? (param.displayName + ' ' + param.unitDisplayHtml) : param.displayName;
                if (typeof param.value === 'undefined') { row = { ...row, ...{ [head]: '-' } } }
                else if (typeof param.value === 'number') { row = { ...row, ...{ [head]: param.value.toFixed(param.precision) } } }
                else { row = { ...row, ...{ [head]: param.value } } }
            });
            csvdata.push(row)
        });
        return csvdata;
    }

    const fetchRaw = async () => {
        dispatch(showLoading('sectionBar'))
        const raw = await getRawdata({
            devs: selectedDevs.value,
            skip: filter.skip,
            limit: filter.limit,
            startdate: props.dateRange.start,
            enddate: props.dateRange.end
        })
        dispatch(hideLoading('sectionBar'))
        setPagination(raw.pagination);
        fillTable(raw.rawdata)
    }

    const fillTable = (datas) => {
        const head = ['#', 'Date']; const body = [];
        datas.forEach((data, count) => {
            const row = [count + 1, new Date(data.receivedAt).toLocaleString("en-GB")]
            data.parameters.forEach(param => {
                if (count === 0) {
                    head.push(param.unit ? (param.displayName + ' ' + param.unitDisplayHtml) : param.displayName)
                }
                if (typeof param.value === 'undefined') { row.push('-') }
                else if (typeof param.value === 'number') { row.push(param.value.toFixed(param.precision)) }
                else { row.push(param.value) }
            });
            body.push(row)
        })

        setTableData({
            head: head,
            body: body
        })
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
                <h3 className="block-title">Raw Data</h3>
                <div className="block-options">
                    <button type="button" className="btn-block-option" data-toggle="tooltip" title="Download"
                        onClick={() => downloadRaw()}
                    >
                        <i className="fa fa-download" />
                    </button>
                    <button type="button" className="btn-block-option" data-toggle="tooltip" title="Refresh List"
                        onClick={() => fetchRaw()}>
                        <i className="si si-refresh" />
                    </button>
                </div>
            </div>

            <div className="block-content">
                <div>
                    <Row className="mb-3 row">
                        <Col lg={4}>
                            <label>Device</label>
                            <Select
                                value={getDefaultValue(selectedDevs.value, 'select_dev')}
                                options={selectOptions.devs} onChange={updateSelect}
                            />
                        </Col>
                    </Row>
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
        </div>
    )
}

export default RawData;
