const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const env = require('./environment');

// Tell Passport to use a new strategy for google login
passport.use(new googleStrategy({
        clientID: env.google_clientID,
        clientSecret: env.google_clientSecret,
        callbackURL: env.google_callbackURL
    },
    function(accessToken, refreshToken, profile, done){
        // Find a User
        User.findOne({email: profile.emails[0].value}).exec().then((user)=>{
            console.log(profile);

            if(user){
                // If found, set this user as req.user
                return done(null, user);
            } else {
                // If not found, create the user and set it as req.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    avatar: profile.photos[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }).then((user)=>{
                    return done(null, user);
                }).catch((error)=>{
                    console.log("Error in Creating User Google-Strategy-Passport:", error);
                    return;
                })
            }

        }).catch((error)=>{
            console.log("Error in Google-Strategy-Passport:", error);
            return;
        })
    }
))