const passport = require('passport');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const env = require('./environment');

const User = require('../models/user');

let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.jwt_secretKey
}

passport.use(new JWTstrategy(opts, function(jwtPayload, done){

    User.findById(jwtPayload._id).then((user)=>{
        if(user){
            return done(null, user);
        } else {
            return done(null, false);
        }
    }).catch((err)=>{
        console.log("Error in finding user from JWT:", err);
        return;
    })
}));

module.exports = passport;