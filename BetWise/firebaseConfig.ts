import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB_LGZ2N70eNyu74_TxMVBZ8vUQeRAfNyU",
    authDomain: "betwise-99255.firebaseapp.com",
    projectId: "betwise-99255",
    storageBucket: "betwise-99255.firebasestorage.app",
    messagingSenderId: "1027486627314",
    appId: "1:1027486627314:web:7613a15dec68869622676b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider(); // Add provider export