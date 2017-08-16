var express = require('express');
var router = express.Router();
var controller = require('./rideController');

// Routes
var route = router.route('/');
route.get(controller.isRefreshReqd, controller.updateNew, controller.get);

router.param('id', controller.getById);
route = router.route('/:id');
route.get(function(req, res, next) {
  res.send(req.__orig);
});

module.exports = router;