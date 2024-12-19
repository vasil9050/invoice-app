import React from 'react';
import { Navigate } from 'react-router-dom';
import { PATH_LOGIN } from "./constants/RouteConstants";
import { isUserAuthenticated } from '../utils/auth-utils';

const PrivateRoute = ({ element }) => {
    return isUserAuthenticated() ? element : <Navigate to={PATH_LOGIN} />;
  };
  
  export default PrivateRoute;
