import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

// Redux
import { Provider } from 'react-redux';
import store from './redux/store';
import { SET_AUTHENTICATED } from './redux/types';
import { logout, getUserData } from  './redux/actions/userActions';

// MUI
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

// Components 
import Navbar from './components/layout/Navbar';
import AuthRoute from './util/AuthRoute';
import themeFile from './util/theme'; //same lvl

// Pages
import home from './pages/home';
import login from './pages/login';
import signup from './pages/signup';
import user from './pages/user';

const theme = createMuiTheme(themeFile);

axios.defaults.baseURL = 'https://us-central1-freeforsale-227d7.cloudfunctions.net/api';

const token = localStorage.FBIdToken;
if(token){
  const decodedToken = jwtDecode(token);
  console.log(decodedToken);
  //checking if token expired
  if(decodedToken.exp * 1000 < Date.now()){
    //logs us out and deletes token
    store.dispatch(logout());
    window.location.href = '/login'
  } else {
    //sets authenticated to true
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData());
  }
}

class App extends Component {
  render(){
    return (
      <MuiThemeProvider theme={theme}>
      {/* Wrap everything in store provider */}
      <Provider store={store}>
        <Router>
            <Navbar/>
            <div className="app-container">
              <Switch>
                <Route exact path="/" component={home}/>
                <AuthRoute 
                  exact path="/login" 
                  component={login} />
                <AuthRoute 
                  exact path="/signup" 
                  component={signup} />
                <Route 
                  exact path="/user/:username"  
                  component={user} />
                <Route 
                  exact path="/user/:username/post/:postId"  
                  component={user} />
              </Switch>
            </div> 
        </Router>
      </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
