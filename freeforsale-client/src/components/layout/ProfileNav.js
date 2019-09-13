import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// MUI
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';

// Icons
import AccountCircle from '@material-ui/icons/AccountCircle';


// Redux
import { connect } from 'react-redux';
import { logout } from '../../redux/actions/userActions';

class ProfileNav extends Component{
    state = {
        anchorEl: null
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    handleLogout = () => { this.props.logout(); }
    

    render(){
        const anchorEl = this.state.anchorEl;
        const { classes,
                user: { 
                    creds: { username, createdAt, imageUrl, bio, website, location},
                    authenticated
                }} = this.props;


        return (
            <Fragment>
                <Tooltip
                    placement="top"
                    title="Profile">

                    <IconButton 
                        aria-owns={anchorEl ? 'simple-menu' : undefined}
                        aria-controls="profile-menu"
                        aria-haspopup="true"
                        onClick={this.handleOpen}>
                            <AccountCircle/>
                    </IconButton>
                </Tooltip>
                <Menu
                    id="profile-menu"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}

                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}>

                    <MenuItem
                    component={Link}
                    to={`/user/${username}`}
                    >
                        Profile
                    </MenuItem>

                    <MenuItem onClick={this.handleClose}>Settings</MenuItem>
                    <MenuItem onClick={this.handleLogout}>Log Out</MenuItem>
                </Menu>
            </Fragment>
        )
    }
}


const mapStateToProps = (state) => ({
    user: state.user
});

ProfileNav.propTypes = {
    user: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired
};

export default connect(mapStateToProps, {logout})(ProfileNav);