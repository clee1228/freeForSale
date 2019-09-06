import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import Link from 'react-router-dom/Link';

//MUI Stuff
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography'


const styles = {
    card: {
        display: 'flex',
        marginBottom: 20
    },
    image:{
        minWidth: 200,
    },
    content:{
        padding: 25,
        objectFit: 'cover'
    }
};

export class Post extends Component {
    render() {
        //DESTRUCTURING - const classes = this.props.classes
        const { classes, post : {body, createdAt, userImage, username, postId, likeCount, commentCount}  } = this.props
        return (
            <Card className={classes.card}>
                <CardMedia 
                image={userImage}
                title="Profile Image"
                className={classes.image}/>

                <CardContent class={classes.content}>
                    <Typography 
                        variant="h5" 
                        component={Link} 
                        to={`/users/${username}`}
                        color="primary"> {username}</Typography>
                    <Typography variant="body2" color="textSecondary">{createdAt}</Typography>
                    <Typography variant="body1">{body}</Typography>
                </CardContent>
            </Card>
            
        )
    }
}

export default withStyles(styles)(Post);
