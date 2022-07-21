import axios from 'axios';
import { provider, auth } from '../../config/firebase';
import { signInWithPopup } from 'firebase/auth';
import config from '../../config/config';
import logging from '../../config/logging';
import IUser from '../../interfaces/user';

const NAMESPACE = 'Auth';

export const Authenticate = async (uid: string, name: string, fire_token: string, callback: (error: string | null, user: IUser | null) => void) => {
  try {
    let response = await axios({
      method: 'POST',
      url: `${config.server.url}/users/login`,
      data: {
        uid,
        name
      },
      headers: { Authorization: `Bearer ${fire_token}` }
    });

    if (response.status === 200 || response.status === 201 || response.status === 304) {
      logging.info('Successfully authenticated.', NAMESPACE);
      callback(null, response.data.user);
    } else {
      logging.warn('Unable to authenticate.', NAMESPACE);
      callback('Unable to authenticate.', null);
    }
  } catch (error) {
    logging.error(error, NAMESPACE);
    callback('Unable to authenticate.', null);
  }
};

export const Validate = async (fire_token: string, callback: (error: string | null, user: IUser | null) => void) => {
  try {
    let response = await axios({
      method: 'GET',
      url: `${config.server.url}/users/validate`,
      headers: { Authorization: `Bearer ${fire_token}` }
    });

    if (response.status === 200 || response.status === 304) {
      logging.info('Successfully validated.', NAMESPACE);
      callback(null, response.data.user);
    } else {
      logging.warn(response, NAMESPACE);
      callback('Unable to validate.', null);
    }
  } catch (error) {
    logging.error(error, NAMESPACE);
    callback('Unable to validate.', null);
  }
};

export const SignInWithGoogle = signInWithPopup(auth, provider).then(function (result: any) {
  const token: any = result.credential.accessToken;
  const user: any = result.user.catch(function (error: any) {
    return error.Error;
  });
});
