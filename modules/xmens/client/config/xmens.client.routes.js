(function () {
  'use strict';

  angular
    .module('xmens')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('xmens', {
        abstract: true,
        url: '/xmens',
        template: '<ui-view/>'
      })
      .state('xmens.list', {
        url: '/crud',
        templateUrl: 'modules/xmens/client/views/list-xmens.client.view.html',
        controller: 'XmensListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Xmens List'
        }
      })
      .state('xmens.create', {
        url: '/crud/create',
        templateUrl: 'modules/xmens/client/views/form-xmen.client.view.html',
        controller: 'XmensController',
        controllerAs: 'vm',
        resolve: {
          xmenResolve: newXmen
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Xmens Create'
        }
      })
      .state('xmens.edit', {
        url: '/crud/:xmenId/edit',
        templateUrl: 'modules/xmens/client/views/form-xmen.client.view.html',
        controller: 'XmensController',
        controllerAs: 'vm',
        resolve: {
          xmenResolve: getXmen
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Xmen {{ xmenResolve.name }}'
        }
      })
      .state('xmens.view', {
        url: '/crud/:xmenId',
        templateUrl: 'modules/xmens/client/views/view-xmen.client.view.html',
        controller: 'XmensController',
        controllerAs: 'vm',
        resolve: {
          xmenResolve: getXmen
        },
        data:{
          pageTitle: 'Xmen {{ articleResolve.name }}'
        }
      });
  }

  getXmen.$inject = ['$stateParams', 'XmensService'];

  function getXmen($stateParams, XmensService) {
    return XmensService.get({
      xmenId: $stateParams.xmenId
    }).$promise;
  }

  newXmen.$inject = ['XmensService'];

  function newXmen(XmensService) {
    return new XmensService();
  }

})();
