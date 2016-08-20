(function () {
  'use strict';

  describe('Xmens Route Tests', function () {
    // Initialize global variables
    var $scope,
      XmensService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _XmensService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      XmensService = _XmensService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('xmens');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/xmens');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          XmensController,
          mockXmen;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('xmens.view');
          $templateCache.put('modules/xmens/client/views/view-xmen.client.view.html', '');

          // create mock Xmen
          mockXmen = new XmensService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Xmen Name'
          });

          //Initialize Controller
          XmensController = $controller('XmensController as vm', {
            $scope: $scope,
            xmenResolve: mockXmen
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:xmenId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.xmenResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            xmenId: 1
          })).toEqual('/xmens/1');
        }));

        it('should attach an Xmen to the controller scope', function () {
          expect($scope.vm.xmen._id).toBe(mockXmen._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/xmens/client/views/view-xmen.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          XmensController,
          mockXmen;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('xmens.create');
          $templateCache.put('modules/xmens/client/views/form-xmen.client.view.html', '');

          // create mock Xmen
          mockXmen = new XmensService();

          //Initialize Controller
          XmensController = $controller('XmensController as vm', {
            $scope: $scope,
            xmenResolve: mockXmen
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.xmenResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/xmens/create');
        }));

        it('should attach an Xmen to the controller scope', function () {
          expect($scope.vm.xmen._id).toBe(mockXmen._id);
          expect($scope.vm.xmen._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/xmens/client/views/form-xmen.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          XmensController,
          mockXmen;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('xmens.edit');
          $templateCache.put('modules/xmens/client/views/form-xmen.client.view.html', '');

          // create mock Xmen
          mockXmen = new XmensService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Xmen Name'
          });

          //Initialize Controller
          XmensController = $controller('XmensController as vm', {
            $scope: $scope,
            xmenResolve: mockXmen
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:xmenId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.xmenResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            xmenId: 1
          })).toEqual('/xmens/1/edit');
        }));

        it('should attach an Xmen to the controller scope', function () {
          expect($scope.vm.xmen._id).toBe(mockXmen._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/xmens/client/views/form-xmen.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
