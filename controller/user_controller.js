const User = require("../models/user");
const env = require('../config/environment');
const fs = require('fs');
const path = require('path');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const queue = require('../config/kue');
const resetLinkWorker = require('../worker/resetLink_email_worker');

module.exports.showResetPassword = function(req, res){
    return res.render('user_ResetPassword', {
        title: "Authsys | Reset Password"
    })
}

module.exports.resetPassword = function(req, res) {
    User.findById(req.params.id).then((user)=>{
        if(user){
            if(user.password == CryptoJS.MD5(req.body.currentPassword).toString()){
                if(req.body.newPassword == req.body.confirmPassword){
                    user.password = CryptoJS.MD5(req.body.newPassword).toString();
                    user.save();

                    req.flash('success', "Passwords changed Successfully!");
                    return res.redirect('/');
                } else {
                    req.flash('error', "Passwords do not Match!");
                    return res.redirect('back');
                }
            } else {
                req.flash('error', "Incorrect Current Password");
                return res.redirect('back');
            }            
        } else {
            req.flash('error', "User Not Found");
            console.log('user not found:', req.params.id)
        }
    }).catch((err)=>{
        req.flash('error', err);
        console.log("failed to find user:", err);
    })
}

// Render Sign Up
module.exports.signUp = function(req, res) {
    if(req.isAuthenticated()){
        req.flash('warning', "Already Logged In!");
        return res.redirect('/users/profile');
    }

    return res.render('user_SignUp', {
        title: "Authsys | Sign Up"
    })
}

// Render Sign In 
module.exports.signIn = function(req, res) {
    if(req.isAuthenticated()){
        req.flash('warning', "Already Logged In!");
        return res.redirect('/users/profile');
    }    
    
    return res.render('user_SignIn', {
        title: "Authsys | Sign In"
    })
}

// Create User in DB on Sign Up
module.exports.createUser = function(req, res) {
    if(req.body.password != req.body.confirmPassword){
        console.log(req.body)
        console.log("Passwords do not Match - Redirecting..")
        req.flash('error', "Passwords do not Match!")
        return res.redirect('back');
    }

    console.log("Searching for User..")

    User.findOne({email: req.body.email}).then((user)=>{
        if(!user){
            User.create({
                email: req.body.email,
                password: CryptoJS.MD5(req.body.password).toString(),
                name: req.body.name,
            }).then((user)=>{
                if(user){
                    console.log("User Created :", user);
                    req.flash('success', "User Created! You can now Sign In");

                    return res.redirect('/users/sign-in');
                } else {
                    return res.redirect('back');
                }
            }).catch((err)=>{
                if(err){
                    req.flash('error', err)
                    console.log("Error in Creating User on Sign Up :", err);
                }
            })
        } else {
            req.flash('error', "User Already Exists!")
            return res.redirect('back');
        }
    }).catch((err)=>{
        if(err){
            req.flash('error', err)
            console.log("Error Occured on Signing Up :", err);
        }
    })
}

// Handle User Sign In
module.exports.createUserSession = function(req, res) {
    req.flash('success', 'Logged in Successfully!');

    return res.redirect('/');
}

// Handle User Sign Out
module.exports.destroySession = function(req,res){
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', 'You have logged out!');
        res.redirect('/');
    });
}

// Handle Forgot Password
module.exports.forgotPassword = function(req, res){
    if(req.body.email == ''){
        return res.json(400, {
            message:{
                type:'error',
                text:'Enter Email!'
            }
        });
    }

    User.findOne({email: req.body.email}).then((user)=>{
        if(user){
            const token = jwt.sign({_id: user._id}, env.jwt_secretKey, {expiresIn: '5m'});

            let job = queue.create('emails', {user, token}).save(function(err){
                if(err){
                    console.log('Error in adding to queue:', err);
                    return;
                }
        
                console.log("Job Enqueued:", job.id);
            });

            user.resetLink = token;
            user.save();

            return res.json(200, {
                message:{
                    type:'success',
                    text:'Password Reset Link has been sent to email!'
                }
            });
        } else {
            return res.json(400, {
                message:{
                    type:'error',
                    text:'Email does not exist!'
                }
            });
        }
    })
}

module.exports.showUpdatePassword = function(req, res){
    User.findOne({resetLink: req.params.token}).select('email').then((user)=>{
        if(user){
            return res.render('user_UpdatePassword', {
                title: 'Authsys | Forgot Password',
                token: req.params.token,
                email: user.email
            });
        } else {
            return res.render('user_UpdatePassword', {
                title: 'Authsys | Forgot Password',
                token: req.params.token,
                email: 'Invalid'
            });
        }
    });
}

module.exports.updateForgotPassword = function(req, res){
    jwt.verify(req.params.token, env.jwt_secretKey, function(error, decodedData){
       if(error){
        req.flash('error', "Token Invalid or Expired!");
        return res.redirect('back');
       }

        User.findOne({resetLink: req.params.token}).then((user)=>{
            if(user){
                if(req.body.newPassword == req.body.confirmPassword){
                    user.password = CryptoJS.MD5(req.body.newPassword).toString();
                    user.save()

                    req.flash('success', "Password changed successfully!");
                    return res.redirect('/users/sign-in');
                } else {
                    req.flash('error', "Passwords do not match!");
                    return res.redirect('back');
                }

                return res.redirect('back');
            } else {
                req.flash('error', "No user found with given Token!");
                return res.redirect('back');
            }
        });
    })
}