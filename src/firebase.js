// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from 'firebase';
const firebaseConfig = {
  apiKey: "AIzaSyB_qpixue2h__G8U6y3W05IWqRM9HRCQ8Q",
  authDomain: "chat-clone-add4f.firebaseapp.com",
  projectId: "chat-clone-add4f",
  storageBucket: "chat-clone-add4f.appspot.com",
  messagingSenderId: "267032364358",
  appId: "1:267032364358:web:d2f1712d5dffb2fbb41147",
  measurementId: "G-S7BGQMQ4QS"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
export { auth, provider };
export default db;
