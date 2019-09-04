const functions = require('firebase-functions');

//express
const app = require('express')();

const FBAuth = require('./util/fbAuth');

const { getAllPosts, postOne} = require('./handlers/posts');
const { signup, login } = require('./handlers/users');

//Post Routes
app.get('/posts', getAllPosts);
app.post('/post', FBAuth, postOne);

//User Routes
app.post('/signup', signup);
app.post('/login', login);


//pass in app instead of one fn/route which automatically turns into multiple routes
exports.api = functions.https.onRequest(app);