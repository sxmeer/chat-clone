import { Button } from '@material-ui/core';
import React from 'react'
import Modal from '../Modal/Modal.js';
import './AlertMessage.css';

const AlertMessage = (props) => {
  return (
    <Modal
      padding="16px 0 0 0"
      borderRadius="16px"
      show={props.show}
      closeModal={props.onPositiveBtnClick} >
      <div className="alertMessage">
        <img src="https://cdn.icon-icons.com/icons2/2201/PNG/512/whatsapp_logo_icon_134017.png" height="40px" width="40px" alt="" />
        <h4>{props.message}</h4>
        <div className="alertMessage__btnDiv">
          <Button className="alertMessage__negBtn" onClick={props.onPositiveBtnClick}>{props.positiveBtn}</Button>
        </div>
      </div>
    </Modal>
  )
}

export default AlertMessage;
