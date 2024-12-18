import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import {
    PATH_LOGIN,
    PATH_REGISTER,
    PATH_PRODUCT,
    PATH_INVOICE,
} from './constants/RouteConstants';
import Product from '../product/product';
import Invoice from '../invoice/invoice';

import LoginPage from '../Auth/LoginPage';
import RegisterPage from '../Auth/RegisterPage';
// import PrivateRoute from './PrivateRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={PATH_LOGIN} element={<LoginPage />} />
      <Route path={PATH_REGISTER} element={<RegisterPage />} />

      <Route path={PATH_PRODUCT} element={<Product />} />
      <Route path={PATH_INVOICE} element={<Invoice />} />

      {/* <Route path={PATH_PRODUCT} element={<PrivateRoute element={<Product />} />} />
      <Route path={PATH_INVOICE} element={<PrivateRoute element={<Invoice />} />} /> */}
      {/* <Route path="/*" element={<LoginPage />}/> */}
    </Routes>
  );
};

export default AppRoutes;
