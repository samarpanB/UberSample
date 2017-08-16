"use strict";

let UserModel = require('../user/userModel');
let ClientModel = require('../auth/authClientModel');
let AccessTokenModel = require('../auth/accessTokenModel');
let RefreshTokenModel = require('../auth/refreshTokenModel');
let Log = require('log'), log = new Log();
let mongoose = require('mongoose'); 
let db = require('../../../connections/dbGeneral');
let webClient = require('../../../common/constants/appConstants').webClient;
let async = require("async");

async.parallel([
    function(cb) {
        ClientModel.remove({}, function(err) {
            let client = new ClientModel(webClient);
            client.save(function(err, client) {
                if(err) {
                    log.error(err);
                    return cb();
                }
                log.info(webClient.name + " client created.");
                cb();
            });
        });
    },
    function(cb) {
        AccessTokenModel.remove({}, function (err) {
            cb();
        });
    },
    function(cb) {
        RefreshTokenModel.remove({}, function (err) {
            cb();
        });
    }
], function() {
    db.close();
    log.info("All done. Closing db connection now.");
});