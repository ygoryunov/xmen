(function () {
  'use strict';

  angular
    .module('xmens')
    .controller('XmensListController', XmensListController);

  XmensListController.$inject = ['XmensService'];

  function XmensListController(XmensService) {
    var vm = this;

    vm.xmens = XmensService.query();
    //vm.count = XmensService.count();
  }
})();
