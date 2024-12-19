import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import {
    PATH_LOGIN,
    PATH_REGISTER,
    PATH_INVOICE,
    PATH_HOME,
} from './constants/RouteConstants';
import Product from '../product/product';
import Invoice from '../invoice/invoice';

import LoginPage from '../Auth/LoginPage';
import RegisterPage from '../Auth/RegisterPage';
import PrivateRoute from './privateRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={PATH_LOGIN} element={<LoginPage />} />
      <Route path={PATH_REGISTER} element={<RegisterPage />} />

      <Route path={PATH_HOME} element={<PrivateRoute element={<Product />} />} />
      <Route path={PATH_INVOICE} element={<PrivateRoute element={<Invoice />} />} />
    </Routes>
  );
};

export default AppRoutes;
