import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import './CreateRoom.css';
import firebase from 'firebase';
import CryptoJS from 'crypto-js';
import db from '../../../firebase';

const CreateRoom = (props) => {
  const [roomName, setRoomName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  const createNewChat = () => {
    if (roomName && password) {
      db.collection("rooms").where("name", "==", roomName).get()
        .then(response => {
          if (response.docs.length > 0) {
            setError('This room name already exits, please choose another');
            return Promise.reject(0);
          } else {
            return db.collection("rooms").add({
              name: roomName,
              password: CryptoJS.HmacSHA1(password, props.email).toString(),
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              users: [{ name: props.displayName, email: props.email }],
              createdBy: { name: props.displayName, email: props.email }
            })
          }
        })
        .then((response) => {
          db.collection("rooms").doc(response.id)
            .collection("messages").add({
              message: props.displayName + " created the room",
              senderName: props.displayName,
              senderEmail: props.email,
              type: "info",
              timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
              props.onPositiveBtnClick(roomName);
            })
        }, (error) => {
        });
    } else {
      setError('Enter all the fields');
    }
  }


  return (
    <Modal
      padding="16px 0 0 0"
      borderRadius="16px"
      show={props.show}
      closeModal={props.onNegativeBtnClick} >
      <div className="createRoom">
        <h1 className="createRoom__header">Create a Room!</h1>

        <div className="createRoom__error">
          <p>{error}</p>
        </div>

        <div className="createRoom__input">
          <input
            type="text"
            value={roomName}
            onChange={(e) => { setError(''); setRoomName(e.target.value) }}
            placeholder="Enter a unique room name" />
        </div>
        <div className="createRoom__input">
          <input
            type="password"
            value={password}
            onChange={(e) => { setError(''); setPassword(e.target.value) }}
            placeholder="Enter password" />
        </div>

        <div className="createRoom__btnDiv">
          <Button className="createRoom__negBtn" onClick={props.onNegativeBtnClick}>{props.negativeBtn}</Button>
          <Button className="createRoom__posBtn" onClick={createNewChat}>{props.positiveBtn}</Button>
        </div>
      </div>
    </Modal >
  )
}

export default CreateRoom
