const functions = require('firebase-functions');
const app = require('express')();
const FBAuth = require('./util/fbAuth');

const { 
    getAllPosts, 
    postOne, 
    getPost,
    commentOnPost,
    likePost,
    unlikePost
} = require('./handlers/posts');
const { 
    signup, 
    login, 
    uploadPhoto, 
    addUserDetails, 
    getUserDetails 
} = require('./handlers/users');

//Post Routes (use FBAuth to protect the data b/c we get it via token)
app.get('/posts', getAllPosts);
app.post('/post', FBAuth, postOne);
app.get('/post/:postId', getPost); //colon tells app that it's a route parameter 
//TODO: delete post
app.get('/posts/:postId/like', FBAuth, likePost);
app.get('/posts/:postId/unlike', FBAuth, unlikePost);
//Protected route via FBAuth
app.post(`/post/:postId/comment`, FBAuth, commentOnPost);




//User Routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadPhoto);
app.post('/user', FBAuth, addUserDetails);
app.get('/user/', FBAuth, getUserDetails)




//pass in app instead of one fn/route which automatically turns into multiple routes
exports.api = functions.https.onRequest(app);