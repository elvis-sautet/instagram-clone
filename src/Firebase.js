import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBWDtytgdQGCGjA3Uw7zdJuUL9gh6QxRjE",
  authDomain: "instagram-clone-f9fbb.firebaseapp.com",
  projectId: "instagram-clone-f9fbb",
  storageBucket: "instagram-clone-f9fbb.appspot.com",
  messagingSenderId: "208636402936",
  appId: "1:208636402936:web:13e6523712d5aa87466f0d",
  measurementId: "G-JF7TR1078Z",
});

const db = firebaseApp.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

export { db, storage, auth };
