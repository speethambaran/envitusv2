import React from 'react';
import { Form, Button, Modal, Container, Col, Row } from 'react-bootstrap';
import { authUser, getUserRole, regUser } from '../../services/userApi';
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux';

import { superAdmin, admin, supervisor, userFormData, userFrmValSts } from '../../constants';
import { userPrivilegeRole } from '../../action/userAction';
import { intialaizeForm } from '../../action/formAction';

import { toastr } from 'react-redux-toastr';
import Cards from '../card/cards';
import RegisterForm from './registerForm.js';
import './login.scss';

export class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: React.createRef(),
            password: React.createRef(),
            userRole: '',
            showModal: false,
        };

        this.props.intialaizeForm({
            data: userFormData,
            id: '',
            deviceFrmValSts: { ...userFrmValSts },
            updateType: 'add'
        });

        this.showModal = this.showModal.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.register = this.register.bind(this);
    }

    async handleSubmit(event) {
        event.preventDefault();
        const logginDetails = {
            userName: this.state.userName.current.value,
            password: this.state.password.current.value
        }
        try {
            const status = await this.props.authUser(logginDetails);
            const uname = logginDetails.userName;
            const roleArray = await this.props.getUserRole(uname);

            if (roleArray) {
                if (JSON.stringify(roleArray) === JSON.stringify(superAdmin)) {
                    this.state.userRole = 'superAdmin';
                }
                else if (JSON.stringify(roleArray) === JSON.stringify(admin)) {
                    this.state.userRole = 'Administrator';
                }
                else if (JSON.stringify(roleArray) === JSON.stringify(supervisor)) {
                    this.state.userRole = 'Supervisor';
                }
                else {
                    this.state.userRole = 'Operator';
                }
            }
            if (this.state.userRole !== '') {
                sessionStorage.setItem("userRole", this.state.userRole);
                this.props.userPrivilegeRole(this.state.userRole);
            }

            if (!status) {
                toastr.error('Oops !!', 'Invalid Username or Password');
            }
        } catch (err) {
            toastr.error('Oops !!', 'Some error Occured');
        }
    }

    showModal() {
        this.setState({ showModal: true });
    }

    handleClose() {
        this.props.intialaizeForm({
            data: userFormData,
            id: '',
            deviceFrmValSts: { ...userFrmValSts },
            updateType: 'add'
        });
        this.setState({ showModal: false });
    }

    async register(e) {
        e.preventDefault();
        try {
            this.props.formData.data.activated = true;
            this.props.formData.data.creationLog = {
                user: this.props.formData.data.userName,
                date: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
            };
            this.props.formData.data.devices = [];
            this.props.formData.data.role = "Operator";
            const status = await this.props.regUser(this.props.formData.data);
            if (!status) {
                toastr.error('Oops !!', 'Some Error Occured');
            } else {
                toastr.success('Success !!', 'User Registered. Now Login');
            }
        } catch (err) {
            toastr.error('Oops !!', 'Some Error Occured');
        }
        this.handleClose();
    }

    render() {
        if (this.props.isLoggedIn) {
            return <Redirect data-test="redirectTag" to='/dashboard' />;
        }

        const cardContent = {
            head: <h1>Login</h1>, divItem:
                <div>
                    <Form data-test="loginForm" onSubmit={this.handleSubmit}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Control data-test="loginFormUname" type="text" ref={this.state.userName}
                                placeholder="Username" required
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Control data-test="loginFormPswd" type="password" ref={this.state.password}
                                placeholder="Password" required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100">
                            Login
                    </Button>
                    </Form>
                    <div className="mt-5">
                        <small>Not a User ?</small>
                        <summary>
                            <strong className="ml-2 hover-item" onClick={this.showModal}>
                                Register
                        </strong>
                        </summary>
                    </div>
                </div>
        };

        return (
            <div>
                <Cards content={cardContent} styles="border-0 shadow" />
                <Modal aria-labelledby="contained-modal-title-vcenter" size="md" scrollable="true"
                    show={this.state.showModal} onHide={this.handleClose}
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Register User
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            <Form id="myform" onSubmit={this.register}>
                                <RegisterForm />
                            </Form>
                            <Row>
                                <Col className="pr-1">
                                    <Button className="w-100" variant="danger" onClick={this.handleClose}>Close</Button>
                                </Col>
                                <Col className="pl-1">
                                    <Button className="w-100" form="myform" variant="primary" type="submit">Save</Button>
                                </Col>
                            </Row>
                        </Container>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}


export function mapStateToProps(state) {
    return ({
        isLoggedIn: state.user.isLoggedIn,
        formData: state.formData,
    });
}

export function mapDispatchToProps(dispatch) {
    return {
        authUser: (logginDetails) => {
            return dispatch(authUser(dispatch, logginDetails))
        },
        getUserRole: (uname) => {
            return dispatch(getUserRole(dispatch, uname))
        },
        userPrivilegeRole: (role) => {
            return dispatch(userPrivilegeRole(role))
        },
        regUser: (data) => {
            return dispatch(regUser(dispatch, data))
        },
        intialaizeForm: (data) => {
            return dispatch(intialaizeForm(data))
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
