import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage, uploadBytesResumable, ref } from 'firebase/storage';
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    // .env
};


// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth();
// const db = getFirestore();
export const storage = getStorage();
export const db = getFirestore(app);

export { app, auth };