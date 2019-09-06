const { admin, db } = require('../util/admin');
const config = require('../util/config');
const firebase = require('firebase');
firebase.initializeApp(config);

const { validateSignupData, validateLoginData, reduceUserDetails } = require('../util/validate');

/*** USER SIGN UP ***/
exports.signup = (req, res) => {
    const newUser = {
        email: req.body.email, 
        password: req.body.password, 
        confirmPw: req.body.confirmPw, 
        username: req.body.username, 
    };

    const { valid, errors } = validateSignupData(newUser);

    if (!valid) return res.status(400).json(errors);

    const noImg = 'no-img.png';

    let token, userId;
    db.doc(`/users/${newUser.username}`)
        .get()
        .then((doc) => {
            if(doc.exists){
                return res.status(400).json({ username: 'this username is already taken'});
            } else {
                return firebase
                    .auth()
                    .createUserWithEmailAndPassword(newUser.email, newUser.password);
            } 
        })
        .then((data) => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then((idToken) => {
            token = idToken;
            const userCreds = {
                username: newUser.username,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
                userId
            };
            return db.doc(`/users/${newUser.username}`).set(userCreds);
        })
        .then(() => {
            return res.status(201).json({ token });
        })
        .catch((err) => {
            console.error(err);
            if(err.code === 'auth/email-already-in-use'){
                return res.status(400).json({ email: 'email already in use'});
            } else {
                return res
                    .status(500)
                    .json({ general: 'Something went wrong, please try again'});
            }
        });
};

/*** USER LOGIN  ***/
exports.login = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };

    const { valid, errors } = validateLoginData(user);

    if(!valid) return res.status(400).json(errors);

    firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then((data) => {
            return data.user.getIdToken();
        })
        .then((token) => {
            return res.json({token});
        })
        .catch((err) => {
            console.error(err);
            if(err.code === 'auth/wrong-password'){
                //403 = unauthorized
                return res
                    .status(403)
                    .json({ general: 'Wrong credentials, please try again'});
            } else return res.status(500).json({ error: err.code}); 
        });
};

/*** ADD USER DETAILS ***/
exports.addUserDetails = (req, res) => {
    let userDetails = reduceUserDetails(req.body);
    db.doc(`/users/${req.user.username}`).update(userDetails)
        .then(() => {
            return res.json({ msg: 'Details added successfully'});
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({error: err.code});
        });
};

/*** GET ANY USER'S DETAILS */
exports.getUserDetails = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.params.username}`)
        .get()
        .then((doc) => {
            if(doc.exists){
                userData.user = doc.data();
                return db.collection('posts')
                    .where('username', '==', req.params.username)
                    .orderBy('createdAt', 'desc')
                    .get();
            } else {
                return res.status(404).json({ error: 'User not found'});
            }
        })
        .then((data) => {
            userData.posts = [];
            data.forEach((doc) => {
                userData.posts.push({
                    body: doc.data().body,
                    createdAt: doc.data().createdAt,
                    username: doc.data().username,
                    userImage: doc.data().userImage,
                    likeCount: doc.data().likeCount,
                    commentCount: doc.data().commentCount,
                    postId: doc.id
                })
            });
            return res.json(userData);
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

/*** GET OWN USER DETAILS ***/
exports.getAuthenticatedUser = (req, res) => {
    //response data obj we'll add to
    let userData = {};
    //get user
    db.doc(`/users/${req.user.username}`)
        .get()
        .then((doc) => {
            if(doc.exists){
                userData.creds = doc.data();
                return db.collection('likes').where('username', '==', req.user.username).get();

            }
        })
        .then((data) => {
            userData.likes = [];
            data.forEach(doc => {
                userData.likes.push(doc.data());
            });
            return db.collection('notifications')
                .where('recipient', '==', req.user.username)
                .orderBy('createdAt', 'desc')
                .limit(10)
                .get();
        })
        .then((data) => {
            userData.notifications = [];
            data.forEach((doc) => {
                userData.notifications.push({
                    recipient: doc.data().recipient,
                    sender: doc.data().sender,
                    createdAt: doc.data().createdAt,
                    postId: doc.data().postId,
                    type: doc.data().type,
                    read: doc.data().read,
                    notificationId: doc.id
                })
            });
            return res.json(userData);
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code});
        });
};

/*** UPLOAD USER PROFILE PIC 
    npm install --save busboy  ***/
exports.uploadPhoto = (req, res) => {
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    //filesystem
    const fs = require('fs');

    const busboy = new BusBoy({ headers: req.headers });
    
    let imageFileName;

    //initialize as empty object
    let imageToBeUploaded = {};

    //file event
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        
        if(mimetype !== 'image/jpeg' && mimetype !== 'image/png'){
            //status code 400 = bad request
            return res.status(400).json({ error: 'Wrong file type submitted'});
        } 
        
        // my.image.png
        const imageExtension = filename.split('.')[filename.split('.').length - 1];
        // 726437292.png
        imageFileName = `${Math.round(Math.random() *  1000000000).toString()}.${imageExtension}`;
        //upload to temp directory 
        const filepath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = { filepath, mimetype };
        file.pipe(fs.createWriteStream(filepath));
    });
    busboy.on('finish', () => {
        //upload image to bucket on firebase storage
        admin
            .storage()
            .bucket()
            .upload(imageToBeUploaded.filepath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        })
        .then(() => {
            //construct img URL to link to user 
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
            return db.doc(`/users/${req.user.username}`).update({ imageUrl });
        })
        .then(() => {
            return res.json({ msg: 'Image uploaded successfully'});
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: 'something went wrong'});
        });
    });
    //rawBody is a property that's in every request
    busboy.end(req.rawBody);
};

/*** Mark Notifications Read ***/
exports.markNotifsRead = (req, res) => {
    let batch = db.batch();
    req.body.forEach((notificationId) => {
        const notif = db.doc(`/notifications/${notificationId}`);
        batch.update(notif, { read: true });
    });
    batch.commit()
        .then(() => {
            return res.json({ msg: 'Notifications marked read'});
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};