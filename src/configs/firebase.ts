import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyD9lzvoLhtw4XAlazTcc1cJdAieL03pSqQ",
  authDomain: "farmx-1381c.firebaseapp.com",
  databaseURL: "https://farmx-1381c-default-rtdb.firebaseio.com",
  projectId: "farmx-1381c",
  storageBucket: "farmx-1381c.appspot.com",
  messagingSenderId: "891902881500",
  appId: "1:891902881500:web:8baf9932065f2632fd0e19"
};
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);
export const auth=getAuth(app);
export const storage = getStorage(app);
