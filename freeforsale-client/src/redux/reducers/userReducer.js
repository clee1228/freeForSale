import { 
    SET_USER, 
    SET_AUTHENTICATED,
    SET_UNAUTHENTICATED,
    LOADING_USER
} from '../types';

// Not the global state but what's stored 
// in user: userReducer in store.js
const initialState = {
    authenticated: false,
    loading: false,
    credentials: {},
    likes: [],
    notifications: []
};

export default function(state = initialState, action){
    //Where we catch our types
    switch(action.type){
        case SET_AUTHENTICATED:
            return {
                //just returns the state
                //and changes a couple of things
                ...state,
                authenticated: true
            };
        case SET_UNAUTHENTICATED:
            return initialState;
        case SET_USER:
            return {
                authenticated: true,
                loading: false,
                //spread action payload by binding
                // likes, creds, notifs, etc to user
                ...action.payload
            };
        case LOADING_USER:
            return {
                ...state,
                loading: true
            };
        default:
            return state;
    }
}