import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCj5Hf5H2u2THQT76fxjIJiVdyyhUTLifs",
  authDomain: "agrilink-e7d8e.firebaseapp.com",
  projectId: "agrilink-e7d8e",
  storageBucket: "agrilink-e7d8e.appspot.com",
  messagingSenderId: "417700350733",
  appId: "1:417700350733:web:06eedc5867e75d0c4e7e44",
};
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);
export const auth=getAuth(app);