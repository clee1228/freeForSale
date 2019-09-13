import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

// Components
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


// Redux
import { connect } from 'react-redux';

const styles = (theme) => ({...theme.spreadThis});

class Filters extends Component {
    render() {
        const { 
            classes,
            user: { 
            creds: { username, createdAt, imageUrl, bio, website, location},
            loading, 
            authenticated
             }
        } = this.props;

        let filtersMarkup = !loading ? (
            authenticated ? (
            <Paper className={classes.paper}>
                <div className={classes.profile}>
                    <div className="profile-details">
                    <Typography 
                        align="left"
                        variant="subtitle1"
                        color="textSecondary"
                    >
                        Filters
                    </Typography>
                    <hr/>

                    
                    <span>HELLOOO</span>
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
        ) : (<ProfileSkeleton/>);

        return filtersMarkup; 
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});



Filters.propTypes = {
    classes: PropTypes.object.isRequired
};


export default connect(mapStateToProps)(withStyles(styles)(Filters));
