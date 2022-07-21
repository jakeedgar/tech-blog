import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../../contexts/user';
import logging from '../../config/logging';

export interface IAuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute: React.FC<IAuthRouteProps> = (props) => {
  const { children } = props;

  const { user } = useContext(UserContext).userState;

  if (user._id === '') {
    logging.info('Unauthorized, redirecting ...');
    return <Navigate to="/login" />;
  } else {
    return <>{children}</>;
  }
};

export default AuthRoute;
