const { admin, db } = require('../util/admin');
const config = require('../util/config');

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
                    title: doc.data().title,
                    body: doc.data().body,
                    images: doc.data().pics,
                    imgUrls: doc.data().imgUrls,
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
exports.postOne = (req, res) => {
    console.error('hello posts started')

    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');

    const busboy = new BusBoy({ headers: req.headers });

    // This object will accumulate all the fields, keyed by their name
    const fields = {
        username: req.user.username,
        userImage: req.user.imageUrl
    };

    // This object will accumulate all the uploaded files, keyed by their name
    const uploads = {};

    // Process each non-file field in the form
    busboy.on('field', (fieldname, val) => {
        if(fieldname === 'title' && val === ''){
        return response.status(400).json({ body: 'Body must not be empty' });
    }
        fields[fieldname] = val;
    });
    
    const fileWrites = [];
    const images = [];
    const urls = [];

    // Process each file uploaded.
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        // Note: os.tmpdir() points to an in-memory file system on GCF
        // Thus, any files in it must fit in the instance's memory.

        // console.log('File [%s]: filename=%j; encoding=%j; mimetype=%j',
        //       fieldname, filename, encoding, mimetype);

        if(mimetype !== 'image/jpeg' && mimetype !== 'image/png'){
            return res.status(400).json({ error: 'Wrong file type submitted'});
        } 

        const imageExtension = filename.split('.')[filename.split('.').length - 1];
        imageFileName = `${Math.round(Math.random() *  1000000000).toString()}.${imageExtension}`;
        console.error('imageFileName = ', imageFileName)

        const filepath = path.join(os.tmpdir(), imageFileName);
        uploads[filename] = { name: imageFileName, path: filepath, type: mimetype };
        images.push(imageFileName)
        console.error('images = ', images)

        const writeStream = fs.createWriteStream(filepath);
        file.pipe(writeStream);

        // File was processed by Busboy; wait for it to be written to disk.
        const promise = new Promise((resolve, reject) => {
            file.on('end', () => {
            writeStream.end();
            });
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });
        fileWrites.push(promise);
    });


    // Triggered once all uploaded files are processed by Busboy.
    // We still need to wait for the disk writes (saves) to complete.
    busboy.on('finish', () => {
        Promise.all(fileWrites).then(() => {
            // Process saved files here
            for (const name in uploads) {
                const file = uploads[name];
            
                //Firebase Storage doesn't have it's own Node.js SDK (it's a browser-only system)
                // Since these files are Cloud Storage objects in a Cloud Storage bucket,
                // we can use the Cloud Storage SDK to interact with them in Node.js
                admin
                    .storage()
                    .bucket()
                    .upload(file.path, {
                        resumable: false,
                        metadata: {
                            metadata: {
                                contentType: file.type
                            }
                        }
                    })

                //delete files from node.js for synchronous file operations
                // fs.unlinkSync(file.path);
            }
        })
        .then(() => {
            db.doc(`/users/${fields.username}`)
                .get()
                .then((doc) => {
                    if(doc.exists){
                        return doc.data().userHandle;
                    } else {
                        return res.status(404).json({ error: 'User not found'});
                    }
                })
                .then((name) => {
                    
                    
                    for (var img in images){
                        var imgName = images[img]
                        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imgName}?alt=media`;
                        urls.push(imageUrl)
                    }

                    const newPost = {
                        title: fields.title,
                        body: fields.body,
                        pics: images,
                        imgUrls: urls,
                        userHandle: name,
                        username: fields.username,
                        userImage: fields.userImage,
                        createdAt: new Date().toISOString(),
                        likeCount: 0,
                        commentCount: 0, 
                    }

                    db.collection('posts')
                        .add(newPost)
                        .then((doc) => {
                            const resPost = newPost;
                            //add postID to the post
                            resPost.postId = doc.id;
                            res.json(resPost);
                        })  
                        .catch((err) => {
                            res.status(500).json({ error: 'Something went wrong '});
                            console.error(err);
                        })
                })
        })
    });
            

    busboy.end(req.rawBody);
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
        postId: req.params.postId,
        username: req.user.username,
        userHandle: "",
        userImage: req.user.imageUrl,
        createdAt: new Date().toISOString(),
    };

    db.doc(`/users/${req.user.username}`)
        .get()
        .then((doc) => {
            return doc.data().userHandle;
        })
        .then((name) => {
            newComment.userHandle = name;
        });


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
        .where('username', '==', req.user.username)
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
                    return doc.data().userHandle;
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
        .where('username', '==', req.user.username)
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
    //delete pics too
    const document = db.doc(`/posts/${req.params.postId}`);
    document
        .get()
        .then((doc) => {
            if(!doc.exists){
                return res.status(404).json({ error: 'Post not found '});
            }
            if(doc.data().username !== req.user.username){
                return res.status(403).json({ error: 'unauthorized'});
            } else {
                const pics = doc.data().pics
                console.error('pics = ', pics)

                for (var pic in pics){
                    var picName = pics[pic]
                    admin
                        .storage()
                        .bucket()
                        .file(picName)
                        .delete()
                }

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