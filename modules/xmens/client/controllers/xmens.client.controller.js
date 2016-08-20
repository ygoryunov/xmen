(function () {
  'use strict';

  // Xmens controller
  angular
    .module('xmens')
    .controller('XmensController', XmensController);

  XmensController.$inject = ['$scope', '$state', 'Authentication', 'xmenResolve', 'TeamsService'];

  function XmensController ($scope, $state, Authentication, xmen, TeamsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.xmen = xmen;
    vm.teams = TeamsService.query();
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Xmen
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.xmen.$remove($state.go('xmens.list'));
      }
    }

    // Save Xmen
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.xmenForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.xmen._id) {
        vm.xmen.$update(successCallback, errorCallback);
      } else {
        vm.xmen.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('xmens.view', {
          xmenId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
