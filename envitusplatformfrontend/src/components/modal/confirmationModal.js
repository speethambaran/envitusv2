import React from 'react';
import './modal.scss';
import { Modal, Button } from 'react-bootstrap';

function ConfirmationModal(props) {
    const { confirmAction, ...rest } = props;
    return (
        <Modal
            {...rest}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            top
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{props.body}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={props.onHide}>Cancel</Button>
                <Button variant="outline-success" onClick={confirmAction}>Ok</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ConfirmationModal;
