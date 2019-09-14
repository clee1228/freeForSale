const { db } = require('../util/admin');



//first parameter = name of the route, second = the handler
exports.getAllPosts = (req, res) => {
    db.collection('posts')
        .orderBy('createdAt', 'desc')
        .get()
        .then((data) => {
            let posts = [];
            //populate posts array
            data.forEach((doc) => {
                //doc.data = fn that returns data inside document
                posts.push({
                    postId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    username: doc.data().username,
                    createdAt: doc.data().createdAt,
                    commentCount: doc.data().commentCount,
                    likeCount: doc.data().likeCount,
                    userImage: doc.data().userImage
                });
            });
            //return as a json
            return res.json(posts);
        })
        //return promise
        .catch((err) =>{ 
            console.error(err);
            res.status(500).json({ error: err.code });
        });
}


//make one post
exports.postOne = (request, response) => {
    if(request.body.body.trim() === ''){
        return response.status(400).json({ body: 'Body must not be empty' });
    }

    const requestedPost = {
        body: request.body.body,
        username: request.user.username,
        userImage: request.user.imageUrl,
    }


    db.doc(`/users/${requestedPost.username}`)
        .get()
        .then((doc) => {
            if(doc.exists){
                return doc.data().userHandle;
            } else {
                return res.status(404).json({ error: 'User not found'});
            }
        })
        .then((name) => {
            const newPost = {
                body: requestedPost.body,
                userHandle: name,
                userImage: requestedPost.userImage,
                username: requestedPost.username,
                createdAt: new Date().toISOString(),
                likeCount: 0,
                commentCount: 0 
            }

            console.error("new post = ", newPost)

            db.collection('posts')
            .add(newPost)
            .then((doc) => {
                const resPost = newPost;
                resPost.postId = doc.id;
                response.json(resPost);
            })  
            .catch((err) => {
                response.status(500).json({ error: 'something went wrong '});
                console.error(err);
            })
        })
};

//fetch post by postID
exports.getPost = (req, res) => {
    let postData = {};
    db.doc(`/posts/${req.params.postId}`).get()
        .then((doc) => {
            if(!doc.exists){
                return res.status(404).json({ error: 'Post not found'});
            } 
            postData = doc.data();
            postData.postId = doc.id;
            return db
                .collection('comments')
                .orderBy('createdAt', 'desc')
                .where('postId', '==', req.params.postId)
                .get();
        })
        //query snapshots cuz it could be mult. docs
        .then((data) => {
            postData.comments = [];
            data.forEach((doc) => {
                postData.comments.push(doc.data());
            });
            return res.json(postData);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code});
        });
};

//comment on post
exports.commentOnPost = (req, res) => {
    if(req.body.body.trim() === '') return res.status(400).json({ comment: 'Must not be empty'});

    const newComment = {
        body: req.body.body,
        createdAt: new Date().toISOString(),
        postId: req.params.postId,
        userHandle: req.user.name,
        userImage: req.user.imageUrl
    };

    db.doc(`/posts/${req.params.postId}`).get()
        .then((doc) => {
            if(!doc.exists){
                return res.status(404).json({ error: 'Post not found'});
            }
            return doc.ref.update({commentCount: doc.data().commentCount + 1});
        })
        .then(() => {
            return db.collection('comments').add(newComment);
        })
        .then(() => {
            res.json(newComment);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: 'Something went wrong' });
        });
};

//like a post
exports.likePost = (req, res) => {

    const likeDoc = db.collection('likes')
        .where('userHandle', '==', req.user.username)
        .where('postId', '==', req.params.postId)
        .limit(1);

    const postDoc = db.doc(`/posts/${req.params.postId}`);
    let postData;
    postDoc
        .get()
        .then((doc) => {
            if(doc.exists){
                postData = doc.data();
                postData.postId = doc.id;
                return likeDoc.get();
            } else {
                return res.status(404).json({ error: 'Post not found'});
            }
        })
        .then((data) => {
            if(data.empty){
                db.doc(`/users/${req.user.username}`)
                .get()
                .then((doc) => {
                    return doc.data().name;
                })
                .then((name) => {
                    return db
                    .collection('likes')
                    .add({
                        postId: req.params.postId,
                        username: req.user.username,
                        userHandle: name
                    })
                    .then(() => {
                        postData.likeCount++;
                        return postDoc.update({ likeCount: postData.likeCount });
                    })
                    .then(() => {
                        return res.json(postData);
                    })
                }); 
            } else {
                return res.status(400).json({ error: 'Post already liked'});
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code});
        });
};

//unlike a post
exports.unlikePost = (req, res) => {
    const likeDoc = db
        .collection('likes')
        .where('userHandle', '==', req.user.username)
        .where('postId', '==', req.params.postId)
        .limit(1);

    const postDoc = db.doc(`/posts/${req.params.postId}`);

    let postData;
    postDoc
        .get()
        .then((doc) => {
            if(doc.exists){
                postData = doc.data();
                postData.postId = doc.id;
                return likeDoc.get();
            } else {
                return res.status(404).json({ error: 'Post not found'});
            }
        })
        .then((data) => {
            if(data.empty){
                return res.status(400).json({ error: 'Post not liked'});
            } else {
                return db
                    .doc(`/likes/${data.docs[0].id}`)
                    .delete()
                    .then(() => {
                        postData.likeCount--;
                        return postDoc.update({ likeCount: postData.likeCount });
                    })
                    .then(() => {
                        res.json(postData);
                    });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code});
        });
};

//delete a post
exports.delPost = (req, res) => {
    const document = db.doc(`/posts/${req.params.postId}`);
    document
        .get()
        .then((doc) => {
            if(!doc.exists){
                return res.status(404).json({ error: 'Post not found '});
            }
            if(doc.data().userHandle !== req.user.name){
                return res.status(403).json({ error: 'unauthorized'});
            } else {
                return document.delete();
            }
        })
        .then(() => {
            res.json({ msg: 'Post deleted successfully'});
        })
        .catch((err) => {
            console.error(err);
            return res.statu(500).json({ error: err.code });
        });
};







/*****  without using express ******/

// exports.getPosts = functions.https.onRequest((request, response) => {
//     admin.firestore().collection('posts').get()
//         .then(data => {
//             let posts = [];

//             //populate posts array
//             data.forEach(doc => {
//                 //doc.data = fn that returns data inside document
//                 posts.push(doc.data())
//             });
//             //return as a json
//             return response.json(posts);
//         })
//         //return promise
//         .catch(err => console.error(err));

// });

// exports.createPost = functions.https.onRequest((request, response) => {
//     //Send client error if not POST request
//     if(request.method !== 'POST'){
//         return response.status(400).json({ error: `Method not allowed`});
//     }
//     const newPost = {
//         //body property of the body of the request
//         body: request.body.body,
//         username: request.body.username,
//         createdAt: admin.firestore.Timestamp.fromDate(new Date())
//     };

//     admin
//         .firestore()
//         .collection('posts')
//         //takes json object and adds post
//         .add(newPost)
//         .then((doc) => {
//             //backticks b/c using variable inside
//             response.json({msg: `document ${doc.id} created successfully` });
//         })  
//         .catch((err) => {
//             response.status(500).json({ error: 'something went wrong '});
//             console.error(err);
//         });
    
// });