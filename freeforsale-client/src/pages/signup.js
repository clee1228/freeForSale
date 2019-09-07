import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import AppIcon from '../images/icon.png';
import { Link } from 'react-router-dom';

// MUI Stuff
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

// Redux 
import { connect } from 'react-redux';
import { signupUser } from '../redux/actions/userActions';

//access global theme from App.js
const styles = (theme) => ({ ...theme.spreadThis })

export class signup extends Component {
    constructor(){
        super();
        this.state = {
            email: '',
            password: '',
            confirmPw: '',
            username: '',
            errors: {}
        };
    }

     //if errors during signup, UI will display them here
     componentWillReceiveProps(nextProps){
        if(nextProps.UI.errors){
            this.setState({ errors: nextProps.UI.errors});
        }
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({
            loading: true
        });
        const newUserData = {
            email: this.state.email,
            password: this.state.password,
            confirmPw: this.state.confirmPw,
            username: this.state.username
        };
        this.props.signupUser(newUserData, this.props.history);
    };


    handleChange = (event) =>{ 
        this.setState({
            [event.target.name]: event.target.value
        })
     };

    render() {
        const { classes, UI: { loading } } = this.props;
        const { errors } = this.state;
        return (
            <Grid container className={classes.form}>
                <Grid item sm/>
                <Grid item sm>
                    <img src={AppIcon} alt="monkey" className={classes.image}/>
                    <Typography variant="h2" className={classes.pageTitle}>
                        Signup
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
                        <TextField 
                            id="confirmPw" 
                            name="confirmPw" 
                            type="password" 
                            label="Confirm Password" 
                            className={classes.textField}
                            helperText={errors.confirmPw}
                            error={errors.confirmPw ? true : false}
                            value={this.state.confirmPw} 
                            onChange={this.handleChange} 
                            fullWidth/>
                        <TextField 
                            id="username" 
                            name="username" 
                            type="text" 
                            label="Username" 
                            className={classes.textField}
                            helperText={errors.username}
                            error={errors.username ? true : false}
                            value={this.state.username} 
                            onChange={this.handleChange} 
                            fullWidth/>    
                        {errors.general && (
                            <Typography variant="body2" className={classes.customError}>
                                {errors.general}
                            </Typography>
                        )}
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary" 
                            className={classes.button}
                            disabled={loading}>
                                 Signup
                                 {loading && (
                                     <CircularProgress size={30} className={classes.progress}/>
                                 )}
                        </Button>
                        {/*Using react-router-dom link*/}
                        <br/>
                        <small> 
                            Already have an account? Login <Link to="/login"> here </Link> .
                        </small>
                    </form>
                    
                </Grid>
                <Grid item sm/>
            </Grid>
        )
    }
}

signup.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
    signupUser: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI
});
 
export default connect(mapStateToProps, { signupUser } )(withStyles(styles)(signup));
