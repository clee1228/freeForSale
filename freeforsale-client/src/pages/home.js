import React, { Component } from 'react'
import PropTypes from 'prop-types';


// Components
import Post from '../components/post/Post';
import Filters from '../components/layout/Filters'; 
import PostSkeleton from '../util/PostSkeleton';

// MUI
import Grid from '@material-ui/core/Grid';

// Redux
import { connect } from 'react-redux';
import { getPosts } from '../redux/actions/dataActions';


class home extends Component {
    componentDidMount(){ 
        this.props.getPosts();
    }
    render() {
        
        const { posts, loading } = this.props.data;
        let recentPostsMarkup = !loading ? (
            posts.map((post) =>  <Post key={post.postId} post={post}/>)
        ) : ( 
            <PostSkeleton/>
        );

        return (
            <Grid container spacing={6}>
                {/*small screens will have width of 8 */}
                <Grid item sm={8} xs={12}>
                    {recentPostsMarkup}
                </Grid>
                <Grid item sm={4} xs={12}>
                    <Filters/>

                    
                        

        
              </Grid>
            </Grid>
        );
    }
}

home.propTypes = {
    getPosts: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    data: state.data
});

export default connect(mapStateToProps, { getPosts })(home);
