'use strict';

let express = require('express');
let router = express.Router();
let authController = require('./auth/authController');
let userController = require('./user/userController');

// Auth route
router.use('/auth', require('./auth/index'));

// Auth check for all routes
router.use(authController.isBearerAuthenticated);

// Ride route paths
router.use('/rides', require('./ride/index'));


module.exports = router;
