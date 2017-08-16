'use strict';
// Load required packages
let User = require('./userModel');

let getById = exports.getById = function (req, res, next, id) {
    User.findOne({_id: id}).exec(function(err, result) { 
        if(!err && result) {
            req.__orig = result;
            next();
        } else {
            err = new Error("User not found !");
            err.status = 404;
            next(err);
        }
    });
};

let getByExternalId = exports.getByExternalId = function (req, res, next, id) {
    User.findOne({externalUuid: id}).exec(function(err, result) { 
        if(!err && result) {
            req.__orig = result;
            next();
        } else {
            err = new Error("User not found !");
            err.status = 404;
            next(err);
        }
    });
};

exports.findOrCreate = function (req, res, next, id) {
    getByExternalId(req, res, function (err) {
        if(!err && req.__orig) {
            next();
        } else if (err && err.status === 404) {
            let user = new User(req.body);
            user.save(function(error, result){
                if(!error && result) {
                    req.__orig = result;
                    next();
                }
                else if(error.message.indexOf("duplicate key error") >= 0) {
                    error.status = 400;
                    next(error);
                }
                else {
                    next(error);
                }
            });
        }
    }, id);
};

exports.post = function(req, res, next) {
    let user = new User(req.body);
    user.save(function(err, result){
        if(!err) {
            // sendInviteEmail(req, res, function () {
                res.send(result);
            // });
        }
        else if(err.message.indexOf("duplicate key error") >= 0) {
            res.status(400).send(err);
        }
        else {
            next(err);
        }
    });
};

exports.get = function(req, res, next) {
    User.paginate({isDeleted: false}, { 
        page: parseInt(req.query.offset/req.query.max) + 1, 
        limit: parseInt(req.query.max),
    }, function(err, records, pageCount, itemCount) {
        if(!err) {
            res.send({
                records: records.docs,
                totalRecords: itemCount
            });
        }
        else {
            next(err);
        }
    
    });
};

exports.put = function(req, res, next) {
    let user = new User(req.body);
    req.__orig.merge(user);
    req.__orig.save(function(err, u){
        if(!err) {
            res.send(u);
        }
        else if(err.message.indexOf("duplicate key error") >= 0) {
            res.status(400).send(err);
        }
        else {
            next(err);
        }
    });
};

exports.delete = function(req, res, next) {
    let user = req.__orig;
    User.update({_id: user.id}, { isDeleted: true }, function (err, result) {
        if(!err) {
            res.send({
                message: "User removed successfully"
            });
        }
        else if(err.message.indexOf("duplicate key error") >= 0) {
            res.status(400).send(err);
        }
        else {
            next(err);
        }
    });
};

exports.hardDelete = function(req, res, next) {
    let user = req.__orig;
    User.remove({_id: user.id}, function(err, result){
        if(!err) {
            res.send({
                message: "User removed permanently"
            });
        }
        else if(err.message.indexOf("duplicate key error") >= 0) {
            res.status(400).send(err);
        }
        else {
            next(err);
        }
    });
};