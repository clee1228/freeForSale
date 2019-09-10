import React, { Component, Fragment } from 'react';
import {Link} from 'react-router-dom';

// Components 
import MyButton from '../../util/MyButton';
import MakePost from '../post/MakePost';
import Notifications from './Notifications';

// Material-UI 
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

// Icons
import HomeIcon from '@material-ui/icons/Home';


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
                           <MakePost/>

                            <Link to="/">
                                <MyButton tip="Home">
                                    <HomeIcon/>
                                </MyButton>
                            </Link>

                            <Notifications/>
                            
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
