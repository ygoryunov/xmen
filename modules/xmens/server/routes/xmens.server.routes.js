'use strict';

/**
 * Module dependencies
 */
var xmensPolicy = require('../policies/xmens.server.policy'),
  xmens = require('../controllers/xmens.server.controller');

module.exports = function(app) {
  // Xmens Routes
  app.route('/api/xmens').all(xmensPolicy.isAllowed)
    .get(xmens.list)
    .post(xmens.create);

  app.route('/api/xmens/:xmenId').all(xmensPolicy.isAllowed)
    .get(xmens.read)
    .put(xmens.update)
    .delete(xmens.delete);

  // Finish by binding the Xmen middleware
  app.param('xmenId', xmens.xmenByID);
};