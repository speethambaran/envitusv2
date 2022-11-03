import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch, Link } from 'react-router-dom';
import { CalibCertStatus, text } from '../../../utils/helpers';
import Select from 'react-select';
import './calibration.scss';
import { listCalibCert, deleteCalibCert, fileDownload } from '../../../services/v1/calibrationApi';
import ConfirmationModal from '../../../components/modal/confirmationModal';
import Page from '../../../components/paginations/page';

const ListCert = () => {
    const dispatch = useDispatch();
    const { url } = useRouteMatch();
    const [status, setStatus] = useState('valid');
    const [modalShow, setModalShow] = useState(false); // show/hide modal
    const [delCert, setDelCert] = useState(null);

    const reloadList = (query) => {
        setStatus(query.value)
        dispatch(listCalibCert({ status: query.value }));
    }
    const { list, pagination, loading } = useSelector(
        state => ({
            list: state.calibration.list,
            pagination: state.calibration.pagination,
            loading: state.calibration.loading,
        })
    );
    const getDefaultValue = (value, type) => {
        let data = '';
        switch (type) {
            case 'status':
                data = CalibCertStatus.find((element) => { return element.value === value })
                break;
            default:
                break;
        }
        return data;
    }
    const handlePageChange = (pageNumber) => {
        dispatch(listCalibCert({
            skip: (pageNumber - 1) * pagination.limit,
            limit: pagination.limit
        }));
    }
    const deleteKey = () => {
        dispatch(deleteCalibCert(delCert))
        setModalShow(false);
        dispatch(listCalibCert({ status: status }));
    }

    useEffect(() => {
        dispatch(listCalibCert({ status: status }));
    }, [dispatch]);

    const downloadCertificate = (id, fileName) => {
        dispatch(fileDownload(id, fileName));
    }

    return (
        <div className="block">
            <div className="block-header block-header-default">
                <h3 className="block-title text-uppercase">Calibration</h3>
                <div className="block-options">
                    <Link to={`${url}/add`} >
                        <button type="button" className="btn btn-outline-primary">
                            <i className="si si-plus"></i> Add Certificate
                        </button>
                    </Link>

                </div>
            </div>
            {!loading &&
                <div className="col-12 block-content">
                    <div className="row">
                        <div className="col-3">
                            <label htmlFor="profile-settings-name">Status</label>
                            <Select
                                defaultValue={getDefaultValue(status, 'status')}
                                placeholder={'Status'}
                                options={CalibCertStatus}
                                onChange={reloadList}
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
                                <th>Certificate Id</th>
                                <th className="d-none d-sm-table-cell">Expiry</th>
                                <th className="d-none d-sm-table-cell">Device ID</th>
                                <th className="d-none d-sm-table-cell">Status</th>
                                <th className="d-none d-sm-table-cell">Actions</th>

                            </tr>
                        </thead>
                        <tbody>
                            {list.map((item, i) => {
                                return <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td className="d-none d-sm-table-cell">{item.certificateId}</td>
                                    <td className="d-none d-sm-table-cell">{item.expireDate}</td>
                                    <td className="d-none d-sm-table-cell">{item.device}</td>

                                    <td className="d-none d-sm-table-cell">
                                        {item.activated &&
                                            <span className="badge badge-success">Valid</span>
                                        }
                                        {!item.activated &&
                                            <span className="badge badge-danger">Expired</span>
                                        }
                                    </td>
                                    <td className="d-none d-sm-table-cell">
                                        <button type="button" className="btn btn-sm btn-secondary mr-5"
                                            onClick={() => downloadCertificate(item._id, item.fileName)}
                                            data-toggle="tooltip" title="Download Certificate">
                                            <i className="fa fa-download" />
                                        </button>
                                        <button type="button" className="btn btn-sm btn-danger mr-5" data-toggle="tooltip" title="Delete Certificate"
                                            onClick={() => { setModalShow(true); setDelCert(item._id) }}>
                                            <i className="fa fa-trash"></i>
                                        </button>
                                    </td>
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
                title={text.title.deleteCert}
                body={text.body.deleteCert}
                confirmAction={() => deleteKey()}
                onHide={() => setModalShow(false)}>
            </ConfirmationModal>
        </div>
    )
}

export default ListCert;