import React, { useEffect, useRef, useState } from 'react';
import './Sidebar.css';
import { Avatar, IconButton } from '@material-ui/core';
import ChatIcon from '@material-ui/icons/Chat';
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import SidebarChat from '../SidebarChat/SidebarChat';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';

import db from '../../firebase';
import { useStateValue } from '../providers/StateProvider';
import { actionTypes } from '../providers/reducer';
import { auth } from '../../firebase';
import CreateRoom from '../UI/CreateRoom/CreateRoom';
import AlertMessage from '../UI/AlertMessage/AlertMessage';
import ConfirmMessage from '../UI/ConfirmMessage/ConfirmMessage';

const Sidebar = (props) => {
  const [{ user: { email, displayName, photoURL } }, dispatch] = useStateValue();
  const [rooms, setRooms] = useState([]);
  const [input, setInput] = useState("");
  const [isOpenCreateRoom, setOpenCreateRoom] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: ''
  });
  const [isOpenLogOut, setOpenLogOut] = useState(false);

  let inputReference = useRef(null);
  useEffect(() => {
    let unsubscribeFuntion = db.collection('rooms');
    if (input) {
      unsubscribeFuntion = unsubscribeFuntion.where("name", "==", input);
    }
    unsubscribeFuntion = unsubscribeFuntion.orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setRooms(snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })));
    })
    return () => {
      unsubscribeFuntion();
    }
  }, [input]);

  const logOut = () => {
    setOpenLogOut(false);
    auth.signOut();
    dispatch({ type: actionTypes.SET_USER, value: null })
  }

  return (
    <div className="sidebar">
      {isOpenCreateRoom &&
        <CreateRoom
          displayName={displayName}
          email={email}
          show={true}
          negativeBtn="CANCEL"
          onNegativeBtnClick={() => { setOpenCreateRoom(false) }}
          positiveBtn="CREATE"
          onPositiveBtnClick={(name) => {
            setAlertConfig({
              message: name + " room has been created successfully!",
              isOpen: true
            });
            setOpenCreateRoom(false)
          }} />
      }
      {alertConfig.isOpen &&
        <AlertMessage
          message={alertConfig.message}
          show={true}
          positiveBtn="OK"
          onPositiveBtnClick={() => { setAlertConfig({ isOpen: false }) }} />
      }

      {isOpenLogOut && <ConfirmMessage
        message="Do you want to log out?"
        show={true}
        negativeBtn="NO"
        onNegativeBtnClick={() => setOpenLogOut(false)}
        positiveBtn="YES"
        onPositiveBtnClick={logOut} />}

      <div className="sidebar__header">
        <div className="sidebar__headerLeft">
          <Avatar src={photoURL} />
          <span className="sidebar__headerLeftName">{displayName}</span>
        </div>
        <div className="sidebar__headerRight">
          <IconButton onClick={() => setOpenCreateRoom(true)}>
            <ChatIcon />
          </IconButton>
          <IconButton onClick={() => setOpenLogOut(true)}>
            <PowerSettingsNewIcon />
          </IconButton>
        </div>
      </div>

      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlined />
          <form onSubmit={(event) => { event.preventDefault(); setInput(inputReference?.current.value.trim()) }}>
            <input
              ref={inputReference}
              onChange={(event) => { event.target.value.trim() === "" && setInput("") }}
              placeholder="Search or start new chat"
              type="text" />
            <button style={{ display: 'none' }}></button>
          </form>
        </div>
      </div>

      <div className="sidebar__chat">
        {rooms.length !== 0 ? rooms.map(room => {
          return <SidebarChat
            key={room.id}
            id={room.id}
            roomName={room.data.name}
            pwd={room.data.password}
            createdBy={room.data.createdBy.email}
            isParticipant={room.data.users.some(user => user.email === email)} />
        }) : <SidebarChat infoMessage="No Rooms Found" />}
      </div>
    </div>
  )
}

export default Sidebar;
