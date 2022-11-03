/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from 'react-redux';
import { text, yesOrNo, reportScheduleFrequency } from '../../../../utils/helpers';
import Select from 'react-select';
import { getPreferenceData, updatePreferenceData } from '../../../../services/v1/preferencesApi';
import {
    preferenceList
} from '../../../../action/preferenceAction';

const Reports = () => {
    const { register, handleSubmit } = useForm();
    const dispatch = useDispatch();
    const [isSchedule, setSchedule] = useState(null)
    const [scheduleFrequency, setScheduleFrequency] = useState(null)
    const { preference, isLoading } = useSelector(
        state => ({
            preference: state.preference.data,
            isLoading: state.preference.isLoading
        })
    );

    const onSubmitForm = (formData) => {
        const payload = {}
        if (isSchedule != null) {
            payload.is_schedule = isSchedule
        }
        if (scheduleFrequency != null) {
            payload.schedule_frequency = scheduleFrequency
        }
        payload.email = formData.email
        dispatch(updatePreferenceData(preference._id, payload))
    }

    useEffect(() => {
        dispatch(getPreferenceData({ type: 'report:schedule' }))
    }, [dispatch]);

    const handleScheduleChange = (value) => {
        setSchedule(value)
        dispatch(preferenceList({
            _id: preference._id,
            data: {
                is_schedule: value,
                schedule_frequency: preference.data.schedule_frequency,
                email: preference.data.email
            }
        }))
    }

    const getDefaultValue = (is_schedule) => {
        if (is_schedule) {
            return {
                "type": 'schedule',
                "value": true,
                "label": 'Yes'
            }
        }
        return {
            "type": 'schedule',
            "value": false,
            "label": 'No',
        }
    }

    return (
        <div className="block">
            <div className="block-header block-header-default">
                <div className="block-title">
                    <strong>Reports Preferences</strong>
                </div>
                <div className="block-options" />
            </div>
            <div className="block-content">
                {!isLoading &&
                    <div className="push" >
                        <form onSubmit={handleSubmit(onSubmitForm)}>
                            <div className="row">
                                <div className="col-12">
                                    <div className="form-group">
                                        <label htmlFor="wizard-validation-classic-customer-name">Schedule Report</label>
                                        {preference.data &&
                                            <Select
                                                defaultValue={getDefaultValue(preference.data.is_schedule)}
                                                placeholder={'Senosr parameters'}
                                                options={yesOrNo('schedule')}
                                                isMulti={false}
                                                onChange={(e) => { handleScheduleChange(e.value) }}
                                            />
                                        }
                                    </div>
                                    {((preference.data && preference.data.is_schedule)) &&
                                        <>
                                            <div className="form-group">
                                                <label htmlFor="wizard-validation-classic-customer-name">Schedule Frequency</label>

                                                <Select
                                                    defaultValue={{
                                                        "type": "report_frequency",
                                                        "value": preference?.data?.schedule_frequency,
                                                        "label": preference?.data?.schedule_frequency,
                                                    }}
                                                    placeholder={'Senosr parameters'}
                                                    options={reportScheduleFrequency}
                                                    isMulti={false}
                                                    onChange={(e) => setScheduleFrequency(e.value)}
                                                />

                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="wizard-validation-classic-customer-name">Email</label>
                                                <input className="form-control" type="text" defaultValue={preference?.data?.email}
                                                    ref={register({ required: true })} name="email" />
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <button type="submit" className="btn btn-alt-primary">{text.buttons.save}</button>
                                </div>
                            </div>
                        </form>
                    </div>
                }
            </div>
        </div >
    )
}

export default Reports;
