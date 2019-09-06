import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';

//...rest spreads rest of the props, anything else will be added after
const AuthRoute = ({ component: Component, authenticated, ...rest }) => (
    <Route
    {...rest}
    render={(props) => 
        authenticated === true ? <Redirect to='/'/> : <Component {...props} />}
    />
);


export default AuthRoute;
