import { 
    SET_POSTS, 
    LOADING_DATA,
    LIKE_POST, 
    UNLIKE_POST
} from '../types';

import axios from 'axios';

// Get all posts
export const getPosts = () => dispatch => {
    dispatch({ type: LOADING_DATA });
    axios
        .get('/posts')
        .then((res) => {
            dispatch({
                type: SET_POSTS,
                payload: res.data
            })
        })
        .catch((err) => {
            dispatch({
                type: SET_POSTS,
                payload: []
            })
        });
};

// Like a post



// Unlike a post