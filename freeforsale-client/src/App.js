import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

//Components
import Navbar from './components/Navbar';

//Pages
import home from './pages/home';
import login from './pages/login';
import signup from './pages/signup';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#6573c3',
      main: '#3f51b5',
      dark: '#2c387e',
      contrastText: '#fff'
    },
    secondary: {
      light: '#2a3eb1',
      main: '#3d5afe',
      dark: '#637bfe',
      contrastText: '#fff'
    }
  },
  typography: {
    useNextVariants: true
  }
});

class App extends Component {
  render(){

    return (
      <MuiThemeProvider theme={theme}>
        <div className="App">
        <Router>
            <Navbar/>
          <div className="container">
            <Switch>
              <Route exact path="/" component={home}/>
              <Route exact path="/login" component={login}/>
              <Route exact path="/signup" component={signup}/>
            </Switch>
          </div> 
        </Router>
      </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
