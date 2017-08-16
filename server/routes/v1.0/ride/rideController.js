'use strict';
// Load required packages
let Ride = require('./rideModel');
let uberController = require('../uber/uberAPIController');

let convertToRideModel = function (rideObj) {
    return new Ride({
        requestId: rideObj.request_id,
        requestTime: rideObj.request_time,
        startTime: rideObj.start_time,
        endTime: rideObj.end_time,
        status: rideObj.status,
        distance: rideObj.distance,
        productId: rideObj.product_id,
        startCity: {
            name: rideObj.start_city.display_name,
            lat: rideObj.start_city.latitude,
            lng: rideObj.start_city.longitude
        }
    });
};

let getById = exports.getById = function (req, res, next, id) {
    Ride.findOne({_id: id}).exec(function(err, result) { 
        if(!err && result) {
            req.__orig = result;
            next();
        } else {
            err = new Error("Ride not found !");
            err.status = 404;
            next(err);
        }
    });
};

let getByRideReqId = exports.getByRideReqId = function (req, res, next, id) {
    Ride.findOne({requestId: id}).exec(function(err, result) { 
        if(!err && result) {
            req.__orig = result;
            next();
        } else {
            err = new Error("Ride not found !");
            err.status = 404;
            next(err);
        }
    });
};

let getLastRide = exports.getLastRide = function (req, res, next) {
    Ride.findOne({isDeleted: false}).sort('-endTime').exec(function(err, result) { 
        if(!err && result) {
            req.__lastRide = result;
            next();
        } else {
            err = new Error("Ride not found !");
            err.status = 404;
            next(err);
        }
    });
};

exports.add = function (req, res, next) {
    let ride = new Ride(req.body);
    ride.save(function(error, result){
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
};

exports.updateNew = function (req, res, next) {
    // see if sync needed
    if (req.query.refresh === "true") {
        getLastRide(req, res, function (err) {
            let lastRideEndTime = err ? 0 : req.__lastRide.endTime,
                rides = [];

            req.__rides.forEach(function (rideObj) {
                if (rideObj.end_time > lastRideEndTime) {
                    rides.push(convertToRideModel(rideObj));
                }
            });

            if (rides.length === 0) {
                // Go to next middleware if no new rides
                next();
            } else {
                Ride.create(rides, function(error, result) {
                    if(!error && result) {
                        next();
                    }
                    else if(error && error.message.indexOf("duplicate key error") >= 0) {
                        error.status = 400;
                        next(error);
                    }
                    else {
                        next(error);
                    }
                });
            }
        });
    } else {
        next();
    }
};

exports.post = function(req, res, next) {
    let ride = new Ride(req.body);
    ride.save(function(err, result){
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

exports.isRefreshReqd = function (req, res, next) {
    // see if sync needed
    if (req.query.refresh === "true") {
        uberController.getHistory(req, res, next);
    } else {
        next();
    }
};

exports.get = function(req, res, next) {
    var sortObj = {
        endTime: -1
    };
    // If sort params sent in request
    if (req.query.sortOn) {
        sortObj = {};
        sortObj[req.query.sortOn] = req.query.sortOrder || 'asc';
    }

    Ride.paginate({isDeleted: false}, { 
        page: parseInt(req.query.offset/req.query.max) + 1, 
        limit: parseInt(req.query.max),
        sort: sortObj
    }, function(err, records) {
        if(!err) {
            res.send({
                records: records.docs,
                totalRecords: records.total
            });
        }
        else {
            next(err);
        }
    
    });
};