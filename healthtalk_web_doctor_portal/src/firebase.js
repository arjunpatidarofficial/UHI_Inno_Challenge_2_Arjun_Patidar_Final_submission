 import firebase from "firebase/app"
 import "firebase/auth"
 import "firebase/firestore"
 import 'firebase/storage'
 import "firebase/functions"
 import "firebase/database"


const app =firebase.initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE__AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID

})

export const auth=app.auth()
export const googleAuth = firebase.auth()
export const db = firebase.firestore();
export const functions = firebase.functions()
export const storage = firebase.storage() 
export const rdb = firebase.database();
export default app
