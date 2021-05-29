import { Avatar, Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import './SidebarChat.css';
import db from '../../firebase';
import { withRouter } from 'react-router-dom';
import firebase from 'firebase';
import { useStateValue } from '../providers/StateProvider';
import CryptoJS from 'crypto-js';
import { actionTypes } from '../providers/reducer';
import AlertMessage from '../UI/AlertMessage/AlertMessage';
import Modal from '../UI/Modal/Modal';

const SidebarChat = (props) => {
  const [messages, setMessages] = useState([]);
  const [{ user: { email, displayName } }, dispatch] = useStateValue();
  const [alertConfig, setAlertConfig] = useState({ message: '', isOpen: false });
  const [isPasswordPromptOpen, setPasswordPromptOpen] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [enteredPassword, setEnterredPassword] = useState('');

  useEffect(() => {
    let unsubscribe;
    if (props.id) {
      unsubscribe = db.collection('rooms').doc(props.id).collection('messages')
        .orderBy('timestamp', 'desc').onSnapshot(snapshot => {
          setMessages(snapshot.docs.map(doc => doc.data()))
        })
    }
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    }
  }, [props.id]);

  const joinRoomChat = () => {
    if (enteredPassword) {
      let encryPassword = CryptoJS.HmacSHA1(enteredPassword, props.createdBy).toString();
      if (props.pwd === encryPassword) {
        db.collection("rooms").doc(props.id).update({
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          users: firebase.firestore.FieldValue.arrayUnion({ name: displayName, email: email })
        })
          .then(() => {
            db.collection("rooms").doc(props.id)
              .collection("messages").add({
                message: displayName + " joined the room",
                senderName: displayName,
                senderEmail: email,
                type: "info",
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
              });
          })
          .then(() => {
            setPasswordError('');
            setEnterredPassword('');
            setPasswordPromptOpen(false);
            setAlertConfig({ message: "You joined " + props.roomName, isOpen: true })
            redirectToChat();
          })
      } else {
        setPasswordError("Incorrect Password!");
      }
    } else {
      setPasswordError("Please enter the password");
    }
  }

  const redirectToChat = () => {
    dispatch({ type: actionTypes.SET_INIT_MESSAGE_LOADING, value: true });
    props.history.push(`/rooms/${props.id}`);
  }

  return props.infoMessage ?
    <div className="sidebarChat__infoMessage">
      <p>{props.infoMessage}</p>
    </div>
    :
    <div>
      {alertConfig.isOpen && <AlertMessage
        message={alertConfig.message}
        show={true}
        positiveBtn="OK"
        onPositiveBtnClick={() => { setAlertConfig({ isOpen: false }) }}
      />}

      {isPasswordPromptOpen && <Modal
        show={true}
        closeModal={() => {
          setEnterredPassword('');
          setPasswordError('');
          setPasswordPromptOpen(false);
        }}>
        <div className="sidebarChat__passwordContainer">
          <div>
            <h2>{`Enter password of ${props.roomName}`}</h2>
            <p>You are not part of this room. Enter password once and be a part of the room.</p>
          </div>
          <div className="sidebarChat__passwordError">
            {passwordError && <p>{"Error: " + passwordError}</p>}
          </div>
          <div className="sidebarChat__password">
            <input type="password"
              value={enteredPassword}
              onChange={(e) => {
                setPasswordError("");
                setEnterredPassword(e.target.value)
              }} />
          </div>
          <div className="sidebarChat__passwordContainerBtnDiv">
            <Button
              className="sidebarChat__passwordContainerBtn"
              onClick={joinRoomChat}>SUBMIT</Button>
          </div>
        </div>
      </Modal>
      }

      <div onClick={props.isParticipant ? redirectToChat : () => setPasswordPromptOpen(true)} className="sidebarChat">
        <Avatar src={`https://avatars.dicebear.com/api/human/${props.id}.svg`} />
        <div className="sidebarChat__info">
          <div className="sidebarChat__infoRowOne">
            <span className="sidebarChat__infoRowOneName">{props.roomName}</span>
            <span className="sidebarChat__infoRowOneDate">
              {props.isParticipant && new Date(messages[0]?.timestamp?.toDate()).toLocaleDateString()}
            </span>
          </div>
          {props.isParticipant && <span className="sidebarChat__infoRowTwoMessage">{messages[0]?.senderName.split(" ")[0]} : {messages[0]?.message}</span>}
        </div>
      </div>
    </div >;
}

export default withRouter(SidebarChat);
