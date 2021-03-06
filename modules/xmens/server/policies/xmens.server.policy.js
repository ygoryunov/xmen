'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Xmens Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/xmens/crud',
      permissions: '*'
    }, {
      resources: '/api/xmens/crud/:xmenId',
      permissions: '*'
    }, {
      resources: '/api/xmens/count',
      permissions: '*'
    }, {
      resources: '/api/xmens/team/:teamId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/xmens/crud',
      permissions: ['get', 'post']
    }, {
      resources: '/api/xmens/crud/:xmenId',
      permissions: ['get']
    }, {
      resources: '/api/xmens/count',
      permissions: ['get']
    }, {
      resources: '/api/xmens/team/:teamId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/xmens/crud',
      permissions: ['get']
    }, {
      resources: '/api/xmens/crud/:xmenId',
      permissions: ['get']
    }, {
      resources: '/api/xmens/count',
      permissions: ['get']
    }, {
      resources: '/api/xmens/team/:teamId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Xmens Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Xmen is being processed and the current user created it then allow any manipulation
  if (req.xmen && req.user && req.xmen.user && req.xmen.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
