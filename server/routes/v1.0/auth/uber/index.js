'use strict';

let express = require('express');
let router = express.Router();
let controller = require('../../uber/uberAPIController');
let authController = require('../authController');

// Login route
let route = router.route('/login');
route.post(function(req, res, next){
		next();
	},
	authController.isAuthenticated,
	controller.authenticate
);

route = router.route('/callback');
route.get(controller.callbackFromUber);

module.exports = router;