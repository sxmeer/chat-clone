import React from 'react';
import './Modal.css';
import Backdrop from '../Backdrop/Backdrop';
const Modal = (props) => {
  return (
    <div>
      <Backdrop show={props.show} close={props.closeModal} />
      <div
        style={{
          transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
          opacity: props.show ? '1' : '0',
          padding: props.padding ? props.padding : '16px',
          borderRadius: props.borderRadius ? props.borderRadius : '4px'
        }}
        className="modal">
        {props.children}
      </div>
    </div>
  );
}

export default Modal;