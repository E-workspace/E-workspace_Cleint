// src/components/ProtectedRoute.js

import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const { token } = useAuth();

    return (
        <Route
            {...rest}
            render={(props) =>
                token ? <Component {...props} /> : <Redirect to="/register" />
            }
        />
    );
};

export default ProtectedRoute;
