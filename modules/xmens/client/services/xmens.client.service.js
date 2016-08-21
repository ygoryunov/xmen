//Xmens service used to communicate Xmens REST endpoints
(function () {
  'use strict';

  angular
    .module('xmens')
    .factory('XmensService', XmensService);

  XmensService.$inject = ['$resource'];

  function XmensService($resource) {
    return $resource('api/xmens/crud/:xmenId', {
      xmenId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
