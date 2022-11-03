import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { text } from '../../../../utils/helpers';
import { getPreferenceData, updatePreferenceData } from '../../../../services/v1/preferencesApi';
import { useDispatch, useSelector } from 'react-redux';

const Devices = () => {
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();

    const { preference, isLoading } = useSelector(
        state => ({
            preference: state.preference.data,
            isLoading: state.preference.isLoading
        })
    );

    useEffect(() => {
        dispatch(getPreferenceData({ type: 'device:limit' }))
    }, [dispatch]);

    const onSubmitForm = (formData) => {
        dispatch(updatePreferenceData(preference._id, { device_limit: formData.limit }))
    }

    return (
        <div className="block">
            <div className="block-header block-header-default">
                <div className="block-title">
                    <strong>Device Preferences</strong>
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
                                        <label htmlFor="wizard-validation-classic-customer-name">Device Limit</label>
                                        <input className="form-control" type="number" defaultValue={preference?.data?.limit}
                                            min={0} ref={register({ required: true })} name="limit"
                                        />
                                    </div>
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
        </div>
    )
}

export default Devices;
