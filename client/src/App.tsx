import React, { useEffect, useReducer, useState } from 'react';
import * as dotenv from 'dotenv';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import routes from './config/routes';
import { initialUserState, UserContextProvider, userReducer } from './contexts/user';
import LoadingComponent from './components/LoadingComponent';
import AuthRoute from './components/AuthRoute';
import { Validate } from './modules/Auth';
import logging from './config/logging';

export interface IApplicationProps {}
dotenv.config();

const App: React.FunctionComponent<IApplicationProps> = (props) => {
	const [userState, userDispatch] = useReducer(userReducer, initialUserState);
	const [loading, setLoading] = useState<boolean>(true);

	/** use for debugging */
	const [authStage, setAuthStage] = useState<string>('Checking local storage ...');

	useEffect(() => {
		setTimeout(() => {
			CheckLocalStorageForCredentials();
		}, 1000);
	}, []);

	const CheckLocalStorageForCredentials = () => {
		setAuthStage('No credentials found.');

		const fire_token = localStorage.getItem('fire_token');

		if (fire_token === null) {
			userDispatch({ type: 'logout', payload: initialUserState });
			setAuthStage('No credentials found.');
			setTimeout(() => {
				setLoading(false);
			}, 1000);
		} else {
			// validate with the backend
			return Validate(fire_token, (error, user) => {
				if (error) {
					logging.error(error);
					setAuthStage('User not Found.');
					userDispatch({ type: 'logout', payload: initialUserState });
					setTimeout(() => {
						setLoading(false);
					}, 1000);
				} else if (user) {
					logging.info(user);
					setAuthStage('Welcome Back.');
					userDispatch({ type: 'login', payload: { user, fire_token } });
					setTimeout(() => {
						setLoading(false);
					}, 1000);
				}
			});
		}
	};

	const userContextValues = {
		userState,
		userDispatch
	};

	if (loading) {
		return <LoadingComponent>{authStage}</LoadingComponent>;
	}

	return (
		<UserContextProvider value={userContextValues}>
			<BrowserRouter>
				<Routes>
					{routes.map((route, index) => {
						if (route.auth) {
							<Route
								key={index}
								path={route.path}
								element={
									<AuthRoute>
										<route.component />
									</AuthRoute>
								}
							/>;
						}
						return <Route key={index} path={route.path} element={<route.component />} />;
					})}
				</Routes>
				;
			</BrowserRouter>
		</UserContextProvider>
	);
};

export default App;
