const isEmpty = (string) => {
    //eliminate white spaces
    if(string.trim() === '') return true;
    else return false;
};

const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(regEx)) return true;
    else return false;
};

exports.validateSignupData = (data) => {
    let errors = {};

    //validate data
    if(isEmpty(data.email)){
        errors.email = 'Must not be empty';
    } else if(!isEmail(data.email)){
        errors.email = 'Must be a valid email address';
    } else if(data.email.split("@")[1] !== 'berkeley.edu'){
        errors.email = 'Must be a Berkeley e-mail (@berkeley.edu)';
    }


    if(isEmpty(data.password)) errors.password = 'Must not be empty';
    if(data.password !== data.confirmPw) errors.confirmPw = 'Passwords must match';
    if(isEmpty(data.username)) errors.username = 'Must not be empty';

    return{
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
};

exports.validateLoginData = (data) => {
    let errors = {};
    if(isEmpty(data.email)) errors.email = 'Must not be empty';
    if(isEmpty(data.password)) errors.password = 'Must not be empty';

    return{
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
};

exports.reduceUserDetails = (data) => {
    let userDetails = {};

    if(!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
    if(!isEmpty(data.website.trim())) {
        //add https:// if not in input
        if(data.website.trim().substring(0,4) !== 'http'){
            userDetails.website = `http://${data.website.trim()}`;
        }else userDetails.website = data.website;
    }

    if(!isEmpty(data.location.trim())) userDetails.location = data.location;

    return userDetails;
};