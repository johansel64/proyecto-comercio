import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { getFirebaseConfig } from './FirebaseConfig';

const app = initializeApp(getFirebaseConfig());
const auth = getAuth(app);

export const signInUser = async (email, password) => {
  if (!email && !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const userStateListener = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const SignOutUser = async () => {
  await signOut(auth);
};
