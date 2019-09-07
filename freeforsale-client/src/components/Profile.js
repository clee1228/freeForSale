import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import dayjs from 'dayjs';

// MUI stuff
import Button from '@material-ui/core/Button';
import MUILink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

// Icons
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';

// Redux
import { connect } from 'react-redux';

const styles = (theme) => ({...theme.spreadThis});

class Profile extends Component {
    render() {
        const { 
            classes,
            user: { 
            creds: { username, createdAt, imageUrl, bio, website, location},
            loading, 
            authenticated
             }
        } = this.props;

        let profileMarkup = !loading ? (
            authenticated ? (
            <Paper className={classes.paper}>
                <div className={classes.profile}>
                    <div className="image-wrapper">
                        <img src={imageUrl} alt="profile" className="profile-image"/>
                    </div>
                    <hr/>
                    <div className="profile-details">
                        <MUILink 
                            component={Link} 
                            to={`/users/${username}`} 
                            color="primary"
                            variant="h5"> 
                            @{username}
                        </MUILink>
                    <hr/>
                    {bio && <Typography variant="body2">{bio}</Typography>}
                    <hr/>
                    {location && (
                        <Fragment>
                            <LocationOn color="primary"/> 
                            <span> {location} </span>
                            <hr/>
                        </Fragment>
                    )}
                    {website && (
                        <Fragment>
                            <LinkIcon color="primary"/>
                            <a href={website} target="_blank" rel="noopener noreferrer">
                                {'  '}
                                {website}
                            </a>
                            <hr/>
                        </Fragment>
                    )}
                    <CalendarToday color="primary"/> {' '}
                    <span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
                    </div>
                </div>
            </Paper>
        ) : (
            <Paper className={classes.paper}>
                <Typography variant="body2" align="center">
                    No profile found, please login again
                </Typography>
                <div className={classes.buttons}>
                    <Button 
                        variant="contained"
                        color="primary"
                        component={Link}
                        to="/login">
                            Login
                    </Button>
                    <Button 
                        variant="contained"
                        color="secondary"
                        component={Link}
                        to="/signup">
                            Sign Up
                    </Button>
                </div>
            </Paper>
        )
        ) : (<p> loading... </p>);




        return profileMarkup; 
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

Profile.propTypes = {
    user: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
};


export default connect(mapStateToProps)(withStyles(styles)(Profile));
