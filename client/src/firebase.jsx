import { initializeApp } from 'firebase/app'
import { GoogleAuthProvider, getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBdUj74Y-aJidAJME5UnCeHybhAD5dlDoI",
    authDomain: "zumgames-dd6c0.firebaseapp.com",
    projectId: "zumgames-dd6c0",
    storageBucket: "zumgames-dd6c0.appspot.com",
    messagingSenderId: "79575480135",
    appId: "1:79575480135:web:aea3abef3bc937f3ce3e62",
    measurementId: "G-HZP9R1Y85K"
};

export const firebaseApp = initializeApp(firebaseConfig)
export const provider = new GoogleAuthProvider()
export const auth = getAuth()
export const db = getFirestore()