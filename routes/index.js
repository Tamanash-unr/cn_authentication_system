// Require Express and setup Router
const express = require('express');
const router = express.Router();

// Require Contoller for Home Page
const home_controller = require('../controller/home_controller')

// Setup Route for Homepage
router.get('/', home_controller.home);

// Setupr Route for Users
router.use('/users', require('./users'));

module.exports = router;