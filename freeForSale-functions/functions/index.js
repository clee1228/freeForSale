const functions = require('firebase-functions');
const app = require('express')();
const FBAuth = require('./util/fbAuth');
const { db } = require('./util/admin');

const { 
    getAllPosts, 
    postOne, 
    getPost,
    commentOnPost,
    likePost,
    unlikePost,
    delPost
} = require('./handlers/posts');
const { 
    signup, 
    login, 
    uploadPhoto, 
    addUserDetails, 
    getUserDetails 
} = require('./handlers/users');

//Post Routes; //Protected route via FBAuth using tokens
app.get('/posts', getAllPosts);
app.post('/post', FBAuth, postOne);
app.get('/post/:postId', getPost); //colon tells app that it's a route parameter 
app.delete('/post/:postId', FBAuth, delPost);
app.get('/post/:postId/like', FBAuth, likePost);
app.get('/post/:postId/unlike', FBAuth, unlikePost);
app.post('/post/:postId/comment', FBAuth, commentOnPost);

//User Routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadPhoto);
app.post('/user', FBAuth, addUserDetails);
app.get('/user/', FBAuth, getUserDetails)

//pass in app instead of one fn/route which automatically turns into multiple routes
exports.api = functions.https.onRequest(app);

exports.sendLikeNotifs = functions.region('us-central1').firestore.document('likes/{id}')
    .onCreate((snapshot) => {
        db.doc(`/posts/${snapshot.data().postId}`)
            .get()
            .then((doc) => {
                if(doc.exists){
                    return db.doc(`/notifications/${snapshot.id}`)
                        .set({
                            createdAt: new Date().toISOString(),
                            recipient: doc.data().username,
                            sender: snapshot.data().username,
                            type: 'like',
                            read: false,
                            postId: doc.id
                        });
                }
            })
            .then(() => {
                return;
            })
            .catch((err) => {
                console.error(err);
                return;
            });
    });

//delete notifs when someone unlikes a post
exports.delLikeNotifs = functions.region('us-central1').firestore.document('likes/{id}')
.onDelete((snapshot) => {
    db.doc(`/notifications/${snapshot.id}`)
        .delete()
        .then(() => {
            return;
        })
        .catch((err) => {
            console.error(err);
            return;
        });
});



exports.sendCommentNotifs = functions.region('us-central1').firestore.document('comments/{id}')
    .onCreate((snapshot) => {
        db.doc(`/posts/${snapshot.data().postId}`)
            .get()
            .then((doc) => {
                if(doc.exists){
                    return db.doc(`/notifications/${snapshot.id}`)
                        .set({
                            createdAt: new Date().toISOString(),
                            recipient: doc.data().username,
                            sender: snapshot.data().username,
                            type: 'comment',
                            read: false,
                            postId: doc.id
                        });
                }
            })
            .then(() => {
                return;
            })
            .catch((err) => {
                console.error(err);
                return;
            });
    });