// Require Libraries
const express = require('express');
const router = express.Router();
const passport = require('passport');

const user_controller = require('../controller/user_controller');

// Handle routes for Forgot Password
router.post('/forgot-password', user_controller.forgotPassword);
router.post('/update-password/:token', user_controller.updateForgotPassword);
router.get('/update-password/:token', user_controller.showUpdatePassword);

// Handle routes for reset password once user has logged in
router.get('/reset-password', passport.checkAuthentication ,user_controller.showResetPassword);
router.post('/reset-password/:id', passport.checkAuthentication ,user_controller.resetPassword);

// Handle Routes for Sign In and Sign Up
router.get('/sign-in', user_controller.signIn);
router.get('/sign-up', user_controller.signUp);

// Handle Route for Create User
router.post('/create-user', user_controller.createUser);

// Use Passport as a middleware to authenticate and create a user Session
router.post('/create-user-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'},
) ,user_controller.createUserSession);

// Use Passport Google OAuth for handling login/signup using Google
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), user_controller.createUserSession);

// Handle the Sign Out Route
router.get('/sign-out', user_controller.destroySession);

module.exports = router;