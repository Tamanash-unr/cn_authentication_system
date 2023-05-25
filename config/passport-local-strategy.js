const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const CryptoJS = require('crypto-js');

const User = require('../models/user');

// Authentication using Passport
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
    },
    function(req, email, password, done){
        // Find User and Establish Identity
        User.findOne({email: email}).then((user)=>{
            if(!user || user.password != CryptoJS.MD5(password).toString()){
                console.log("Invalid Username/Password");
                req.flash('error', "Invalid Username/Password");
                return done(null, false);
            }

            return done(null, user);
        }).catch((err)=>{
            console.log('Error in finding user ---> Passport :', err);
            req.flash('error', err);
            return done(err);
        })
    }
))

// Serializing the user from the key to decide which key is to be kept in cookies
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// Deserializing the user from the key in the cookies
passport.deserializeUser(function(id, done){
    User.findById(id).then((user)=>{
        return done(null, user);
    }).catch((err)=>{
        console.log('Error in finding user ---> Passport :', err);
        return done(err);
    })
});

// Check if the user is Authenticated
passport.checkAuthentication = function(req, res, next){
    // If the user is signed in, then pass on the request to the next function (controller's action)
    if(req.isAuthenticated()){
        return next();
    }

    // If the user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        // req.user contains current signed in user from Session Cookie, we are setting it in the locals for the views
        res.locals.user = req.user;
    }

    next();
}


module.exports = passport;