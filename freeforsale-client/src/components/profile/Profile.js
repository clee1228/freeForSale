import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

// Components
import EditDetails from './EditDetails';
import MyButton from '../../util/MyButton';
import ProfileSkeleton from '../../util/ProfileSkeleton';

// MUI stuff
import Button from '@material-ui/core/Button';
import MUILink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';


// Icons
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';
import EditIcon from '@material-ui/icons/Edit';
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';


// Redux
import { connect } from 'react-redux';
import { logout, uploadImage } from '../../redux/actions/userActions';

const styles = (theme) => ({...theme.spreadThis});

class Profile extends Component {
    handleImageChange = (event) => {
        const image = event.target.files[0];

        // send to server
        const formData = new FormData();
        formData.append('image', image, image.name);

        //send to userActions
        this.props.uploadImage(formData);
    };

    handleEditPic = () => {
        const fileInput = document.getElementById('imageInput');
        //opens file selector window
        fileInput.click();
    };

    //logout fn 
    handleLogout = () => { this.props.logout(); }


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
                        {/* onChange is triggered each time a file is selected*/}
                        <input 
                            type="file" 
                            id="imageInput"
                            hidden="hidden"
                            onChange={this.handleImageChange}/>
                        <MyButton 
                            tip="Edit profile picture" 
                            onClick={this.handleEditPic}
                            btnClassName="button">
                                <EditIcon color="primary"/>
                        </MyButton>

                    </div>
                    <hr/>
                    <div className="profile-details">
                        <MUILink 
                            component={Link} 
                            to={`/user/${username}`} 
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


                    <MyButton 
                        tip="Logout" 
                        onClick={this.handleLogout}>
                            <KeyboardReturn color="primary"/>
                    </MyButton>

                <EditDetails/>





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
        ) : (<ProfileSkeleton/>);

        return profileMarkup; 
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

const mapActionsToProps = { logout, uploadImage };

Profile.propTypes = {
    user: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
    uploadImage: PropTypes.func.isRequired
};


export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Profile));
