import React from 'react';
import { Redirect, Route, withRouter } from 'react-router-dom';
import Chat from '../Chat/Chat';
import { useStateValue } from '../providers/StateProvider';
import Sidebar from '../Sidebar/Sidebar';
import ChatPlaceHolder from '../UI/ChatPlaceholder/ChatPlaceHolder';

const Layout = (props) => {
  const [{ user }] = useStateValue();
  return (
    !user ? <Redirect to="/login" /> : <div className="app__body">
      <Sidebar />
      {props.location?.pathname.indexOf("rooms") === -1 && <ChatPlaceHolder />}
      <Route exact path="/rooms/:roomId" component={Chat} />
    </div>
  );
}

export default withRouter(Layout);
