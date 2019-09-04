const { admin, db } = require('../util/admin');
const config = require('../util/config');
const firebase = require('firebase');
firebase.initializeApp(config);

const { validateSignupData, validateLoginData } = require('../util/validate');

exports.signup = (req, res) => {
    const newUser = {
        email: req.body.email, 
        password: req.body.password, 
        confirmPw: req.body.confirmPw, 
        username: req.body.username, 
    };

    const { valid, errors } = validateSignupData(newUser);

    if(!valid) return res.status(400).json(errors);


    let token, userId;
    db.doc(`/users/${newUser.username}`).get()
        .then(doc => {
            if(doc.exists){
                return res.status(400).json({ username: 'this username is already taken'});
            } else{
                return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
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
                userId: userId
            };
            return db.doc(`/users/${newUser.username}`).set(userCreds);
        })
        .then(() => {
            return res.status(201).json({ token });
        })
        .catch(err => {
            console.error(err);
            if(err.code === 'auth/email-already-in-use'){
                return res.status(400).json({ email: 'email already in use'});
            } else {
                return res.status(500).json({ error: err.code});
            }
        });
}

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
                return res.
                    status(403)
                    .json({ general: 'Wrong credentials, please try again'});
            } else return res.status(500).json({ error: err.code}); 
        });
}

//npm install --save busboy
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
        console.log(fieldname);
        console.log(filename);
        console.log(mimetype);
        // my.image.png
        const imageExtension = filename.split('.')[filename.split('.').length - 1];
        // 726437292.png
        const imageFileName = `${Math.round(Math.random() *  1000000000)}.${imageExtension}`;
        const filepath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = { filepath, mimetype };

        file.pipe(fs.createWriteStream(filepath));
    });
    busboy.on('finish', () => {
        admin.storage().bucket().upload(imageToBeUploaded.filepath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        })
        .then(() => {
            //construct img URL to link to user 
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`
            return db.doc(`/users/${req.user.username}`).update({ imageUrl} );
        })
        .then(() => {
            return res.json({ msg: 'Image uploaded successfuly'});
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code});
        })
    })
}