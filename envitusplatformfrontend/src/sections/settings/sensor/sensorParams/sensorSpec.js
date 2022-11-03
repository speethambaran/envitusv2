import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { addSensorParameter, listSensorParameter, deleteSensorParameter, updateSensorParameter } from '../../../../services/v1/sensorApi';
import { text, yesOrNo } from '../../../../utils/helpers';
import Select from 'react-select';
import Page from '../../../../components/paginations/page';
import ConfirmationModal from '../../../../components/modal/confirmationModal';

const SensorSpec = () => {
	const { register, handleSubmit } = useForm();
	const [showParamAddForm, setParamAddForm] = useState(false);
	const [isDisplay, setIsDisplay] = useState(true);
	const [isFilterable, setIsFilterable] = useState(true);
	const { register: registerSensorparams, handleSubmit: handleSubmitSensorParams } = useForm();
	const [showParamEditForm, setParamEditForm] = useState(false);
	const [modalShow, setModalShow] = useState(false); // show/hide modal
	const [deleteItemId, setDeleteItemId] = useState(null);
	const [sensorSpecParamEditData, setSensorSpecParamEditData] = useState(null);

	const { list, pagination } = useSelector(
		state => ({
			list: state.sensors.sensorParamList,
			loading: state.user.loading,
			pagination: state.sensors.pagination
		})
	);

	const onSubmitForm = (formData) => {
		const params = {
			...formData,
			display_enabled: isDisplay,
			filterable: isFilterable
		}
		if (isDisplay != null) {
			params.display_enabled = isDisplay
		}

		if (isFilterable != null) {
			params.filterable = isFilterable
		}

		dispatch(addSensorParameter(params));
	}

	const onSubmitFormEditSpecParams = (formData) => {
		const params = {
			...formData
		}
		if (isDisplay != null) {
			params.display_enabled = isDisplay
		}

		if (isFilterable != null) {
			params.filterable = isFilterable
		}
		dispatch(updateSensorParameter(sensorSpecParamEditData._id, params));
		setParamEditForm(false)
	}


	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(listSensorParameter())
	}, [dispatch]);

	const hanldeSelect = (option, type) => {
		switch (type) {
			case 'is_filterable':
				setIsFilterable(option.value);
				break;
			case 'display_enabled':
				setIsDisplay(option.value);
				break;
			default:
		}

	}

	const handlePageChange = (pageNumber) => {
		dispatch(listSensorParameter({
			skip: (pageNumber - 1) * pagination.limit,
			limit: pagination.limit
		}));
	}

	const getDefaultValues = (data, value) => {
		return data.find((e) => { return e.value == value })
	}
	return (
		<div className="block">
			<div className="block-header block-header-default">
				<div className="block-title">
					<strong>Sensor Parameters</strong>
				</div>
				<div className="block-options">
					<button type="button" className="btn btn-sm btn-secondary mr-5"
						onClick={() => { setParamEditForm(false); setParamAddForm(true); }} data-toggle="tooltip" title="Add Sensor Parameters"
					>
						<i className="si si-plus" />
					</button>
				</div>
			</div>
			<div className="block-content">
				<div className="push">
					{showParamAddForm &&
						<form onSubmit={handleSubmit(onSubmitForm)}>
							<div className="row">
								<div className="col-6">
									<div className="form-group">
										<label htmlFor="wizard-validation-classic-customer-name">Parameter Name</label>
										<input className="form-control" type="text" ref={register({ required: true })} name="param_name" />
									</div>
									<div className="form-group">
										<label htmlFor="wizard-validation-classic-customer-name">Display Name</label>
										<input className="form-control" type="text" ref={register({ required: true })} name="display_name" />
									</div>
									<div className="form-group">
										<label htmlFor="wizard-validation-classic-customer-name">Display Name Html</label>
										<input className="form-control" type="text" ref={register({ required: true })} name="display_name_html" />
									</div>
									<div className="form-group">
										<label htmlFor="wizard-validation-classic-customer-name">Value Precision</label>
										<input className="form-control" type="number" min="1" defaultValue="1"
											ref={register({ required: true })} name="value_precision"
										/>
									</div>
									<div className="form-group">
										<label htmlFor="wizard-validation-classic-customer-name">Filterable</label>
										<Select
											defaultValue={yesOrNo('is_filterable')[0]}
											placeholder={'Default'}
											options={yesOrNo('is_filterable')}
											onChange={(e) => hanldeSelect(e, 'is_filterable')}
										/>
									</div>
								</div>
								<div className="col-6">
									<div className="form-group">
										<label htmlFor="wizard-validation-classic-customer-name">Unit</label>
										<input className="form-control" type="text" ref={register({ required: true })} name="unit" />
									</div>
									<div className="form-group">
										<label htmlFor="wizard-validation-classic-customer-name">Unit Display Html</label>
										<input className="form-control" type="text" ref={register({ required: true })} name="unit_html" />
									</div>
									<div className="form-group">
										<label htmlFor="wizard-validation-classic-customer-name">Display Enabled</label>
										<Select
											defaultValue={yesOrNo('display_enabled')[0]}
											placeholder={'Default'}
											options={yesOrNo('display_enabled')}
											onChange={(e) => hanldeSelect(e, 'display_enabled')}
										/>
									</div>
									<div className="form-group">
										<label htmlFor="wizard-validation-classic-customer-name">Min Range</label>
										<input className="form-control" type="number" ref={register({ required: true })} name="range_min" />
									</div>
									<div className="form-group">
										<label htmlFor="wizard-validation-classic-customer-name">Max Range</label>
										<input className="form-control" type="number" ref={register({ required: true })} name="range_max" />
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-6">
									<button type="button" className="btn btn-alt-primary mr-10" onClick={() => setParamAddForm(false)} >{text.buttons.cancel}</button>
									<button type="submit" className="btn btn-alt-primary">{text.buttons.save}</button>
								</div>
							</div>
						</form>
					}

					{showParamEditForm &&
						<form onSubmit={handleSubmitSensorParams(onSubmitFormEditSpecParams)}>
							<div className="row">
								<div className="col-6">
									<div className="form-group">
										<label htmlFor="wizard-validation-classic-customer-name">Parameter Name</label>
										<input className="form-control" type="text" disabled defaultValue={sensorSpecParamEditData.paramName} />
									</div>
									<div className="form-group">
										<label htmlFor="wizard-validation-classic-customer-name">Display Name</label>
										<input className="form-control" type="text" ref={registerSensorparams({ required: true })}
											defaultValue={sensorSpecParamEditData.displayName} name="display_name"
										/>
									</div>
									<div className="form-group">
										<label htmlFor="wizard-validation-classic-customer-name">Display Name Html</label>
										<input className="form-control" type="text" ref={registerSensorparams({ required: true })}
											defaultValue={sensorSpecParamEditData.displayNameHtml} name="display_name_html"
										/>
									</div>
									<div className="form-group">
										<label htmlFor="wizard-validation-classic-customer-name">Value Precision</label>
										<input className="form-control" type="number" min="1" defaultValue="1"
											defaultValue={sensorSpecParamEditData.valuePrecision} ref={registerSensorparams({ required: true })}
											name="value_precision"
										/>
									</div>
									<div className="form-group">
										<label htmlFor="wizard-validation-classic-customer-name">Filterable</label>
										<Select
											defaultValue={getDefaultValues(yesOrNo('is_filterable'), sensorSpecParamEditData.isFilterable)}
											placeholder={'Default'}
											options={yesOrNo('is_filterable')}
											onChange={(e) => hanldeSelect(e, 'is_filterable')}
										/>
									</div>
								</div>
								<div className="col-6">
									<div className="form-group">
										<label htmlFor="wizard-validation-classic-customer-name">Unit</label>
										<input className="form-control" type="text" ref={registerSensorparams({ required: true })}
											name="unit" defaultValue={sensorSpecParamEditData.unit}
										/>
									</div>
									<div className="form-group">
										<label htmlFor="wizard-validation-classic-customer-name">Unit Display Html</label>
										<input className="form-control" type="text" ref={registerSensorparams({ required: true })}
											name="unit_html" defaultValue={sensorSpecParamEditData.unitDisplayHtml}
										/>
									</div>
									<div className="form-group">
										<label htmlFor="wizard-validation-classic-customer-name">Display Enabled</label>
										<Select
											defaultValue={getDefaultValues(yesOrNo('display_enabled'), sensorSpecParamEditData.isDisplayEnabled)}
											placeholder={'Default'}
											options={yesOrNo('display_enabled')}
											onChange={(e) => hanldeSelect(e, 'display_enabled')}
										/>
									</div>
									<div className="form-group">
										<label htmlFor="wizard-validation-classic-customer-name">Min Range</label>
										<input className="form-control" type="number" ref={registerSensorparams({ required: true })}
											defaultValue={sensorSpecParamEditData.maxRanges.min} name="range_min"
										/>
									</div>
									<div className="form-group">
										<label htmlFor="wizard-validation-classic-customer-name">Max Range</label>
										<input className="form-control" type="number" ref={registerSensorparams({ required: true })}
											defaultValue={sensorSpecParamEditData.maxRanges.max} name="range_max"
										/>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-6">
									<button type="button" className="btn btn-alt-primary mr-10" onClick={() => setParamEditForm(false)} >{text.buttons.cancel}</button>
									<button type="submit" className="btn btn-alt-primary">{text.buttons.update}</button>
								</div>
							</div>
						</form>
					}

				</div>
				<table className="js-table-checkable table table-hover table-vcenter">
					<thead>
						<tr>
							<th>Display Name</th>
							<th className="d-none d-sm-table-cell">Parameter</th>
							<th className="d-none d-sm-table-cell">Min</th>
							<th className="d-none d-sm-table-cell">Max</th>
							<th className="d-none d-sm-table-cell">Action</th>
						</tr>
					</thead>
					<tbody>
						{list.map((item, i) => {
							return <tr key={i}>
								<td className="d-none d-sm-table-cell font-w600">{item.displayName}</td>
								<td>
									<div className="text-muted mt-5">{item.paramName + '( ' + item.unit + ' )'}</div>
									<span className="badge badge-success mr-5">{'Value Precision : ' + item.valuePrecision}</span>
									<span className="badge badge-success mr-5">{'Display Enabled : ' + item.isDisplayEnabled}</span>
									<span className="badge badge-success mr-5">{'Filterable : ' + item.isFilterable}</span>
								</td>
								<td>{item.maxRanges ? item.maxRanges.min : 0}</td>
								<td>{item.maxRanges ? item.maxRanges.max : 0}</td>
								<td className="d-none d-xl-table-cell font-w600 font-size-sm text-muted" style={{ width: 160 }}>
									<button type="button" className="btn btn-sm btn-secondary mr-5" data-toggle="tooltip"
										onClick={() => { setParamAddForm(false); setParamEditForm(true); setSensorSpecParamEditData(item) }} title="Edit Device"
									>
										<i className="fa fa-pencil" />
									</button>
									<button type="button" className="btn btn-sm btn-secondary mr-5"
										onClick={() => { setModalShow(true); setDeleteItemId(item._id) }} data-toggle="tooltip" title="Delete Device"
									>
										<i className="fa fa-trash" />
									</button>
								</td>
							</tr>
						})}
					</tbody>
				</table>
				<div style={{ textAlign: 'center', marginTop: 10 }}>
					<Page
						activePage={pagination.currentPage}
						itemsCountPerPage={pagination.limit}
						totalItemsCount={pagination.totalItems}
						handlePageChange={(pageNumber) => handlePageChange(pageNumber)}
					/>
				</div>

				<ConfirmationModal
					show={modalShow}
					title={text.title.deleteSensorType}
					body={text.body.deleteSensorType}
					confirmAction={() => { dispatch(deleteSensorParameter(deleteItemId)); setModalShow(false); }}
					onHide={() => setModalShow(false)}
				/>
			</div>
		</div>
	)
}

export default SensorSpec;
