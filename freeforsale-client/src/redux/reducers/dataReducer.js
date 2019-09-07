/* Handles all actions related to our data */
import { 
    SET_POSTS,
    SET_POST,
    LIKE_POST, 
    UNLIKE_POST, 
    LOADING_DATA,
    DELETE_POST,
    CREATE_POST,
    SUBMIT_COMMENT
 } from '../types';

const initialState = {
    posts: [],
    post: {},
    loading: false
};

export default function(state = initialState, action){
    switch(action.type){
        case LOADING_DATA:
            return {
                ...state,
                loading: true
            }
        case SET_POST:
            return{
                ...state,
                post: action.payload
            };
        case SET_POSTS:
            return{
                ...state,
                posts: action.payload,
                loading: false
            }
        //chain both like & unlike
        case LIKE_POST:
        case UNLIKE_POST:
            let index = state
                .posts
                .findIndex((post) => post.postId === action.payload.postId);
            state.posts[index] = action.payload;
            if(state.post.postId === action.payload.postId) {
                state.post = action.payload;
            }
            return{
                ...state,
            };  
            
        case DELETE_POST:
            let i = state.posts.findIndex(
                (post) => post.postId === action.payload);
            state.posts.splice(i, 1);
            return{
                ...state
            };
        case CREATE_POST:
            return {
                ...state,
                posts: [ action.payload, ...state.posts]
            };
        case SUBMIT_COMMENT:
            return{
                ...state,
                post:{
                    ...state.post,
                    comments: [action.payload, ...state.post.comments]
                }
            };

        default:
            return state;
    }
}