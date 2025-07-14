import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyB_LGZ2N70eNyu74_TxMVBZ8vUQeRAfNyU",
  authDomain: "betwise-99255.firebaseapp.com",
  projectId: "betwise-99255",
  storageBucket: "betwise-99255.firebasestorage.app",
  messagingSenderId: "1027486627314",
  appId: "1:1027486627314:web:7613a15dec68869622676b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth and firestore with appropriate types
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const provider: GoogleAuthProvider = new GoogleAuthProvider();
