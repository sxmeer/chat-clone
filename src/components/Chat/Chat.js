import React, { useEffect, useRef, useState } from 'react';
import './Chat.css';
import { Avatar, IconButton } from '@material-ui/core';
import { Redirect, useParams } from 'react-router';
import db from '../../firebase';
import { useStateValue } from '../providers/StateProvider';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import firebase from 'firebase';
import ChatMessage from './ChatMessage/ChatMessage';
import { actionTypes } from '../providers/reducer';
import SendIcon from '@material-ui/icons/Send';
import ConfirmMessage from '../UI/ConfirmMessage/ConfirmMessage';


const Chat = () => {
  const [input, setInput] = useState('');
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [{ user: { email, displayName }, initMessageLoading }, dispatch] = useStateValue();
  const messageEndRef = useRef(null);
  const [isLeaveChatOpen, setLeaveChatOpen] = useState(false);

  useEffect(() => {
    let roomListener;
    let messagesListener;
    if (roomId) {
      roomListener = db.collection('rooms').doc(roomId)
        .onSnapshot(snapshot => {
          setRoom(snapshot.data());
        });
      messagesListener = db.collection("rooms").doc(roomId)
        .collection("messages").orderBy("timestamp", 'asc')
        .onSnapshot(snapshot => {
          setMessages(snapshot.docs.map((doc) => ({ id: doc.id, message: doc.data() })));
        })
    }
    return () => {
      if (roomListener) {
        roomListener();
      }
      if (messagesListener) {
        messagesListener();
      }
    }
  }, [roomId]);

  useEffect(() => {
    if (messages?.length > 0 && initMessageLoading) {
      scrollToBottom();
      dispatch({ type: actionTypes.SET_INIT_MESSAGE_LOADING, value: false });
    }
  }, [messages]);


  const scrollToBottom = () => {
    messageEndRef.current.scrollIntoView({ behavior: "smooth" })
  }


  const sendMessage = (event) => {
    event.preventDefault();
    if (!input) {
      return;
    }
    db.collection("rooms").doc(roomId)
      .collection('messages').add({
        message: input,
        senderName: displayName,
        senderEmail: email,
        type: "message",
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        scrollToBottom();
        db.collection("rooms").doc(roomId)
          .update({
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          });
      })
    setInput('');
  }

  const leaveChat = () => {
    setLeaveChatOpen(false);
    db.collection("rooms").doc(roomId)
      .collection("messages").add({
        message: displayName + " left the room",
        senderName: displayName,
        senderEmail: email,
        type: "info",
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        return db.collection("rooms").doc(roomId)
          .update({
            users: firebase.firestore.FieldValue.arrayRemove({ email: email, name: displayName })
          })
      })
      .then(() => {
        return db.collection("rooms").doc(roomId).get()
      })
      .then((doc) => {
        let data = doc.data();
        if (data.users?.length === 0) {
          return db.collection("rooms").doc(roomId).delete();
        }
      })
  }

  return (
    <div className="chat">
      {(room?.users.every(user => user.email !== email)) && <Redirect to="/" />}

      {isLeaveChatOpen && <ConfirmMessage
        message="Do you want to leave the room?"
        show={true}
        negativeBtn="NO"
        onNegativeBtnClick={() => setLeaveChatOpen(false)}
        positiveBtn="YES"
        onPositiveBtnClick={leaveChat}
      />}

      <div className="chat__header">
        <div className="chat__headerAvatar">
          <Avatar src={`https://avatars.dicebear.com/api/human/${roomId}.svg`} />
        </div>
        <div className="chat__headerInfo">
          <h3>{room?.name}</h3>

          <p>
            {room?.users.map(user => user.name).join(", ")}
          </p>
        </div>

        <div className="chat__headerRight">
          <IconButton onClick={() => setLeaveChatOpen(true)}>
            <ExitToAppIcon />
          </IconButton>
        </div>
      </div>



      <div className="chat__body">
        {messages.map(({ id, message }) => (
          <ChatMessage email={email} message={message} key={id} />
        ))}
        <div ref={messageEndRef} />
      </div>

      <div className="chat__footer">
        <form>
          <input value={input} onChange={(event) => setInput(event.target.value)} type="text" placeholder="Type a message" />
          <button onClick={sendMessage} type="submit"><SendIcon /></button>
        </form>
      </div>
    </div >
  )
}

export default Chat
