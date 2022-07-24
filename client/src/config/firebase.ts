import { initializeApp } from 'firebase/app';
import config from '../config/config';
import { GoogleAuthProvider, getAuth, FacebookAuthProvider } from 'firebase/auth';

const Firebase = initializeApp(config.firebase);

export const auth = getAuth();

export const Provider = {
	google: new GoogleAuthProvider(),
	facebook: new FacebookAuthProvider()
};

export default Firebase;
