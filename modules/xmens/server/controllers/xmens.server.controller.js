'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Xmen = mongoose.model('Xmen'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Xmen
 */
exports.create = function(req, res) {
  var xmen = new Xmen(req.body);
  xmen.user = req.user;

  xmen.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(xmen);
    }
  });
};

/**
 * Show the current Xmen
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var xmen = req.xmen ? req.xmen.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  xmen.isCurrentUserOwner = req.user && xmen.user && xmen.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(xmen);
};

/**
 * Update a Xmen
 */
exports.update = function(req, res) {
  var xmen = req.xmen ;

  xmen = _.extend(xmen , req.body);

  xmen.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(xmen);
    }
  });
};

/**
 * Delete an Xmen
 */
exports.delete = function(req, res) {
  var xmen = req.xmen ;

  xmen.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(xmen);
    }
  });
};

/**
 * List of Xmens
 */
exports.list = function(req, res) { 
  Xmen.find().sort('-created').populate('user', 'displayName').exec(function(err, xmens) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(xmens);
    }
  });
};

/**
 * Xmen middleware
 */
exports.xmenByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Xmen is invalid'
    });
  }

  Xmen.findById(id).populate('user', 'displayName').exec(function (err, xmen) {
    if (err) {
      return next(err);
    } else if (!xmen) {
      return res.status(404).send({
        message: 'No Xmen with that identifier has been found'
      });
    }
    req.xmen = xmen;
    next();
  });
};
