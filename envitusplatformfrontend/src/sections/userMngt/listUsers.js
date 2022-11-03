import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Page from '../../components/paginations/page';
import { useRouteMatch, Link } from 'react-router-dom';
import { getAllUsers, deleteUser } from '../../services/v1/userApi';
import Select from 'react-select';
import { userRoles, userStatus, text } from '../../utils/helpers';
import ConfirmationModal from '../../components/modal/confirmationModal';

const ListUsers = () => {

	const dispatch = useDispatch();
	const [userRole, setUserRole] = useState(null);
	const [userStat, setUserStatus] = useState(null);
	const { url } = useRouteMatch();
	const [modalShow, setModalShow] = useState(false); // show/hide modal
	const [delUserId, setDelUserId] = useState(null);

	const { list, pagination, loading } = useSelector(
		state => ({
			list: state.user.list,
			pagination: state.user.pagination,
			loading: state.user.loading
		})
	);

	useEffect(() => {
		dispatch(getAllUsers());
	}, [dispatch]);


	const handlePageChange = (pageNumber) => {
		const params = {
			skip: (pageNumber - 1) * pagination.limit,
			limit: pagination.limit
		}
		if (userRole != null) {
			params.role = userRole
		}
		if (userStatus != null) {
			params.status = userStatus
		}
		dispatch(getAllUsers(params));
	}

	const getDefaultValue = (value, type) => {
		let data = '';
		switch (type) {
			case 'user_role':
				data = userRoles.find((element) => { return element.value === value })
				break;
			case 'user_status':
				data = userStatus.find((element) => { return element.value === value })
				break;
			default:
				break;
		}
		return data;
	}

	const reloadUsersList = (query) => {
		const params = {};
		switch (query.type) {
			case 'user_role':
				setUserRole(query.value)
				if (query.value != null) {
					params.role = query.value
				}
				if (userStat != null) {
					params.status = userStat
				}
				break;
			case 'user_status':
				setUserStatus(query.value)
				if (query.value != null) {
					params.status = query.value
				}
				if (userRole != null) {
					params.role = userRole
				}
				break;
			default:
				if (userStat != null) {
					params.status = userStat
				}
				if (userRole != null) {
					params.role = userRole
				}
				break;
		}
		dispatch(getAllUsers(params))
	}

	const userDelete = () => {
		dispatch(deleteUser(delUserId));
        setModalShow(false);
	}

	return (
		<div className="block">
			<div className="block-header block-header-default">
				<h3 className="block-title">Users</h3>
				<div className="col-2">
					<Select
						defaultValue={getDefaultValue(null, 'user_status')}
						placeholder={'User Role'}
						options={userStatus}
						onChange={reloadUsersList}
					/>
				</div>
				<div className="col-2">
					<Select
						defaultValue={getDefaultValue(null, 'user_role')}
						placeholder={'User Role'}
						options={userRoles}
						onChange={reloadUsersList}
					/>
				</div>

				<div className="block-options">
					<button type="button" className="btn-block-option" data-toggle="tooltip" title="Refresh List"
						onClick={() => { reloadUsersList({ type: 'refresh' }) }}>
						<i className="si si-refresh"></i>
					</button>
					<Link to={`${url}/add`} >
						<button type="button" className="btn-block-option" data-toggle="tooltip" title="Add New User">
							<i className="si si-plus"></i>
						</button>
					</Link>

				</div>
			</div>
			{!loading &&
				<div className="block-content block-content-full">
					<table className="table table-bordered table-striped table-vcenter js-dataTable-full">
						<thead>
							<tr>
								<th>Name</th>
								<th>Role</th>
								<th>Username</th>
								<th>Email</th>
								<th>Status</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{list.map((item, i) => {
								return <tr key={i}>
									<td>{item.name}</td>
									<td>{item.role}</td>
									<td>{item.userName}</td>
									<td>{item.email}</td>
									<td className="d-none d-sm-table-cell">
										{item.activated &&
											<span className="badge badge-success">Active</span>
										}
										{!item.activated &&
											<span className="badge badge-danger">Inactive</span>
										}
									</td>
									<td>
										<Link to={`${url}/edit/${item._id}`} >
											<button type="button" className="btn btn-sm btn-secondary mr-5" data-toggle="tooltip" title="Edit User">
												<i className="fa fa-pencil"></i>
											</button>
										</Link>
										<button type="button" className="btn btn-sm btn-secondary mr-5" data-toggle="tooltip" title="Delete User"
											onClick={() => { setModalShow(true); setDelUserId(item._id) }}>
											<i className="fa fa-trash"></i>
										</button>
										<Link to={`${url}/${item._id}`} >
											<button type="button" className="btn btn-sm btn-secondary mr-5" data-toggle="tooltip" title="View User">
												<i className="fa fa-eye"></i>
											</button>
										</Link>
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
				title={text.title.deleteUser}
				body={text.body.deleteUser}
				confirmAction={() => userDelete()}
				onHide={() => setModalShow(false)}>
			</ConfirmationModal>
		</div>
	)

}

export default ListUsers;
