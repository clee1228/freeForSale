import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import AppIcon from '../images/icon.png';
import {Link} from 'react-router-dom';
import '../styles/bootstrap-social.css';

//MUI Stuff
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

// Redux Stuff (Connect this component to app)
import { connect } from 'react-redux';
import { loginUser, googleLogin, googleSignup } from '../redux/actions/userActions';
  
//Firebase
import firebase, { auth } from '../util/firebase'

//access global theme from App.js
const styles = (theme) => ({ ...theme.spreadThis });


export class login extends Component {
    constructor(){
        super();
        this.state = {
            email: '',
            password: '',
            errors: {}
        }; 
    }

    //if errors during login, UI will display them here
    componentWillReceiveProps(nextProps){
        if(nextProps.UI.errors){
            this.setState({ errors: nextProps.UI.errors});
        }
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const userData = {
            email: this.state.email,
            password: this.state.password
        };
        //connect component to userAction
        this.props.loginUser(userData, this.props.history);
    };


    googleLogin = () =>{
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({
                'hd': 'berkeley.edu'
        });
        firebase
            .auth()
            .signInWithPopup(provider)
            .then((res) => {
                var user = res.user
                var verified = user.emailVerified
                var newUser = res.additionalUserInfo.isNewUser
                
                if (newUser && verified) {
                    const newGoogleUserData = {
                        email: user.email,
                        username: user.email.split("@")[0],
                        name: user.displayName,
                        photoURL: user.photoURL,
                        idToken: res.credential.idToken
                    };
                    this.props.googleSignup(newGoogleUserData, this.props.history)
                } else if (!newUser && verified) {
                    const googleToken = {
                        idToken: res.credential.idToken
                    }
                    this.props.googleLogin(googleToken, this.props.history)
                }
            })
            .catch((error) => {
                console.log(error)
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;

            });
        }
       
   
    handleChange = (event) =>{ 
        this.setState({
            [event.target.name]: event.target.value
        })};



    render() {
        const { classes, UI: { loading } } = this.props;
        const { errors } = this.state;
        return (
            <Grid container className={classes.form}>
                <Grid item sm/>
                <Grid item sm>
                    <img src={AppIcon} alt="monkey" className={classes.image}/>
                    <Typography variant="h2" className={classes.pageTitle}>
                        Login
                    </Typography>
                    <form noValidate onSubmit={this.handleSubmit}>
                        <TextField 
                            id="email" 
                            name="email" 
                            type="email" 
                            label="E-mail" 
                            className={classes.textField}
                            helperText={errors.email}
                            error={errors.email ? true : false}
                            value={this.state.email} 
                            onChange={this.handleChange} 
                            fullWidth/>
                        <TextField 
                            id="password" 
                            name="password" 
                            type="password" 
                            label="Password" 
                            className={classes.textField}
                            helperText={errors.password}
                            error={errors.password ? true : false}
                            value={this.state.password} 
                            onChange={this.handleChange} 
                            fullWidth/>
                        {errors.general && (
                            <Typography variant="body2" className={classes.customError}>
                                {errors.general}
                            </Typography>
                        )}
                        <div>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary" 
                            className={classes.button}
                            disabled={loading}>
                                 Login
                                 {loading && (
                                     <CircularProgress size={30} className={classes.progress}/>
                                 )}
                        </Button>
                        </div>

                        <div>
                            <a href="#" className="btn btn-block btn-social btn-google" onClick={this.googleLogin}>
                                <span className="fa fa-google"/> Sign in with Google
                            </a>
                        </div>

                        
                        {/*Using react-router-dom link*/}
                        <br/>
                        
                        <small> 
                            Don't have an account? Create one <Link to="/signup"> here </Link> .
                        </small>
                    </form>
                    
                </Grid>
                <Grid item sm/>
            </Grid>
        )
    }
}

login.propTypes = {
    classes: PropTypes.object.isRequired,
    loginUser: PropTypes.func.isRequired,
    googleLogin: PropTypes.func.isRequired,
    googleSignup: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired
};

//user & UI are brought in from global state and mapped
// into our Component props
const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI
});

// what actions we're going to use
const mapActionsToProps = {
    loginUser,
    googleLogin,
    googleSignup
}
export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(login));
