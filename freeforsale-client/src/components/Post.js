import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';
import DeletePost from './DeletePost';
import PostDialog from './PostDialog';
import MyButton from '../util/MyButton';
import LikeButton from './LikeButton';


//MUI Stuff
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography'

// Icons
import ChatIcon from '@material-ui/icons/Chat';

// Redux
import { connect } from 'react-redux';



const styles = {
    card: {
        position: 'relative',
        display: 'flex',
        marginBottom: 20
    },
    image:{
        minWidth: 150,
    },
    content:{
        padding: 20,
        objectFit: 'cover'
    }
};

class Post extends Component {
    render() {
        dayjs.extend(relativeTime);
        //DESTRUCTURING - const classes = this.props.classes
        const { 
            classes, 
            post : { 
                body, 
                createdAt, 
                userImage, 
                userHandle, 
                postId, 
                likeCount, 
                commentCount
            },
            user: {
                authenticated,
                creds: { username }
            }
        } = this.props;
        

        const deleteButton = authenticated && userHandle === username ? (
            <DeletePost postId={postId} />
        ) : null


        return (
            <Card className={classes.card}>
                <CardMedia 
                image={userImage}
                title="Profile Image"
                className={classes.image}/>

                <CardContent className={classes.content}>
                    <Typography 
                        variant="h5" 
                        component={Link} 
                        to={`/users/${userHandle}`}
                        color="primary"> 
                        
                        {userHandle}
                    </Typography>


                    {deleteButton}

                    <Typography 
                        variant="body2" 
                        color="textSecondary">
                            {dayjs(createdAt).fromNow()}
                    </Typography>
                    <Typography variant="body1">{body}</Typography>

                    <LikeButton postId={postId} />
                    <span>{likeCount} Likes</span>

                    <MyButton tip="Comments">
                        <ChatIcon color="primary"/>
                    </MyButton>
                    <span> {commentCount} Comments</span>

                    <PostDialog 
                        postId={postId}
                        userHandle={userHandle}/>



                </CardContent>
            </Card>
            
        )
    }
}

Post.propTypes = {
    user: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps)(withStyles(styles)(Post));
