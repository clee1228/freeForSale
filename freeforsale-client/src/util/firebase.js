import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyBXS4rqKQYhY0HlBVT_YEgp7i18DfOaIT8",
    authDomain: "freeforsale-227d7.firebaseapp.com",
    databaseURL: "https://freeforsale-227d7.firebaseio.com",
    projectId: "freeforsale-227d7",
    storageBucket: "freeforsale-227d7.appspot.com",
    messagingSenderId: "506630593887",
    appId: "1:506630593887:web:84597ec0a867dde9"
};
  firebase.initializeApp(config);

export const auth = firebase.auth();
export const storage = firebase.storage();
export const firestore = firebase.firestore();
export default firebase;