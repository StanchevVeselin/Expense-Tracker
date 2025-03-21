// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {initializeAuth, getAuth} from "firebase/auth/"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCo743s9wUy-UQaQweM_wZYMGVpZ5fulvY",
  authDomain: "tracker-f9d01.firebaseapp.com",
  projectId: "tracker-f9d01",
  storageBucket: "tracker-f9d01.firebasestorage.app",
  messagingSenderId: "977087150177",
  appId: "1:977087150177:web:29b7594ee8e4c454741220",
  measurementId: "G-ZWF167HK1Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// auth

export const auth = getAuth(app)

export const firestore = getFirestore(app)