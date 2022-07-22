import { initializeApp } from 'firebase/app';
import config from '../config/config';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';


const Firebase = initializeApp(config.firebase);

export const auth = getAuth();

export const provider = new GoogleAuthProvider();
export const profile = provider.addScope('profile');
export const email = provider.addScope('email');

export default Firebase;
