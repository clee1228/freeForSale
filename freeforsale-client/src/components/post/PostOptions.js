import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// MUI
import withStyles from '@material-ui/core/styles/withStyles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';


// Icons
import MoreVertIcon from '@material-ui/icons/MoreVert';

// Redux
import { connect } from 'react-redux';
import { deletePost } from '../../redux/actions/dataActions';

const styles = (theme) => ({
    ...theme.spreadThis, 
});


class PostOptions extends Component{
    state = {
        anchorEl: null,
        deleteClicked: false
    };

    componentWillReceiveProps(nextProps){
        if(!nextProps.UI.errors && !nextProps.UI.loading){
            this.setState({ deleteClicked: false });
        }
    }

    handleOpen = (event) => {
        this.setState({ anchorEl: event.target });
    }; 

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    deleteClick = () => { 
        this.setState({ deleteClicked: !this.state.deleteClicked}) 
    }

    deletePost = () => {
        console.log('options postid = ', this.props.postId)
        this.props.deletePost(this.props.postId); 
    }
    

    render(){
        const anchorEl = this.state.anchorEl;
        const { 
                classes,
                postUser,
                postId,
                UI: {
                    loading
                },
                user: { 
                    creds: { userHandle, username, createdAt, imageUrl, bio, website, location},
                    authenticated
                }} = this.props;

    
        return (
            <Fragment>
                <Tooltip
                    placement="top"
                    title="Options">

                    <IconButton 
                        aria-owns={anchorEl ? 'simple-menu' : undefined}
                        aria-controls="postOptions"
                        aria-haspopup="true"
                        onClick={this.handleOpen}>
                            <MoreVertIcon/>
                    </IconButton>
                </Tooltip>
                <Menu
                    id="postOptions"
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

            
                {authenticated && userHandle === postUser? (
                    <MenuItem
                        onClick={this.deleteClick}
                    >
                            Delete Post
                    </MenuItem>

                ): (
                    <MenuItem
                        component={Link}
                        to={`/user/${username}`}
                        >
                            Message User
                    </MenuItem>

                )}

                </Menu>

                <Dialog
                    open={this.state.deleteClicked}
                    onClose={this.deleteClick}
                    fullWidth
                    maxWidth="sm">

                        <DialogTitle>
                            Are you sure you want to delete this post?
                        </DialogTitle>
                        <DialogActions>
                            <Button 
                                onClick={this.deleteClick} 
                                color="primary"
                            >
                                Cancel
                            </Button>
                            <Button 
                                onClick={this.deletePost} 
                                color="secondary"
                                disabled={loading}
                            >
                                Delete
                                
                            </Button>
                        </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}


const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI
});

PostOptions.propTypes = {
    user: PropTypes.object.isRequired,
    postUser: PropTypes.string.isRequired,
    postId: PropTypes.string.isRequired,
    deletePost: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, { deletePost })(withStyles(styles)(PostOptions));