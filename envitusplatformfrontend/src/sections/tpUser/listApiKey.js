import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './apiKey.scss'
import Page from '../../components/paginations/page';
import { getApiKeyList, deleteApiKey } from '../../services/v1/apiKeyApi';
import { useRouteMatch, Link } from 'react-router-dom';
import { apiKeyStatus, userAccess, text } from '../../utils/helpers';
import Select from 'react-select';
import ConfirmationModal from '../../components/modal/confirmationModal';
import Webhook from '../settings/developers/webhooks';

const ListApiKey = () => {
    const dispatch = useDispatch();
    const [apiStatus, setApiStatus] = useState('enabled');
    const { list, pagination, loading, role } = useSelector(
        state => ({
            list: state.thirdPartyUser.list,
            pagination: state.thirdPartyUser.pagination,
            loading: state.thirdPartyUser.loading,
            role: state.user.currentUser.role
        })
    );

    const [modalShow, setModalShow] = useState(false); // show/hide modal
    const [delAPIId, setDelAPIId] = useState(null);

    useEffect(() => {
        dispatch(getApiKeyList({ status: apiStatus }));
    }, [dispatch]);


    const handlePageChange = (pageNumber) => {
        dispatch(getApiKeyList({
            skip: (pageNumber - 1) * pagination.limit,
            limit: pagination.limit
        }));
    }
    const { url } = useRouteMatch();

    const getDefaultValue = (value, type) => {
        let data = '';
        switch (type) {
            case 'api_status':
                data = apiKeyStatus.find((element) => { return element.value === value })
                break;
            default:
                break;
        }
        return data;
    }

    const reloadApiList = (query) => {
        setApiStatus(query.value)
        dispatch(getApiKeyList({ status: query.value }));
    }

    const deleteKey = () => {
        dispatch(deleteApiKey(delAPIId, { status: apiStatus }))
        setModalShow(false);
    }

    return (
        <div>
            <div className="block">
                <div className="block-header block-header-default">
                    <h3 className="block-title text-uppercase">Api Key</h3>
                    <div className="block-options">
                        {userAccess.apiKeyManagement.add.includes(role) &&
                            <Link to={`${url}/add`} >
                                <button type="button" className="btn btn-outline-primary">Add API Key</button>
                            </Link>
                        }
                    </div>
                </div>
                {!loading &&
                    <div className="col-12 block-content">
                        <div className="row">
                            <div className="col-3">
                                <label htmlFor="profile-settings-name">Status</label>
                                <Select
                                    defaultValue={getDefaultValue(apiStatus, 'api_status')}
                                    placeholder={'Status'}
                                    options={apiKeyStatus}
                                    onChange={reloadApiList}
                                />
                            </div>
                        </div>
                    </div>
                }
                {!loading &&
                    <div className="block-content block-content-full">
                        <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th className="d-none d-sm-table-cell">Api Key</th>
                                    <th className="d-none d-sm-table-cell">Limit</th>
                                    <th className="d-none d-sm-table-cell">Status</th>
                                    {userAccess.apiKeyManagement.edit.includes(role) && userAccess.apiKeyManagement.edit.includes(role) &&
                                        <th>Action</th>
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {list.map((item, i) => {
                                    return <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td className="font-w600">{item.name}</td>
                                        <td className="d-none d-sm-table-cell">{item.apiKey}</td>
                                        <td className="d-none d-sm-table-cell">{item.limit}</td>
                                        <td className="d-none d-sm-table-cell">
                                            {item.activated &&
                                                <span className="badge badge-success">Enabled</span>
                                            }
                                            {!item.activated &&
                                                <span className="badge badge-danger">Disabled</span>
                                            }
                                        </td>
                                        {userAccess.apiKeyManagement.edit.includes(role) &&
                                            <td>
                                                <Link to={`${url}/edit/${item._id}`} >
                                                    <button type="button" className="btn btn-sm btn-outline-primary mr-5" data-toggle="tooltip" title="Edit Api Key">
                                                        <i className="fa fa-pencil"></i>
                                                    </button>
                                                </Link>
                                                <button type="button" className="btn btn-sm btn-outline-danger mr-5" data-toggle="tooltip" title="Delete Api Key"
                                                    onClick={() => { setModalShow(true); setDelAPIId(item._id) }}>
                                                    <i className="fa fa-trash"></i>
                                                </button>
                                            </td>
                                        }
                                    </tr>
                                })
                                }
                            </tbody>
                        </table>
                        <div style={{ textAlign: 'center', marginTop: 10 }}>
                            <Page
                                activePage={pagination.currentPage}
                                itemsCountPerPage={pagination.limit}
                                totalItemsCount={pagination.totalItems}
                                handlePageChange={(pageNumber) => handlePageChange(pageNumber)}>
                            </Page>
                        </div>
                    </div>
                }
                <ConfirmationModal
                    show={modalShow}
                    title={text.title.deleteAPIKey}
                    body={text.body.deleteAPIKey}
                    confirmAction={() => deleteKey()}
                    onHide={() => setModalShow(false)}>
                </ConfirmationModal>
            </div>
            <Webhook></Webhook>
        </div>
    )
}

export default ListApiKey;