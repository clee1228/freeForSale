import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';
import DeletePost from './DeletePost';
import PostDialog from './PostDialog';
import MyButton from '../../util/MyButton';
import LikeButton from './LikeButton';
import CouchPhoto from '../../images/couch.png';


//MUI Stuff
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';

// Icons
import ChatIcon from '@material-ui/icons/Chat';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';

// Redux
import { connect } from 'react-redux';
import { CardHeader } from '@material-ui/core';

// Colors
import { red } from '@material-ui/core/colors';



const styles = {
    // content:{
    //     padding: 20,
    //     objectFit: 'cover'
    // }

    card: {
        maxWidth: 580,
        marginBottom: 20,
        position: 'relative',
      },
      media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
      },
      expandOpen: {
        transform: 'rotate(180deg)',
      },
      avatar: {
        width: 50,
        height: 50,
      },
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
                <CardHeader
                    avatar={
                        <Avatar src={userImage} className={classes.avatar}/>
                    }
                    action={
                        <IconButton aria-label="options">
                            <MoreVertIcon />
                        </IconButton>
                    }
                    title={userHandle}
                    subheader={dayjs(createdAt).fromNow()}/>

            <CardMedia
                    className={classes.media}
                    image={CouchPhoto}
                    title="Paella dish"
                />
             <CardContent>
                <Typography variant="body2" component="p">{body}</Typography>
                
            </CardContent>

        
            <CardActions disableSpacing>
                <LikeButton postId={postId} />
                    <span>{likeCount} Likes</span>
                <MyButton tip="Comments">
                    <ChatIcon color="primary"/>
                </MyButton>
                <span> {commentCount} Comments</span>

                <PostDialog 
                        postId={postId}
                        userHandle={userHandle}
                        openDialog={this.props.openDialog}/>
            </CardActions>
            </Card>



            
                /* <CardMedia 
                image={userImage}
                title="Profile Image"
                className={classes.image}/>

                <CardContent className={classes.content}>
                    <Typography 
                        variant="h5" 
                        component={Link} 
                        to={`/user/${userHandle}`}
                        color="primary"> 
                        
                        {userHandle}
                    </Typography>


                    {deleteButton}

                </CardContent>
            </Card> */
            
        )
    }
}


Post.propTypes = {
    user: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    openDialog: PropTypes.bool
};

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps)(withStyles(styles)(Post));
