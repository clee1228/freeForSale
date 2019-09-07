import React, { Component, Fragment } from 'react';
import {Link} from 'react-router-dom';
import MyButton from '../util/MyButton';

// Material-UI 
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

// Icons
import AddIcon from '@material-ui/icons/Add';
import HomeIcon from '@material-ui/icons/Home';
import Notifications from '@material-ui/icons/Notifications';

// Redux
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


export class Navbar extends Component {
    render() {
        const { authenticated } = this.props;
        return (
            //position fixed at top
            <AppBar position="fixed">
                <Toolbar className="nav-container">
                    {authenticated ? (
                        <Fragment>
                            <MyButton tip="Create a post!">
                                <AddIcon color="primary"/>
                            </MyButton>

                            <Link to="/">
                                <MyButton tip="Home">
                                    <HomeIcon color="primary"/>
                                </MyButton>
                            </Link>

                            <MyButton tip="Notifications">
                                <Notifications color="primary"/>
                            </MyButton>
                        </Fragment>

                    ) : (
                        <Fragment>
                            <Button color="inherit" component={Link} to="/login">Login</Button>
                            <Button color="inherit" component={Link} to="/">Home</Button>
                            <Button color="inherit" component={Link} to="/signup">Signup</Button>
                        </Fragment>
                    )}
                </Toolbar>
            </AppBar>
        );
    }
}

Navbar.propTypes = {
    authenticated: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    authenticated: state.user.authenticated
});

export default connect(mapStateToProps)(Navbar);
