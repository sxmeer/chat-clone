import React from 'react';
import './ChatMessage.css';

const ChatMessage = (props) => {
  return (
    props.message.type === "info" ? <p className="chatMessage__info">{props.message.message}</p> : < p
      className={`chatMessage__message ${props.message.senderEmail === props.email && "chatMessage__receiver"}`
      }>
      {props.message.senderEmail !== props.email && <span className="chatMessage__name">{props.message.senderName}</span>}
      {props.message.message}
      <span className="chatMessage__timestamp">{new Date(props.message.timestamp?.toDate()).toString()}</span>
    </p >
  )
}

export default ChatMessage;
