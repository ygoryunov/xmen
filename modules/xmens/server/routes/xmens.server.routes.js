'use strict';

/**
 * Module dependencies
 */
var xmensPolicy = require('../policies/xmens.server.policy'),
  xmens = require('../controllers/xmens.server.controller');

module.exports = function(app) {
  // Xmens Routes
  app.route('/api/xmens/crud').all(xmensPolicy.isAllowed)
    .get(xmens.list)
    .post(xmens.create);

  app.route('/api/xmens/crud/:xmenId').all(xmensPolicy.isAllowed)
    .get(xmens.read)
    .put(xmens.update)
    .delete(xmens.delete);

  app.route('/api/xmens/count').all(xmensPolicy.isAllowed)
    .get(xmens.count);

  app.route('/api/xmens/team/:teamId').all(xmensPolicy.isAllowed)
    .get(xmens.listByTeam);


  // Finish by binding the Xmen middleware
  app.param('xmenId', xmens.xmenByID);
  app.param('teamId', xmens.listByTeam);

};
