import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../util/MyButton';

// Redux
import { connect } from 'react-redux';
import { editUserDetails } from '../redux/actions/userActions';

// MUI
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

// Icons 
import EditIcon from '@material-ui/icons/Edit';

const styles = (theme) => ({
    ...theme.spreadThis,
    button: {
        float: 'right'
    }
});

class EditDetails extends Component {
    state = {
        bio: '',
        website: '',
        location: '',
        open: false
    };

    mapUserDetailsToState = (creds) => {
        this.setState({
            bio: creds.bio ? creds.bio : '',
            website: creds.website ? creds.website : '',
            location: creds.location ? creds.location : '',
        });
    };

    handleOpen = () => {
        this.setState({ open: true });
        this.mapUserDetailsToState(this.props.creds);
    };

    handleClose = () => {
        this.setState({ open: false }); };

    componentDidMount(){
        const { creds } = this.props;
        this.mapUserDetailsToState(creds);
    };

    //event is passed in if params is form-based
    handleChange = (event) =>{ 
        this.setState({
            [event.target.name]: event.target.value
        })};

    handleSubmit = () => {
        const userDetails = {
            bio: this.state.bio,
            website: this.state.website,
            location: this.state.location
        };
        this.props.editUserDetails(userDetails);
        this.handleClose();
    };

    render() {
        const { classes } = this.props;
        return (
            <Fragment> 
                <MyButton 
                    tip="Edit Details" 
                    onClick={this.handleOpen}
                    btnClassName={classes.button}>
                        <EditIcon color="primary"/>
                </MyButton>
                
                <Dialog 
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="sm">

                    <DialogTitle>Edit your details</DialogTitle>
                        <DialogContent>
                            <form>
                                <TextField
                                    name="bio"
                                    type="text"
                                    label="Bio"
                                    multiline
                                    rows="3"
                                    placeholder="A short bio about yourself"
                                    className={classes.textField}
                                    value={this.state.bio}
                                    onChange={this.handleChange}
                                    fullWidth/>
                                    <TextField
                                    name="website"
                                    type="text"
                                    label="Website"
                                    placeholder="Your personal/professional website"
                                    className={classes.textField}
                                    value={this.state.website}
                                    onChange={this.handleChange}
                                    fullWidth/>
                                    <TextField
                                    name="location"
                                    type="text"
                                    label="Location"
                                    placeholder="Where you live"
                                    className={classes.textField}
                                    value={this.state.location}
                                    onChange={this.handleChange}
                                    fullWidth/>
                            </form>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={this.handleSubmit} color="primary">
                                Save
                            </Button>
                        </DialogActions>

                </Dialog>

            </Fragment>
        )
    }
}

EditDetails.propTypes = {
    editUserDetails: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
}

const mapStatetoProps = (state) => ({
    creds: state.user.creds
})

export default connect(mapStatetoProps, { editUserDetails })(withStyles(styles)(EditDetails));
