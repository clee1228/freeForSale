import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

// Components
import Post from '../components/post/Post';
import StaticProfile from '../components/profile/StaticProfile';

// MUI 
import Grid from '@material-ui/core/Grid';

// Redux
import { connect } from 'react-redux';
import { getUserData } from '../redux/actions/dataActions';

class user extends Component {

    state = {
        profile: null
    };

    componentDidMount(){
        const username = this.props.match.params.username;
        this.props.getUserData(username);
        console.log('username = ', username)
        axios   
            .get(`/user/${username}`)
            .then((res) => {
                console.log('res = ', res)
                this.setState({
                    profile: res.data.user
                });
            console.log('profile = ', this.state.profile)
            })
            .catch((err) => console.log('error =', err));
    }
    render() {
        const { posts, loading } = this.props.data;
        const postsMarkup = loading ? (
            <p>Loading data...</p> 
        ) : posts === null ? (
            <p>No posts from this user</p>
        ) : (
            posts.map((post) => <Post key={post.postId} post={post}/>)
        );

        return (
            <Grid container spacing={10}>
                <Grid item sm={8} xs={12}>
                    {postsMarkup}
                </Grid>
                <Grid item sm={4} xs={12}>
                    {this.state.profile === null ? (
                        <p> Loading profile... </p>
                    ) : (
                        <StaticProfile profile={this.state.profile}/>
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
