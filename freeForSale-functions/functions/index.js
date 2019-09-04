const functions = require('firebase-functions');
const admin = require('firebase-admin');
//express
const app = require('express')();

admin.initializeApp();

var firebaseConfig = {
    apiKey: "AIzaSyBXS4rqKQYhY0HlBVT_YEgp7i18DfOaIT8",
    authDomain: "freeforsale-227d7.firebaseapp.com",
    databaseURL: "https://freeforsale-227d7.firebaseio.com",
    projectId: "freeforsale-227d7",
    storageBucket: "freeforsale-227d7.appspot.com",
    messagingSenderId: "506630593887",
    appId: "1:506630593887:web:84597ec0a867dde9"
  };

//firebase
const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);

const db = admin.firestore();

//first parameter = name of the route, second = the handler
app.get('/posts', (req, res) => {
    db
        .collection('posts')
        .orderBy('createdAt', 'desc')
        .get()
        .then(data => {
            let posts = [];
            //populate posts array
            data.forEach(doc => {
                //doc.data = fn that returns data inside document
                posts.push({
                    postId: doc.id,
                    body: doc.data().body,
                    username: doc.data().username,
                    createdAt: doc.data().createdAt
                });
            });
            //return as a json
            return response.json(posts);
        })
        //return promise
        .catch(err => console.error(err));
});

app.post(`/post`, (request, response) => {
    const newPost = {
        //body property of the body of the request
        body: request.body.body,
        username: request.body.username,
        createdAt: new Date().toISOString
    };

    db
        .collection('posts')
        //takes json object and adds post
        .add(newPost)
        .then((doc) => {
            response.json({msg: `document ${doc.id} created successfully` });
        })  
        .catch((err) => {
            response.status(500).json({ error: 'something went wrong '});
            console.error(err);
        });
});

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

const isEmpty = (string) => {
    //eliminate white spaces
    if(string.trim() === '') return true;
    else return false;
}

const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(regEx)) return true;
    else return false;
}

//Signup route
app.post(`/signup`, (req, res) => {
    const newUser = {
        email: req.body.email, 
        password: req.body.password, 
        confirmPw: req.body.confirmPw, 
        username: req.body.username, 
    };

    let errors = {};

    //validate data
    if(isEmpty(newUser.email)){
        errors.email = 'Must not be empty';
    } else if(!isEmail(newUser.email)){
        errors.email = 'Must be a valid email address';
    }

    if(isEmpty(newUser.password)) errors.password = 'Must not be empty';
    if(newUser.password !== newUser.confirmPw) errors.confirmPassword = 'Passwords must match';
    if(isEmpty(newUser.username)) errors.username = 'Must not be empty';

    if(Object.keys(errors).length > 0) return res.status(400).json(errors);

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
});


//log-in route
app.post('/login', (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };
    
    let errors = {};
    if(isEmpty(user.email)) errors.email = 'Must not be empty';
    if(isEmpty(user.password)) errors.password = 'Must not be empty';

    if(Object.keys(errors).length > 0) return res.status(400).json(errors);

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then((data) => {
            return data.user.getIdToken();
        })
        .then((token) => {
            return res.json({token});
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code});
        });

});


//pass in app instead of one fn/route which automatically turns into multiple routes
exports.api = functions.https.onRequest(app);