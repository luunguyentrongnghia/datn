// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7RCRLPkhvqHlb4tXQsfUAT9rgbBNmk18",
  authDomain: "datn2-31553.firebaseapp.com",
  projectId: "datn2-31553",
  storageBucket: "datn2-31553.appspot.com",
  messagingSenderId: "653263527809",
  appId: "1:653263527809:web:ac7ff51df1619e40649280",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default auth;
