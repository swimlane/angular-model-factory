'use strict';

/*
  Specs that test the inner workings of the model-factory. Regression
  tests can be placed in here.
*/

describe('model-factory regression tests', function() {
    var PersonModel, PersonWithMapModel;
    var $httpBackend;

    beforeEach(angular.mock.module('modelFactory'));

    beforeEach(function() {
        angular.module('test-module', ['modelFactory'])
            .factory('PersonModel', function($modelFactory) {
                return $modelFactory('/api/people', {
                        actions: {
                            '$customDelete': {
                                method: 'DELETE',
                                url: 'customDelete/{id}'
                            }
                        }
                    });
            })
            .factory('PersonWithMapModel', function($modelFactory) {
                return $modelFactory('/api/peoplemodified', {
                    pk: 'fooId'
                });
            });
    });

    beforeEach(angular.mock.module('test-module'));

    beforeEach(inject(function(_$httpBackend_, _PersonModel_, _PersonWithMapModel_) {
        $httpBackend = _$httpBackend_;
        PersonModel = _PersonModel_;
        PersonWithMapModel = _PersonWithMapModel_;
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

    describe('the $destroy function', function(){

        // **TODO** move to separate spec file
        it('should not include any data in the request body', function(){
            var theModel = new PersonModel({
                id: 1234,
                name: 'Juri',
                age: 30
            });

            // act
            theModel.$destroy();

            $httpBackend.expect('DELETE', '/api/people/1234', null).respond(200, '');
            $httpBackend.flush();
        });

        it('should also properly remove an object that has just been added to the list before', function(){

            var modelList = new PersonModel.List([{
                id: 1,
                name: 'Juri'
            }]);


            // save a new model through the $save function
            var newModel = new PersonModel({ name: 'Tom' });
            newModel.$save()
                .then(function(){
                    // add it to the overall collection
                    modelList.push(newModel);

                    // act: delete the newly added model again
                    modelList[1].$destroy();
                });

            $httpBackend.expectPOST('/api/people').respond(200, JSON.stringify({ id: 111, name: 'Tom'}));
            $httpBackend.expectDELETE('/api/people/111').respond(200, '');
            $httpBackend.flush();

            // I'd expect that it is properly removed from it
            expect(modelList.length).toBe(1);
            expect(modelList[0].name).toEqual('Juri');
        });

        it('should not loose $$array reference when updating existing model', function (){
            var list = new PersonModel.List([
                {
                    id: 1,
                    name: 'Juri'
                }
            ]);

            var aPerson = new PersonModel({
                name: 'Jack'
            });

            aPerson.$save()
                .then(function() {
                    // add to list
                    list.push(aPerson);
                });
            $httpBackend.expectPOST('/api/people').respond(200, JSON.stringify({ id: 123, name: 'Jack' }));
            $httpBackend.flush();

            // save again
            aPerson.$save();
            $httpBackend.expectPUT('/api/people/123').respond(200, JSON.stringify({ id: 123, name: 'Jack'}));
            $httpBackend.flush();

            // now delete
            aPerson.$destroy();
            $httpBackend.expectDELETE('/api/people/123').respond(200, '');
            $httpBackend.flush();

            expect(list.length).toBe(1);
        });

        it('should also remove deleted models that have a different PK name', function(){
            var modelList = new PersonWithMapModel.List([{
                fooId: 112,
                name: 'Juri'
            }]);

            //act
            modelList[0].$destroy();

            $httpBackend.expectDELETE('/api/peoplemodified/112').respond(200, '');
            $httpBackend.flush();

            expect(modelList.length).toBe(0);
        });

        it('should not include any data in the request body for custom endpoints', function(){
            var theModel = new PersonModel({
                id: 1234,
                name: 'Juri',
                age: 30
            });

            // act
            theModel.$customDelete();

            $httpBackend.expect('DELETE', '/api/people/customDelete/1234', null).respond(200, '');
            $httpBackend.flush();
        });

    });

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

});
