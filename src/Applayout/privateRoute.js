import React from 'react';
import { Route, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/login-util';

// Private route component
const PrivateRoute = ({ component: Component, ...rest }) => {
    const { isAuthenticated } = useAuth();
      const navigate = useNavigate();

    return (
        <Route
            {...rest}
            render={(props) =>
                isAuthenticated ? (
                    <Component {...props} />
                ) : (
                    navigate('/login')
                )
            }
        />
    );
};

export default PrivateRoute;
