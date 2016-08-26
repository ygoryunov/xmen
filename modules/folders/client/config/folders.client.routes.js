(function () {
  'use strict';

  angular
    .module('folders')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('folders', {
        abstract: true,
        url: '/folders',
        template: '<ui-view/>'
      })
      .state('folders.list', {
        url: '',
        templateUrl: 'modules/folders/client/views/list-folders.client.view.html',
        controller: 'FoldersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Folders List'
        }
      })
      .state('folders.create', {
        url: '/create?:pId',
        templateUrl: 'modules/folders/client/views/form-folder.client.view.html',
        controller: 'FoldersController',
        controllerAs: 'vm',
        resolve: {
          folderResolve: newFolder
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Folders Create'
        }
      })
      .state('folders.edit', {
        url: '/:folderId/edit',
        templateUrl: 'modules/folders/client/views/form-folder.client.view.html',
        controller: 'FoldersController',
        controllerAs: 'vm',
        resolve: {
          folderResolve: getFolder
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Folder {{ folderResolve.name }}'
        }
      })
      .state('folders.view', {
        url: '/:folderId',
        templateUrl: 'modules/folders/client/views/view-folder.client.view.html',
        controller: 'FoldersController',
        controllerAs: 'vm',
        resolve: {
          folderResolve: getFolder
        },
        data:{
          pageTitle: 'Folder {{ articleResolve.name }}'
        }
      });
  }

  getFolder.$inject = ['$stateParams', 'FoldersService'];

  function getFolder($stateParams, FoldersService) {
    return FoldersService.get({
      folderId: $stateParams.folderId
    }).$promise;
  }

  newFolder.$inject = ['$stateParams', 'FoldersService'];

  function newFolder($stateParams, FoldersService) {
    return new FoldersService();
  }

})();
