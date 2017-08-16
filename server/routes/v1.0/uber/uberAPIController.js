'use strict';

let UserController = require('../user/userController');

let Uber = require('node-uber'),
	uber = new Uber({
	  client_id: 'NMKRYz73BALNmQ8x7mtxIJN8_-rQobru',
	  client_secret: 'lJVZE50DW9edMCKJPxaiEzRTYz3grzNEvWPIT7nC',
	  server_token: 'M-hQ2eagS3eKo2zWgZOZ8iyp5ArmwwEVpoqoS7pB',
	  redirect_uri: 'http://localhost:3000/api/v1.0/auth/uber/callback',
	  name: 'Sample App'
	});

exports.authenticate = function(req, res, next) {
	let url = uber.getAuthorizeUrl(['history','profile']);
  	res.send({
  		url: url
  	});
};

exports.callbackFromUber = function (request, response) {
	if (request.query.code) {
		// redirect the user back to your actual app
		response.redirect('http://localhost:8000/#!/authenticate?code=' + request.query.code);
	}
};

exports.exchange = function(request, response, next) {
	var client = request.user;
 	uber.authorizationAsync({authorization_code: request.body.code})
 	.spread(function(access_token, refresh_token, authorizedScopes, tokenExpiration) {
   	// store the user id and associated access_token, refresh_token, scopes and token expiration date
   	console.log('New access_token retrieved: ' + access_token);
   	console.log('... token allows access to scopes: ' + authorizedScopes);
   	console.log('... token is valid until: ' + tokenExpiration);
   	console.log('... after token expiration, re-authorize using refresh_token: ' + refresh_token);

   	uber.user.getProfileAsync().then(function (resp) {
   		let req = {
   			body: {
     			firstName: resp.first_name,
     			lastName: resp.last_name,
     			email: resp.email,
     			username: resp.email,
     			externalUuid: resp.uuid
     		}
   		};
   		UserController.findOrCreate(req, response, function (err) {
   			if (!err) {
   				request.body.username = req.__orig.email;
   				request.body.password = "empty";
   				next(null, client); // Pass the client info
   			}
   		}, resp.uuid);
   		
   	}, function (err) {
   		console.error(err);
   		next(err);
   	});
 	})
 	.error(function(err) {
   	console.error(err);
   	next(err);
 	});
};

exports.getHistory = function (req, res, next) {
  // if no query params sent, respond with Bad Request
  if (!req.query || !req.query.offset || !req.query.max) {
    res.sendStatus(400);
  } else {
    uber.user.getHistoryAsync(0, 1000).then(function (resp) {
      if (resp) {
        req.__rides = resp.history;
        next();
      } else {
        err = new Error("History not found !");
        err.status = 404;
        next(err);
      }
    }, function (err) {
      console.error(err);
      err.status = 500;
      next(err);
    });
  }
};