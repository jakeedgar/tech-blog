import React, { useEffect, useReducer, useState } from 'react';
import * as dotenv from 'dotenv';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import routes from './config/routes';
import { initialUserState, UserContextProvider, userReducer } from './contexts/user';
import LoadingComponent from './components/LoadingComponent';

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
      setAuthStage('Credentials found, validating now');
      setTimeout(() => {
        setLoading(false);
      }, 1000);
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
            return <Route key={index} path={route.path} element={<route.component />} />;
          })}
        </Routes>
        ;
      </BrowserRouter>
    </UserContextProvider>
  );
};

export default App;
