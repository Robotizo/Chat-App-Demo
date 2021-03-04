import logo from './logo.svg';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import React, { useRef, useState } from "react";

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';


firebase.initializeApp({
  apiKey: "AIzaSyCZjiXt-EbjqUaCcuvyMsQBnVE6UdazWsI",
  authDomain: "grouper-chatter.firebaseapp.com",
  databaseURL: "https://grouper-chatter.firebaseio.com",
  projectId: "grouper-chatter",
  storageBucket: "grouper-chatter.appspot.com",
  messagingSenderId: "284235712101",
  appId: "1:284235712101:web:2678058d039a98879c288c",
  measurementId: "G-N5J9PR1LCK"
});

const auth = firebase.auth();
const firestore = firebase.firestore();




function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>Grouper Chatter</h1>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}



function ChatRoom(){

  const dummy = useRef();

  const messagesRef = firestore.collection('messages');

  const query = messagesRef.orderBy('createdAt', 'desc').limit(20);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');


  const sendMessage = async(e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;
    
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');

    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }




  return(
    <>
      <div style={{marginBottom: "100px"}} >
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />).reverse()}
        <div ref={dummy} ></div>
      </div>
      <form onSubmit={sendMessage}>

        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />

        <button type="submit" disabled={!formValue}>Send</button>

      </form>
    </>
  )

}


function ChatMessage(props){

  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      < img src={photoURL} />
      <p>{text}</p>
    </div>
  )
}



function SignIn(){

  const signInWithGoogle = () =>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }


  return(
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}


function SignOut(){
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}






export default App;
