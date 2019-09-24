import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';
import PostDialog from './PostDialog';
import MyButton from '../../util/MyButton';
import LikeButton from './LikeButton';
import CouchPhoto from '../../images/couch.png';
import FbImageLibrary from 'react-fb-image-grid';
import PostOptions from './PostOptions';


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


const styles = (theme) => ({
//    ...theme.spreadThis, 
    // content:{
    //     padding: 20,
    //     objectFit: 'cover'
    // }
    card: {
        maxWidth: 650,
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
        width: 45,
        height: 45,
    },
    content:{
        paddingTop: 7,
        paddingLeft: 25,
        paddingBottom: 7
    }
});

class Post extends Component {
    render() {
        dayjs.extend(relativeTime);
        //DESTRUCTURING 
        const { 
            classes, 
            post : { 
                postId, 
                title,
                body, 
                images,
                imgUrls,
                userHandle,
                createdAt, 
                commentCount,
                likeCount, 
                userImage
            },
            user: {
                authenticated,
                creds: { username }
            }
        } = this.props;

        return (
            <Card className={classes.card}>
                <CardHeader
                    avatar={
                        <Avatar src={userImage} className={classes.avatar}/>
                    }
                    action={
                        <PostOptions
                            postUser={userHandle}
                            postId={postId}/>
                    }
                    title={<Link to={`/user/${userHandle}`}>{userHandle}</Link>}
                    subheader={dayjs(createdAt).fromNow()}>


                </CardHeader>


                {imgUrls && imgUrls.length > 1 ? (
                    <div>
                        <FbImageLibrary
                            images={imgUrls}
                            hideOverlay={true}
                            // renderOverlay={() => ""}
                            // overlayBackgroundColor='#ffffff'
                        />
                    </div>

                ): imgUrls && imgUrls.length === 1 ? (
                    <div>
                        <CardMedia
                            className={classes.media}
                            image={imgUrls[0]}
                        /> 
                    </div>

                ):(
                    null
                )}


                <CardContent className={classes.content}>
                    <Typography align="left" variant="h6" className={classes.postTitle} >{title}</Typography>
                    <Typography align="left" variant="body2" component="p">{body}</Typography>
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
        )
    }
}


Post.propTypes = {
    user: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    openDialog: PropTypes.bool,
};

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps)(withStyles(styles)(Post));
