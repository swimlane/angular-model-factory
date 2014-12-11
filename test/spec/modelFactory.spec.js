'use strict';

/*
  Specs that test the inner workings of the model-factory. Regression
  tests can be placed in here.
*/

ddescribe('A person model defined using modelFactory', function() {
    var PersonModel;
    var $httpBackend;

    beforeEach(angular.mock.module('modelFactory'));

    beforeEach(function() {
        angular.module('test-module', ['modelFactory'])
            .factory('PersonModel', function($modelFactory) {
                return $modelFactory('/api/people');
            });
    });

    beforeEach(angular.mock.module('test-module'));

    beforeEach(inject(function(_$httpBackend_, _PersonModel_) {
        $httpBackend = _$httpBackend_;
        PersonModel = _PersonModel_;
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    // describe('when calling model.$strip', function(){
    //     it('should remove all model-factory specific functions', function(){
    //         var raw = {
    //             id: 1,
    //             name: 'Juri'
    //         };

    //         expect(new PersonModel(raw).$strip).toEqual(raw);
    //     });
    // });

    describe('when copying a model object', function() {

        it('calling $save on a new model should submit the copied values', function() {
            var newModel = new PersonModel({
                name: 'Juri'
            });

            var copied = angular.copy(newModel);
            copied.name = 'Austin';

            $httpBackend.expectPOST('/api/people', JSON.stringify(copied)).respond(200, '');

            copied.$save();
            $httpBackend.flush();
        });

        it('calling $save on it should submit the copied values', function() {
            var newModel = new PersonModel({
                name: 'Juri'
            });

            var copied = angular.copy(newModel);
            copied.name = 'Austin';

            $httpBackend.expectPOST('/api/people', JSON.stringify(copied)).respond(200, '');

            copied.$save();
            $httpBackend.flush();
        });

        it('calling $destroy on it should submit the copied values', function() {
            var newModel = new PersonModel({
                id: 1,
                name: 'Juri'
            });

            var copied = angular.copy(newModel);
            copied.id = 100;

            $httpBackend.expectDELETE('/api/people/100').respond(200, '');

            copied.$destroy();
            $httpBackend.flush();
        });

    });

});