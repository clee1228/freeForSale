const functions = require('firebase-functions');
const app = require('express')();
const FBAuth = require('./util/fbAuth');
const { db } = require('./util/admin');

//Cross-Origin Resource Sharing
const cors = require('cors');
app.use(cors());

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
    signupGoogleUser,
    login, 
    loginGoogleUser,
    uploadPhoto, 
    addUserDetails, 
    getAuthenticatedUser,
    getUserDetails,
    markNotifsRead
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
app.post('/loginGoogleUser', loginGoogleUser);
app.post('/signupGoogleUser', signupGoogleUser)
app.post('/user/image', FBAuth, uploadPhoto);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);
app.get('/user/:username', getUserDetails);
app.post('/notifications', FBAuth, markNotifsRead);

//pass in app instead of one fn/route which automatically turns into multiple routes
exports.api = functions.https.onRequest(app);

exports.sendLikeNotifs = functions.region('us-central1').firestore.document('likes/{id}')
    .onCreate((snapshot) => {
        return db.doc(`/posts/${snapshot.data().postId}`)
            .get()
            .then((doc) => {
                if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle){
                    return db.doc(`/notifications/${snapshot.id}`)
                        .set({
                            createdAt: new Date().toISOString(),
                            recipient: doc.data().userHandle,
                            sender: snapshot.data().userHandle,
                            type: 'like',
                            read: false,
                            postId: doc.id
                        });
                }
            })
            .catch((err) => {
                console.error(err); 
            });
    });

//delete notifs when someone unlikes a post
exports.delLikeNotifs = functions.region('us-central1').firestore.document('likes/{id}')
.onDelete((snapshot) => {
    return db.doc(`/notifications/${snapshot.id}`)
        .delete()
        .catch((err) => {
            console.error(err);
            return;
        });
});

exports.sendCommentNotifs = functions.region('us-central1').firestore.document('comments/{id}')
    .onCreate((snapshot) => {
        return db.doc(`/posts/${snapshot.data().postId}`)
            .get()
            .then((doc) => {
                if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle){
                    return db.doc(`/notifications/${snapshot.id}`)
                        .set({
                            createdAt: new Date().toISOString(),
                            recipient: doc.data().userHandle,
                            sender: snapshot.data().userHandle,
                            type: 'comment',
                            read: false,
                            postId: doc.id
                        });
                }
            })
            .catch((err) => {
                console.error(err);
                return;
            });
    });


//change userImage on posts if updated     
exports.onUserImageChange = functions.region('us-central1').firestore.document('/users/{userId}')
    .onUpdate((change) => {
        console.log(change.before.data());
        console.log(change.after.data());
        if(change.before.data().imageUrl !== change.after.data().imageUrl){
            const batch = db.batch();
            return db
                .collection('posts')
                .where('username', '==', change.before.data().username)
                .get()
                .then((data) => {
                    data.forEach((doc) => {
                        const post = db.doc(`/posts/${doc.id}`);
                        batch.update(post, { userImage: change.after.data().imageUrl });
                    })
                    return batch.commit();
                });
        } else return true;
    });

    
//delete all comments/likes/notifications if post is deleted
exports.onPostDelete = functions.region('us-central1').firestore.document('/posts/{postId}')
    .onDelete((snapshot, context) => {
        const postId = context.params.postId;
        const batch = db.batch();
        return db.collection('comments')
            .where('postId', '==', postId)
            .get()
            .then((data) => {
                data.forEach((doc) => {
                    batch.delete(db.doc(`/comments/${doc.id}`));
                })
                return db.collection('likes').where('postId', '==', postId).get();
            })
            .then((data) => {
                data.forEach((doc) => {
                    batch.delete(db.doc(`/likes/${doc.id}`));
                })
                return db.collection('notifications').where('postId', '==', postId).get();
            })
            .then((data) => {
                data.forEach((doc) => {
                    batch.delete(db.doc(`/notifications/${doc.id}`));
                })
                return batch.commit();
            })
            .catch((err) => console.error(err));
    });