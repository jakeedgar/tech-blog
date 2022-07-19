import React from 'react';
import * as dotenv from 'dotenv'
import { BrowserRouter, Route, Routes, } from 'react-router-dom';
import routes from './config/routes';

export interface IApplicationProps {}
dotenv.config();

const App: React.FunctionComponent<IApplicationProps> = props => {
  return ( 
    <BrowserRouter>
      <Routes>
        {routes.map((route, index) => {
          return (
            <Route key={index} path={route.path} element={<route.component />} />
          );
        })}
      </Routes>;
    </BrowserRouter>
  )
}

export default App;