import React, { Component } from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';

// MUI stuff
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux';

// Icons

class Profile extends Component {
    render() {
        //nested destructuring
        const { 
            classes,
            user: { 
            credentials: { username, createdAt, imageUrl, bio, website, location},
            loading 
             }
        } = this.props;
        return <div/>; 
    }
}

Profile.propTypes = {
    user: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps)(withStyles(styles)(Profile));
