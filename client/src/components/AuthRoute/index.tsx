import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../../contexts/user';
import logging from '../../config/logging';

export interface IAuthRouteProps {
	children: React.ReactNode;
}

const AuthRoute: React.FC<IAuthRouteProps> = (props) => {
	const { children } = props;

	const userContext = useContext(UserContext);

	if (userContext.userState.user._id === '') {
		logging.info('Unauthorized, redirecting ...');
		return <Navigate to="/login" replace={true} />;
	} else {
		return <>{children}</>;
	}
};

export default AuthRoute;
