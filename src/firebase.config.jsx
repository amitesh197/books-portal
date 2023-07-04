// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAcJhznBRO1EBGHi3oftfqLtoa05tgdm_M",
  authDomain: "sales-query-e70c4.firebaseapp.com",
  projectId: "sales-query-e70c4",
  storageBucket: "sales-query-e70c4.appspot.com",
  messagingSenderId: "1680362713",
  appId: "1:1680362713:web:295d08fdf5181b1f0102c8",
  measurementId: "G-PF9DPGVSVG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app)
export const storage = getStorage(app);

