// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB00gu_KVI7yHXTXpVCs-pQkZG4LxgD6IU",
  authDomain: "shadowhire-6700a.firebaseapp.com",
  projectId: "shadowhire-6700a",
  storageBucket: "shadowhire-6700a.firebasestorage.app",
  messagingSenderId: "943520230924",
  appId: "1:943520230924:web:20527a761027e59e120829"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();