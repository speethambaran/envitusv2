import React, { useEffect, useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrgList, deleteOrganization } from '../../../services/v1/organizationApi';
import ConfirmationModal from '../../../components/modal/confirmationModal';
import { text } from '../../../utils/helpers'
const ListOrganization = () => {
    const { url } = useRouteMatch();
    const dispatch = useDispatch();
    const { list } = useSelector(
        state => ({
            list: state.organization.list
        })
    );
    const [modalShow, setModalShow] = useState(false); // show/hide modal
    const [delOrgId, setDelOrgId] = useState(null); // show/hide modal
    useEffect(() => {
        dispatch(getOrgList());
    }, [dispatch]);

    const organizationDelete = () => {
        dispatch(deleteOrganization(delOrgId))
        setModalShow(false);
    }

    return (
        <div>
            <h2 className="content-heading">
                <Link to={`${url}/add`} >
                    <button type="button" className="btn btn-sm btn-secondary float-right" data-toggle="tooltip" title="Add New Organization">
                        <i className="si si-plus"></i>
                    </button>
                </Link>
                <i className="si si-briefcase mr-5"></i> Organizations
                    </h2>
            <div className="row items-push">
                {list.map((item, i) => {
                    return <div className="col-md-4 col-xl-4" key={i}>
                        <div className="block block-rounded ribbon ribbon-modern ribbon-primary text-center">
                            {item.isDefault &&
                                <div className="ribbon-box">{text.labels.default}</div>
                            }

                            <div className="block-content block-content-full">
                                <div className="item item-circle bg-danger text-danger-light mx-auto my-20">
                                    <i className="fa fa-globe"></i>
                                </div>
                            </div>
                            <div className="block-content block-content-full block-content-sm bg-body-light">
                                <div className="font-w600 mb-5">{item.name}</div>
                                <div className="font-size-sm text-muted">{item.description}</div>
                            </div>
                            <div className="block-content block-content-full">
                                <Link to={`/dashboard/users?org=${item._id}`} className="btn btn-rounded btn-alt-secondary m-5" >
                                    <i className="fa fa-user mr-5"></i>{text.buttons.users}
                                </Link>
                                <Link to={`/dashboard/devices?org=${item._id}`} className="btn btn-rounded btn-alt-secondary m-5">
                                    <i className="fa fa-envira mr-5"></i>{text.buttons.devices}
                                </Link>
                                <Link to={`${url}/${item._id}/edit`} className="btn btn-rounded btn-alt-secondary m-5">
                                    <i className="fa fa-pencil mr-5"></i>{text.buttons.edit}
                                </Link>
                                {!item.isDefault &&
                                    <a className="btn btn-rounded btn-alt-secondary m-5" onClick={() => { setModalShow(true); setDelOrgId(item._id) }}>
                                        <i className="fa fa-trash mr-5"></i>{text.buttons.delete}
                                    </a>
                                }
                            </div>
                        </div>
                    </div>
                })}
            </div>
            <ConfirmationModal
                show={modalShow}
                title={text.title.deleteOrganization}
                body={text.body.deleteOrganization}
                confirmAction={() => organizationDelete()}
                onHide={() => setModalShow(false)}>
            </ConfirmationModal>
        </div>
    )
}

export default ListOrganization;