(function () {
  'use strict';

  angular
    .module('folders')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Folders',
      state: 'folders',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'folders', {
      title: 'List Folders',
      state: 'folders.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'folders', {
      title: 'Create Folder',
      state: 'folders.create',
      roles: ['user']
    });
  }
})();
