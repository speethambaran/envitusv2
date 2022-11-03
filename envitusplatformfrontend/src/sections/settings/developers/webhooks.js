import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch, Link } from 'react-router-dom';
import Select from 'react-select';
import ConfirmationModal from '../../../components/modal/confirmationModal';
import { text, WebhookStatus } from '../../../utils/helpers';
import Page from '../../../components/paginations/page';
import { listWebhook, deleteWebhook } from '../../../services/v1/webhookApi';

const Webhooks = () => {
    const dispatch = useDispatch();
    const { url } = useRouteMatch();
    const [modalShow, setModalShow] = useState(false); // show/hide modal
    const [delWebhookId, setDelWebhookId] = useState(null);
    const [status, setStatus] = useState('enabled');
    const handlePageChange = (pageNumber) => {
        dispatch(listWebhook({
            skip: (pageNumber - 1) * pagination.limit,
            limit: pagination.limit
        }));
    }
    const { list, pagination, loading, role } = useSelector(
        state => ({
            list: state.webhook.list,
            pagination: state.webhook.pagination,
            loading: state.webhook.loading,
            role: state.user.currentUser.role
        })
    );
    const delWebhook = () => {
        dispatch(deleteWebhook(delWebhookId))
        setModalShow(false);
        dispatch(listWebhook({ status: status }));
    }
    const reloadList = (query) => {
        setStatus(query.value)
        dispatch(listWebhook({ status: query.value }));
    }
    useEffect(() => {
        dispatch(listWebhook({ status: status }));
    }, [dispatch]);

    const getDefaultValue = (value, type) => {
        let data = '';
        switch (type) {
            case 'status':
                data = WebhookStatus.find((element) => { return element.value === value })
                break;
            default:
                break;
        }
        return data;
    }
    console.log("URL", url);
    return (
        <div>
            <div className="block">
                <div className="block-header block-header-default">
                    <h3 className="block-title text-uppercase">Webhooks</h3>
                    <div className="block-options">
                        <Link to={`${url}/webhooks/add`} >
                            <button type="button" className="btn btn-outline-primary">
                                Add Webhook
                        </button>
                        </Link>
                    </div>
                </div>
                <div className="block-content">
                    <p>
                        Webhooks allow external services to be notified when certain events happen. When the specified events happen, we’ll send a POST request to each of the URLs you provide.
                    </p>
                </div>
                {!loading &&
                    <div className="block-content block-content-full">
                        <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                            <tbody>
                                {list.map((item, i) => {
                                    return <tr key={i}>
                                        <td className="d-none d-sm-table-cell">{item.url} ( {item.sensorData ? ' Sensor Data ' : ''}
                                            {item.alerts ? ', Alerts' : ''} )</td>
                                        <td>
                                            <Link to={`${url}/webhooks/edit/${item._id}`} >
                                                <button type="button" className="btn btn-sm btn-outline-primary mr-5" data-toggle="tooltip" title="Edit Webhook">
                                                    <i className="fa fa-pencil"></i>
                                                </button>
                                            </Link>
                                            <button type="button" className="btn btn-sm btn-outline-danger mr-5" data-toggle="tooltip" title="Delete Webhook"
                                                onClick={() => { setModalShow(true); setDelWebhookId(item._id) }}
                                            >
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </td>

                                    </tr>
                                })
                                }
                            </tbody>
                        </table>
                    </div>
                }
                <ConfirmationModal
                    show={modalShow}
                    title={text.title.deleteWebhook}
                    body={text.body.deleteWebhook}
                    confirmAction={() => delWebhook()}
                    onHide={() => setModalShow(false)}>
                </ConfirmationModal>
            </div>
        </div>
    )
}

export default Webhooks;
