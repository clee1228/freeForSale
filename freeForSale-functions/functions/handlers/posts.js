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
                    username: doc.data().username,
                    createdAt: doc.data().createdAt,
                    commentCount: doc.data().commentCount,
                    likeCount: doc.data().likeCount
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

    const newPost = {
        //body property of the body of the request
        body: request.body.body,
        username: request.user.username,
        createdAt: new Date().toISOString()
    };

    db.collection('posts')
        .add(newPost)
        .then((doc) => {
            response.json({msg: `document ${doc.id} created successfully` });
        })  
        .catch((err) => {
            response.status(500).json({ error: 'something went wrong '});
            console.error(err);
        });
}

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
    if(req.body.body.trim() === '') return res.status(400).json({ error: 'Must not be empty'});

    const newComment = {
        body: req.body.body,
        createdAt: new Date().toISOString(),
        postId: req.params.postId,
        username: req.user.username,
        userImage: req.user.imageUrl
    };

    db.doc(`/posts/${req.params.postId}`).get()
        .then((doc) => {
            if(!doc.exists){
                return res.status(404).json({ error: 'Post not found'});
            }
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