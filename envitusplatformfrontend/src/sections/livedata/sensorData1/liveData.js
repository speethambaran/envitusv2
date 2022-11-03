import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Page from '../../../components/paginations/page';
import LineChart from '../../../components/charts/lineChart';
import { getLivedata } from '../../../services/v1/sensorDataApi';
import { chartColors, userAccess } from '../../../utils/helpers';
import { showLoading, hideLoading } from 'react-redux-loading-bar';

import Select from 'react-select';
import { Row, Col } from 'react-bootstrap';
import { some, findIndex } from 'lodash';
import { toastr } from 'react-redux-toastr';
import ScrollBar from "react-perfect-scrollbar";
import { ExportToCsv } from 'export-to-csv';

const LiveData = (props) => {
	const dispatch = useDispatch();
	const { role } = useSelector(
		state => ({
			role: state.user.currentUser.role
		})
	);

	const [tab, setTab] = useState('table');
	const [selectOptions, setSelectOptions] = useState({ devs: [], params: [] });
	const [selectedDevs, setSelectedDevs] = useState({});
	const [selectedParams, setSelectedParams] = useState([]);
	const [tableData, setTableData] = useState({});
	const [chartData, setChartData] = useState({});
	const [pagination, setPagination] = useState({ totalItems: 0, skip: 0, limit: 0, totalPages: 0, currentPage: 1 })
	const [filter, setFilter] = useState({ skip: 0, limit: 50 })

	useEffect(() => {
		if (props.list.length > 0) { initSelectOptions() }
	}, [props.list, tab]);

	useEffect(() => {
		if (props.dateRange.valid && selectedDevs.value && selectedParams.length > 0) { fetchLive() }
	}, [selectedDevs, selectedParams, filter, props.dateRange.start, props.dateRange.end]);

	const initSelectOptions = () => {
		const devs = props.list.map(dev => {
			return {
				type: 'select_dev',
				value: dev._id,
				label: dev.deviceId
			}
		});

		const params = props.list[0].paramDefinitions.filter(
			param => param.isDisplayEnabled && param.valueType !== 'string' && param.valueType !== 'date'
		).map(param => {
			return {
				type: 'select_params',
				value: param.paramName,
				label: param.displayName
			}
		})

		setSelectOptions({ devs: devs, params: params })
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
		setSelectedParams([params[0].value])
	}

	const getDefaultValue = (value, type) => {
		let data = '';
		switch (type) {
			case 'select_dev':
				data = selectOptions.devs.find((element) => { return element.value === value })
				break;
			case 'select_params':
				data = selectOptions.params.filter((element) => { return value.includes(element.value) })
				break;
			default:
				break;
		}
		return data;
	}

	const updateSelect = (option, action) => {
		if (option === null || Array.isArray(option)) {
			switch (action.name) {
				case 'select_params':
					if (!option) { toastr.error('Oops !!', 'Need atleast one Parameter') }
					else if (option.length === 5) { toastr.error('Oops !!', 'Parameter Comparison Limit Reached') }
					else { setSelectedParams((option.map(param => param.value))) }
					break;
				default:
					break;
			}
		} else {
			switch (option.type) {
				case 'select_dev':
					setSelectedDevs({ label: option.label, value: option.value })
					break;
				default:
					break;
			}
		}
	}

	const downloadLive = async () => {
		const live = await getLivedata({
			devs: selectedDevs.value,
			params: selectedParams.join(','),
			skip: 'null',
			limit: 'null',
			startdate: props.dateRange.start,
			enddate: props.dateRange.end
		})
		if (live.livedata.length > 0) {
			const data = formatLive(live.livedata);
			const options = {
				filename: selectedDevs.label + '-Live',
				showLabels: true,
				useKeysAsHeaders: true,
			};
			const csvExporter = new ExportToCsv(options);
			csvExporter.generateCsv(data);
		} else {
			toastr.error('Oops !!', 'No data On selected Dates')
		}
	}

	const formatLive = (datas) => {
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

	const fetchLive = async () => {
		dispatch(showLoading('sectionBar'))
		const live = await getLivedata({
			devs: selectedDevs.value,
			params: selectedParams.join(','),
			skip: filter.skip,
			limit: filter.limit,
			startdate: props.dateRange.start,
			enddate: props.dateRange.end
		})
		dispatch(hideLoading('sectionBar'))
		setPagination(live.pagination);
		if (tab === 'table') { fillTable(live.livedata) }
		if (tab === 'chart') { drawChart(live.livedata) }
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

	const drawChart = (datas) => {
		const labels = []; const datasets = [];
		const commonPty = {
			fill: false,
			borderWidth: 2
		}
		const datasRev = datas.reverse();
		datasRev.forEach(data => {
			labels.push(new Date(data.receivedAt).toLocaleString("en-GB"))
			data.parameters.forEach((param, count) => {
				if (selectedParams.includes(param.paramName)) {
					if (some(datasets, ['label', param.displayName])) {
						const index = findIndex(datasets, ['label', param.displayName]);
						datasets[index].data.push(param.value)
					} else {
						datasets.push({
							...commonPty, ...{
								borderColor: [chartColors[count]],
								label: param.displayName,
								data: [param.value]
							}
						})
					}
				}
			})
		})

		setChartData({
			labels: labels,
			datasets: datasets
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
				<h3 className="block-title">Live Data</h3>
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
							onClick={() => downloadLive()}>
							<i className="fa fa-download" />
						</button>
					}
					<button type="button" className="btn-block-option" data-toggle="tooltip" title="Refresh List"
						onClick={() => fetchLive()}>
						<i className="si si-refresh" />
					</button>
				</div>
			</div>

			<div className="col-12 block-content">
				{(tab === 'table') &&
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
								<label>Parameters</label>
								<Select
									value={getDefaultValue(selectedParams, 'select_params')}
									options={selectOptions.params} onChange={updateSelect} isMulti={true}
									name="select_params"
								/>
							</Col>
						</Row>
						<div style={{ width: '60vw', margin: '0 auto', marginBottom: '2%' }}>
							<LineChart chartData={chartData} />
						</div>
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

export default LiveData;
