'use strict';

let express = require('express');
let router = express.Router();
let controller = require('./authController');
let oauthController = require('./oauth2Controller');
let uberAuthController = require('../uber/uberAPIController');
let webClient = require('../../../common/constants/appConstants').webClient;

router.use('/uber', require('./uber/index'));

// Login route
let route = router.route('/login');
route.post(function(req, res, next){
		req.body.grant_type = "password";
		next();
	},
	controller.isAuthenticated,
	uberAuthController.exchange,
	oauthController.token
);

// Extend session route
route = router.route('/extendsession');
route.post(function(req, res, next){
		req.body.grant_type = "refresh_token";
		req.body.refresh_token = req.body.refreshToken;
		next();
	},
	controller.isAuthenticated, 
	oauthController.token
);

// Logout route
route = router.route('/logout');
route.post(
	controller.isBearerAuthenticated, 
	controller.logout
);

module.exports = router;