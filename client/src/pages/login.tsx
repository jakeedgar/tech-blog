import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../contexts/user';
import IPageProps from '../interfaces/page';
import { signInWithPopup } from 'firebase/auth';
import logging from '../config/logging';
import CenterPiece from '../components/CenterPiece';
import { Button, Card, CardBody, CardHeader } from 'reactstrap';
import ErrorText from '../components/ErrorText';
import LoadingComponent from '../components/LoadingComponent';
import { Provider, auth } from '../config/firebase';
import { Authenticate } from '../modules/Auth';

const LoginPage: React.FC<IPageProps> = (props) => {
	const [authenticating, setAuthenticating] = useState<boolean>(false);
	const [error, setError] = useState<string>('');

	const userContext = useContext(UserContext);
	const navigate = useNavigate();
	const isLogin = window.location.pathname.includes('login');

	const signInWithGoogle = (provider: any) => {
		if (error !== '') {
			setError('');
		}
		setAuthenticating(true);

		signInWithPopup(auth, provider)
			.then(async (response) => {
				logging.info(response);

				let user = response.user;

				if (user) {
					let uid = user.uid;
					let name = user.displayName;

					if (name) {
						try {
							let fire_token = await user.getIdToken();

							Authenticate(uid, name, fire_token, (error, _user) => {
								if (error) {
									setError(error);
									setAuthenticating(false);
									navigate('/login', { replace: true });
								} else if (_user) {
									userContext.userDispatch({ type: 'login', payload: { user: _user, fire_token } });
									navigate('/', { replace: true });
								}
							});
						} catch {
							setError('Invalid Token');
							logging.error(error);
							setAuthenticating(false);
						}
					} else {
						setError("the identify provider does't have a name.");
						setAuthenticating(false);
					}
				} else {
					setError('The identity of the user ios missing information. Please try another account.');
					setAuthenticating(false);
				}
			})
			.catch((error) => {
				setError(error.message);
				logging.error(error);
				setAuthenticating(false);
			});
	};

	return (
		<CenterPiece>
			<Card>
				<CardHeader>{isLogin ? 'Login' : 'Sign Up'}</CardHeader>
				<CardBody>
					<ErrorText error={error} />
					<Button
						block
						disabled={authenticating}
						onClick={() => signInWithGoogle(Provider.google)}
						style={{
							backgroundColor: '#510000',
							borderColor: '#510000'
						}}
					>
						<i className="fab fa-google mr-2"></i> Sign {isLogin ? 'in' : 'up'} with Google
					</Button>
					{authenticating && <LoadingComponent card={false} children={undefined} />}
				</CardBody>
			</Card>
		</CenterPiece>
	);
};

export default LoginPage;
