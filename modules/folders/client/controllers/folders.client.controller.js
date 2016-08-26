(function () {
  'use strict';

  // Folders controller
  angular
    .module('folders')
    .controller('FoldersController', FoldersController);

  FoldersController.$inject = ['$scope', '$state', 'Authentication', 'folderResolve'];

  function FoldersController ($scope, $state, Authentication, folder, folderId) {
    var vm = this;

    console.log($state.params);
    if ($state.params.pId !== undefined)
    {
      folder.parent = $state.params.pId;
    }
    vm.authentication = Authentication;
    vm.folder = folder;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    //console.log(vm.folder);
    // Remove existing Folder
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.folder.$remove($state.go('folders.list'));
      }
    }

    // Save Folder
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.folderForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.folder._id) {
        vm.folder.$update(successCallback, errorCallback);
      } else {
        vm.folder.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('folders.view', {
          folderId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
