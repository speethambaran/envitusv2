/* eslint-disable eol-last */
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { text } from '../../../../utils/helpers';
import { addSensorType, listSensorType, getSensorSpecIdList, updateSensorType, deleteSensorType } from '../../../../services/v1/sensorApi';
import { toastr } from 'react-redux-toastr';
import ConfirmationModal from '../../../../components/modal/confirmationModal';

const SensorType = () => {
    const dispatch = useDispatch();

    const [showAddForm, setAddForm] = useState(false);
    const [showEditForm, setEditForm] = useState(false);
    const [sensorTypeEditData, setSensorTypeEditData] = useState(null);
    const [modalShow, setModalShow] = useState(false); // show/hide modal
    const [deleteItemId, setDeleteItemId] = useState(null);

    const { register, handleSubmit } = useForm();
    const { register: registerEditSpec, handleSubmit: handleSubmitEditSpec } = useForm();
    const [parameters, setParameters] = useState(null);

    const { list, sensorParamIds } = useSelector(
        state => ({
            list: state.sensors.sensorTypeList,
            sensorParamIds: state.sensors.sensorParamIds
        })
    );

    const onSubmitForm = (formData) => {
        const params = {
            ...formData
        }
        if (parameters != null) {
            params.parameters = parameters;
            dispatch(addSensorType(params));
        } else {
            toastr.warning("Parameters Required", "Please select at leat one parameter")
        }
    }

    const onSubmitFormEditSpec = (formData) => {
        const params = {
            ...formData
        }
        if (parameters != null) {
            params.parameters = parameters;
            dispatch(updateSensorType(sensorTypeEditData._id, params));
            setEditForm(false)
        } else {
            toastr.warning("Parameters Required", "Please select at leat one parameter")
        }
    }

    useEffect(() => {
        dispatch(getSensorSpecIdList())
        dispatch(listSensorType());
    }, [dispatch]);

    const hanldeSelect = (option, type) => {
        console.log(option)
        const ids = [];
        switch (type) {
            case 'spec_id':
                if (option != null && option.length) {
                    for (let index = 0; index < option.length; index++) {
                        const item = option[index];
                        ids.push(item.value)
                    }
                    setParameters(ids);
                } else {
                    setParameters(null);
                }

                break;
            default:
                break;
        }

    }

    const getDefaultValues = (values) => {
        const defaultValues = []
        values.forEach(element => {
            defaultValues.push({
                type: 'spec_id',
                value: element._id,
                label: element.displayName
            })
        });
        return defaultValues;
    }

    const setParameterIds = (values) => {
        const ids = [];
        values.forEach(element => {
            ids.push(element._id)
        });
        return ids;
    }

    return (
        <div className="block">
            <div className="block-header block-header-default">
                <div className="block-title">
                    <strong>Sensor Types</strong>
                </div>
                <div className="block-options">
                    <button type="button" className="btn btn-sm btn-secondary mr-5"
                        onClick={() => { setEditForm(false); setAddForm(true); }} data-toggle="tooltip" title="Add Sensor Types">
                        <i className="si si-plus"></i>
                    </button>
                </div>
            </div>
            <div className="block-content">
                <div className="push">
                    {showAddForm &&
                        <form onSubmit={handleSubmit(onSubmitForm)}>
                            <div className="row">
                                <div className="col-6">
                                    <div className="form-group">
                                        <label htmlFor="wizard-validation-classic-customer-name">Sensor Type</label>
                                        <input className="form-control" type="text" ref={register({ required: true })} name="name" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="profile-settings-name">Sensor Parameters</label>
                                        <Select
                                            defaultValue={''}
                                            placeholder={'Senosr parameters'}
                                            options={sensorParamIds}
                                            isMulti={true}
                                            onChange={(e) => hanldeSelect(e, 'spec_id')}
                                        />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-group">
                                        <label htmlFor="wizard-validation-classic-customer-name">Sensor Type Description</label>
                                        <input className="form-control" type="text" ref={register({ required: true })} name="description" />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <button type="button" className="btn btn-alt-primary mr-10" onClick={() => setAddForm(false)} >{text.buttons.cancel}</button>
                                    <button type="submit" className="btn btn-alt-primary">{text.buttons.save}</button>
                                </div>
                            </div>
                        </form>
                    }
                    {showEditForm &&
                        <form onSubmit={handleSubmitEditSpec(onSubmitFormEditSpec)}>
                            <div className="row">
                                <div className="col-6">
                                    <div className="form-group">
                                        <label htmlFor="wizard-validation-classic-customer-name">Sensor Type</label>
                                        <input className="form-control" type="text" disabled defaultValue={sensorTypeEditData.name} name="name" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="profile-settings-name">Sensor Parameters</label>
                                        <Select
                                            defaultValue={getDefaultValues(sensorTypeEditData.parameters)}
                                            placeholder={'Senosr parameters'}
                                            options={sensorParamIds}
                                            isMulti={true}
                                            onChange={(e) => hanldeSelect(e, 'spec_id')}
                                        />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-group">
                                        <label htmlFor="wizard-validation-classic-customer-name">Sensor Type Description</label>
                                        <input className="form-control" type="text" defaultValue={sensorTypeEditData.description}
                                            ref={registerEditSpec({ required: true })} name="description" />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <button type="button" className="btn btn-alt-primary mr-10" onClick={() => setEditForm(false)} >{text.buttons.cancel}</button>
                                    <button type="submit" className="btn btn-alt-primary">{text.buttons.update}</button>
                                </div>
                            </div>
                        </form>
                    }
                </div>
                <table className="js-table-checkable table table-hover table-vcenter">
                    <thead>
                        <tr>
                            <th>Sensor Type</th>
                            <th className="d-none d-sm-table-cell">Description</th>
                            <th className="d-none d-sm-table-cell">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((item, i) => {
                            return <tr key={i}>
                                <td className="d-none d-sm-table-cell font-w600">{item.name}</td>
                                <td>
                                    <div className="text-muted mt-5">{item.description}</div>
                                    {item.parameters.map((param, i) => {
                                        return <span className="badge badge-success mr-5" key={i}>{param.displayName}</span>
                                    })}
                                </td>
                                <td className="d-none d-xl-table-cell font-w600 font-size-sm text-muted" style={{ width: 160 }}>
                                    <button type="button" className="btn btn-sm btn-secondary mr-5" data-toggle="tooltip"
                                        onClick={() => { setAddForm(false); setEditForm(true); setSensorTypeEditData(item); setParameters(setParameterIds(item.parameters)) }} title="Edit Device">
                                        <i className="fa fa-pencil" />
                                    </button>
                                    <button type="button" className="btn btn-sm btn-secondary mr-5" data-toggle="tooltip" title="Delete Device"
                                        onClick={() => { setDeleteItemId(item._id); setModalShow(true) }}>
                                        <i className="fa fa-trash" />
                                    </button>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>

                <ConfirmationModal
                    show={modalShow}
                    title={text.title.deleteSensorType}
                    body={text.body.deleteSensorType}
                    confirmAction={() => { dispatch(deleteSensorType(deleteItemId)); setModalShow(false); }}
                    onHide={() => setModalShow(false)}>
                </ConfirmationModal>

            </div>
        </div>
    )
}

export default SensorType;