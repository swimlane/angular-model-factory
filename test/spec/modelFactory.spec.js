'use strict';

/*
  Specs that test the inner workings of the model-factory. Regression
  tests can be placed in here.
*/

describe('A person model defined using modelFactory', function() {
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

            var copied = newModel.$copy(); //angular.copy(newModel);
            copied.name = 'Austin';

            $httpBackend.expectPOST('/api/people', JSON.stringify(copied)).respond(200, '');

            copied.$save();
            $httpBackend.flush();
        });

        it('calling $save on it should submit the copied values', function() {
            var newModel = new PersonModel({
                name: 'Juri'
            });

            var copied = newModel.$copy(); //angular.copy(newModel);
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

            var copied = newModel.$copy(); // angular.copy(newModel);
            copied.id = 100;

            $httpBackend.expectDELETE('/api/people/100').respond(200, '');

            copied.$destroy();
            $httpBackend.flush();
        });

        it('calling $destroy on a model list entry should not have any effect on the list', function(){

            var modelList = new PersonModel.List([
                {
                    id: 1,
                    name: 'Juri'
                },
                {
                    id: 2,
                    name: 'Austin'
                },
                {
                    id: 3,
                    name: 'Tim'
                }
            ]);

            var copy = modelList[1].$copy(); // angular.copy(modelList[1]);

            $httpBackend.expectDELETE('/api/people/2').respond(200,'');

            copy.$destroy();
            $httpBackend.flush();

            expect(modelList.length).toEqual(3);
        });

    });

    describe('when calling $diff', function() {
        // Need to use `JSON.parse(JSON.stringify(...))` to clean up `deep-diff` array
        function toPlainObject(value) {
            return JSON.parse(JSON.stringify(value));
        }

        it('should return differences when model changed', function(){
            var model = new PersonModel({
                id: 1,
                name: 'Juri'
            });

            delete model.id;

            model.name = 'Marat';

            expect(toPlainObject(model.$diff())).toEqual([{
                kind: 'D',
                path: ['id'],
                lhs: 1
            }, {
                kind: 'E',
                path: ['name'],
                lhs: 'Juri',
                rhs: 'Marat'
            }]);
        });
    });
});
