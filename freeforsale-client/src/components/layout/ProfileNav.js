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

class ProfileNav extends Component{
    state = {
        anchorEl: null
    };

    handleOpen = (event) => {
        this.setState({ anchorEl: event.target });
    }; 

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render(){
        const anchorEl = this.state.anchorEl;
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

                    <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                    <MenuItem onClick={this.handleClose}>Settings</MenuItem>
                    <MenuItem onClick={this.handleClose}>Log Out</MenuItem>
                </Menu>
            </Fragment>
        )
    }
}

export default ProfileNav