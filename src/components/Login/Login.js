import { Button } from '@material-ui/core';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { auth, provider } from '../../firebase';
import { actionTypes } from '../providers/reducer';
import { useStateValue } from '../providers/StateProvider';
// import AlertMessage from '../UI/AlertMessage/AlertMessage';
// import ConfirmMessage from '../UI/ConfirmMessage/ConfirmMessage';
import './Login.css';

const Login = () => {

  // eslint-disable-next-line
  const [{ user }, dispatch] = useStateValue();

  const signIn = () => {
    auth.signInWithPopup(provider)
      .then(result => {
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user,
        });
      }).catch(error => {
      })
  }

  return (
    <div className="login">
      {user && <Redirect to="/" />}
      {/* <AlertMessage
        message="You are logged in"
        show={true}
        positiveBtn="OK"
        onPositiveBtnClick={() => { }} /> */}

      {/* <ConfirmMessage
        message="Do you want to leave the room?"
        show={true}
        negativeBtn="NO"
        onNegativeBtnClick={() => { }}
        positiveBtn="YES"
        onPositiveBtnClick={() => { }} /> */}

      <div className="login__container">
        <img
          src="https://cdn.icon-icons.com/icons2/2201/PNG/512/whatsapp_logo_icon_134017.png"
          alt="" />

        <div className="login__tes">
          <h1>Sign in to WhatsApp</h1>
        </div>

        <Button onClick={signIn}>
          Sign In with Google.
      </Button>

      </div>
    </div>
  )
}

export default Login
