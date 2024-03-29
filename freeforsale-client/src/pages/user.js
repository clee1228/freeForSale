import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

// Components
import Post from '../components/post/Post';
import StaticProfile from '../components/profile/StaticProfile';
import Profile from '../components/profile/Profile';
import PostSkeleton from '../util/PostSkeleton';
import ProfileSkeleton from '../util/ProfileSkeleton';


// MUI 
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// Redux
import { connect } from 'react-redux';
import { getUserData } from '../redux/actions/dataActions';

class user extends Component {

    state = {
        profile: null,
        postIdParam: null
    };

    componentDidMount(){
        const username = this.props.match.params.username;
        const postId = this.props.match.params.postId;

        if (postId) this.setState({ postIdParam: postId});


        this.props.getUserData(username);
        axios   
            .get(`/user/${username}`)
            .then((res) => {
                this.setState({
                    profile: res.data.user
                });

            })
            .catch((err) => console.log('error =', err));
    }
    render() {
        const { posts, loading } = this.props.data;
        const { postIdParam } = this.state;

        const postsMarkup = loading ? (
            <PostSkeleton/>
        ) : posts === null ? (
            <p>No posts from this user</p>
        ) :  !postIdParam ? (
            posts.map((post) => <Post key={post.postId} post={post}/>)
        ) : (
            posts.map((post) => {
                if(post.postId !== postIdParam)
                    return <Post key={post.postId} post={post}/>
                else return <Post key={post.postId} post={post} openDialog/>
            })
        );

        return (
            //Rendering profile on side
            <Grid container spacing={10}>
                <Grid item sm={8} xs={12}>
                    <Typography variant="h6" style={{paddingBottom: 10}}>Your Posts</Typography>
                    {postsMarkup}
                </Grid>
                <Grid item sm={4} xs={12} style={{paddingTop: 80}}>
                    {this.state.profile === null ? (
                        <ProfileSkeleton/>
                    ) : (
                        <Profile/>
                        // <StaticProfile profile={this.state.profile}/>
                    )}
                </Grid>
            </Grid>
           
        );
    }
};

user.propTypes = {
    getUserData: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    data: state.data
});



export default connect(mapStateToProps, { getUserData })(user);
