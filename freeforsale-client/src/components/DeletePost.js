import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import MyButton from '../util/MyButton'; 

// MUI
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

// Icons
import DeleteOutline from '@material-ui/icons/DeleteOutlined';

// Redux
import { connect } from 'react-redux';
import { deletePost } from '../redux/actions/dataActions';


const styles = {
    deleteButton: {
        position: 'absolute',
        left: '93%',
        top: '3%'
      }
};

class DeletePost extends Component {
    state = { open: false };

    //open dialog
    handleOpen = () => {
        this.setState({ open: true });
    }

    handleClose = () => {
        this.setState({ open: false });
    }

    deletePost = () => {
        this.props.deletePost(this.props.postId);
        this.setState({ open: false });
    }


    render() {
        const { classes } = this.props;

        return (
            <Fragment>
                <MyButton 
                    tip="Delete Post"
                    onClick={this.handleOpen}
                    btnClassName={classes.deleteButton}>
                        <DeleteOutline color="primary"/>
                </MyButton>

                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="sm">

                        <DialogTitle>
                            Are you sure you want to delete this post?
                        </DialogTitle>
                        <DialogActions>
                            <Button onClick={this.handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={this.deletePost} color="secondary">
                                Delete
                            </Button>
                        </DialogActions>
                </Dialog>
            </Fragment>
        )
        
    }
}

DeletePost.propTypes = {
    deletePost: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    postId: PropTypes.string.isRequired
}


export default connect(null, { deletePost })(withStyles(styles)(DeletePost));
