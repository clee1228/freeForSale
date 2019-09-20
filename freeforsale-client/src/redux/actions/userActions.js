import { 
    SET_USER, 
    SET_ERRORS, 
    CLEAR_ERRORS, 
    LOADING_UI, 
    SET_UNAUTHENTICATED,
    LOADING_USER,
    MARK_NOTIFICATIONS_READ} from '../types';
import axios from 'axios';

 //need to use dispatch bc we have asynchronous code
export const loginUser = (userData, history) => (dispatch) => {
     //sending an action by dispatching a type and catching it from the reducer
     dispatch({ type: LOADING_UI});

     //res.data b/c we're using axios
     axios
        .post('/login', userData)
        .then((res) => {
            setAuthHeader(res.data.token);
            dispatch(getUserData());
            dispatch({ type: CLEAR_ERRORS });
            //method to push a path & redirect to it (to homepage)
            history.push('/');
        })
        .catch((err) => {
            dispatch({ 
                type: SET_ERRORS,
                payload: err.response.data
            })
        });
};

export const googleLogin = (token, history) => (dispatch) => {
    axios
        .post('/loginGoogleUser', token)
        .then((res) => {
            setAuthHeader(res.data.token);
            dispatch(getUserData());
            dispatch({ type: CLEAR_ERRORS });
            history.push('/');
        })
        .catch((err) => {
            console.log(err)
            // dispatch({ 
            //     type: SET_ERRORS,
            //     payload: err.response.data
            // })
        });
};

//Clear user state by removing token from localStorage & headers 
export const logout = () => (dispatch) => {
    localStorage.removeItem('FBIdToken');
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: SET_UNAUTHENTICATED });
};

export const googleSignup = (newUserData, history) => (dispatch) => {
    axios
        .post('/signupGoogleUser', newUserData) 
        .then((res) => {
            setAuthHeader(res.data.fbToken);
            dispatch(getUserData());
            history.push('/');
        })
        .catch((err) => {
            console.log(err)
        })
}

export const signupUser = (newUserData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI});
    axios
       .post('/signup', newUserData)
       .then((res) => {
           setAuthHeader(res.data.token);
           dispatch(getUserData());
           dispatch({ type: CLEAR_ERRORS });
           history.push('/');
       })
       .catch((err) => {
           dispatch({ 
               type: SET_ERRORS,
               payload: err.response.data
           })
       });
};

 //this action sets type and user data
export const getUserData = () => (dispatch) => {
    dispatch( { type: LOADING_USER });
    axios
        .get('/user')
        .then((res) => {
            dispatch({
                type: SET_USER,
                payload: res.data
            });
        })
        .catch((err) => console.log(err));
 };

 
 export const uploadImage = (formData) => (dispatch) => {
     dispatch({ type: LOADING_USER });
     axios.post('/user/image', formData)
        .then((res) => {
            dispatch(getUserData());
        })
        .catch((err) => console.log(err));
 }

 //fn that sends a req to edit user details
 export const editUserDetails = (userDetails) => (dispatch) => {
     dispatch({ type: LOADING_USER });
     //send request
     axios
        .post('/user', userDetails)
        .then(() => {
            dispatch(getUserData());
        })
        .catch((err) => console.log(err));

 }

 export const markNotificationsRead = (notificationsIds) => (dispatch) => {
    axios
        .post('/notifications', notificationsIds)
        .then((res) => {
            dispatch({
                type: MARK_NOTIFICATIONS_READ
            })
        })
        .catch((err) => console.log(err));
 };

 const setAuthHeader = (token) => {
    const FBIdToken = `Bearer ${token}`
    localStorage.setItem('FBIdToken', FBIdToken);
    //Each time req is sent, it'll have this default header thru axios
    //so that we don't have to add it to requests every time
    axios.defaults.headers.common['Authorization'] = FBIdToken;
 };

