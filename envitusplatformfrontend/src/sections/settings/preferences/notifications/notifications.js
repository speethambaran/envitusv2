import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from "react-hook-form";
import { text, yesOrNo } from '../../../../utils/helpers';
import Select from 'react-select';
import { getPreferenceData, updatePreferenceData } from '../../../../services/v1/preferencesApi';

const Notifications = () => {
    const { handleSubmit } = useForm();
    const [emailNotify, setEmailNotify] = useState(null)
    const [smsNotify, setSmsNotify] = useState(null)
    const dispatch = useDispatch();
    const { preference, isLoading } = useSelector(
        state => ({
            preference: state.preference.data,
            isLoading: state.preference.isLoading
        })
    );

    useEffect(() => {
        dispatch(getPreferenceData({ type: 'notification' }))
    }, [dispatch]);

    const onSubmitForm = (formData) => {
        const payload = {}
        if (emailNotify != null) {
            payload.email_notify = emailNotify
        }
        if (smsNotify != null) {
            payload.sms_notify = smsNotify
        }
        dispatch(updatePreferenceData(preference._id, payload))
    }

    const handleSelection = (option, type) => {
        switch (type) {
            case 'email_notify':
                setEmailNotify(option.value)
                break;
            case 'sms_notify':
                setSmsNotify(option.value)
                break;
            default:
                break;
        }
    }

    return (
        <div className="block">
            <div className="block-header block-header-default">
                <div className="block-title">
                    <strong>Notifications Preferences</strong>
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
                                        <label htmlFor="wizard-validation-classic-customer-name">Email Notifications</label>
                                        {preference.data &&
                                            <Select
                                                defaultValue={{
                                                    "type": 'email_notify',
                                                    "value": preference?.data?.email_notify ? true : false,
                                                    "label": preference?.data?.email_notify ? 'Yes' : 'No',
                                                }}
                                                placeholder={'Email Notifications'}
                                                options={yesOrNo('email_notify')}
                                                isMulti={false}
                                                onChange={(e) => handleSelection(e, 'email_notify')}
                                            />
                                        }
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="wizard-validation-classic-customer-name">SMS Notifications</label>
                                        {preference.data &&
                                            <Select
                                                defaultValue={{
                                                    "type": 'sms_notify',
                                                    "value": preference?.data?.sms_notify ? true : false,
                                                    "label": preference?.data?.sms_notify ? 'Yes' : 'No',
                                                }}
                                                placeholder={'SMS Notifications'}
                                                options={yesOrNo('sms_notify')}
                                                isMulti={false}
                                                onChange={(e) => handleSelection(e, 'sms_notify')}
                                            />
                                        }
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

export default Notifications;