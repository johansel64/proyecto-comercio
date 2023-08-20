import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth"

const firebaseConfig  = {
  apiKey: "AIzaSyCPz-BsApUqlpKvA0AcsN9KJIPA3MI5xuk",
  authDomain: "inventariobastos-294b7.firebaseapp.com",
  projectId: "inventariobastos-294b7",
  storageBucket: "inventariobastos-294b7.appspot.com",
  messagingSenderId: "532030717711",
  appId: "1:532030717711:web:1167fe15af4c28fff7887a",
  measurementId: "G-N8NX8H3PLF"
  }; 
  
  // Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore();
export const storage = getStorage(app);