
(function () {
  'use strict';

  angular
    .module('xmens')
    .factory('xmensService', xmensService);

  xmensService.$inject = ['$resource'];

  function xmensService($resource) {
    return $resource('api/xmens/team/:xmenTeamId', {
      xmenId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
