'use strict';

/*
    High level unit/acceptance tests that
    simulate the usage of modelFactory from the perspective
    of a developer/library user, without testing
    the inner workings of the modelFactory service.
*/

describe('A person model defined using modelFactory', function() {
    var PersonModel;

    beforeEach(angular.mock.module('modelFactory'));

    describe('with the default configuration', function() {

        beforeEach(function() {
            angular.module('test-module', ['modelFactory'])
                .factory('PersonModel', function($modelFactory) {
                    return $modelFactory('/api/people');
                });
        });

        beforeEach(angular.mock.module('test-module'));

        beforeEach(inject(function(_PersonModel_) {
            PersonModel = _PersonModel_;
        }));

        describe('when creating a new instance using the "new" keyword', function() {
            var theModel;

            beforeEach(function() {
                theModel = new PersonModel();
            });

            it('we should get a proper instance', function() {
                expect(theModel).toBeDefined();
            });

            it('should have a $save function', function() {
                expect(theModel.$save).toBeDefined();
            });

        });

        describe('when using the list helper', function() {
            var modelList;

            beforeEach(function() {
                modelList = new PersonModel.List([{
                    name: 'Juri'
                }]);
            });

            it('should instantiate a new model list with some predefined objects', function() {
                expect(modelList).toBeDefined();
                expect(modelList.length).toEqual(1);
            });

            it('should contain wrapped model objects', function() {
                expect(modelList[0] instanceof PersonModel).toBeTruthy();
            });

            // TODO this doesn't work right now...should it??
            it('should wrap newly added JavaScript objects', function(){
                modelList.push({
                    name: 'Tom'
                });

                expect(modelList[1] instanceof PersonModel).toBeTruthy();
            });

            it('should account for Array.push(obj1, obj2,...) API; all passed obj should be wrapped as models', function(){
                var newList = new PersonModel.List();

                // act
                newList.push(
                    {
                        name: 'Juri'
                    },
                    {
                        name: 'Austin'
                    });

                // assert
                expect(newList.length).toEqual(2);
                expect(newList[0] instanceof PersonModel).toBeTruthy();
                expect(newList[1] instanceof PersonModel).toBeTruthy();
            });

            it('should allow to define an empty list', function() {
                var newEmptyList = new PersonModel.List();
                expect(newEmptyList).toBeDefined();
                expect(newEmptyList.length).toEqual(0);
            });

            it('should allow to add elements on a previously empty model list collection', function(){
                var newList = new PersonModel.List();

                newList.push({ name: 'Juri' });
                expect(newList.length).toEqual(1);
                expect(newList[0] instanceof PersonModel).toBeTruthy(); // wrapping should still work
            });

            it('should allow to add new models', function() {

                modelList.push({
                    name: 'Anna'
                });

                expect(modelList.length).toEqual(2);
            });

        });

        describe('when calling query()', function() {
            var $httpBackend,
                backendListResponse;

            beforeEach(inject(function(_$httpBackend_) {
                $httpBackend = _$httpBackend_;

                backendListResponse = [{
                    name: 'Juri'
                }, {
                    name: 'Jack'
                }, {
                    name: 'Anne'
                }];
            }));

            afterEach(function() {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            it('should return a list of people', function() {
                PersonModel.query()
                    .then(function(peopleList) {

                        expect(peopleList).toBeDefined();
                        expect(peopleList.length).toEqual(3);

                    });

                $httpBackend.expectGET('/api/people').respond(200, backendListResponse);
                $httpBackend.flush();
            });

            it('should properly send parameters', function() {
                PersonModel.query({
                    name: 'Juri',
                    age: 29
                });

                $httpBackend.expectGET('/api/people?name=Juri&age=29').respond(200, backendListResponse);
                $httpBackend.flush();
            });

        });

        describe('when calling get(..)', function() {
            var $httpBackend;

            beforeEach(inject(function(_$httpBackend_) {
                $httpBackend = _$httpBackend_;

                $httpBackend
                    .whenGET('/api/people/123')
                    .respond({
                        id: 123,
                        name: 'Juri'
                    });
            }));

            afterEach(function() {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });


            it('should return the requested resource by its id (as number)', function() {
                PersonModel.get(123)
                    .then(function(theFetchedPerson) {
                        expect(theFetchedPerson).toBeDefined();
                        expect(theFetchedPerson.name).toEqual('Juri');
                    });

                $httpBackend.expectGET('/api/people/123');
                $httpBackend.flush();
            });

            it('should return the requested resource by its id (as string)', function() {
                PersonModel.get('123')
                    .then(function(theFetchedPerson) {
                        expect(theFetchedPerson).toBeDefined();
                        expect(theFetchedPerson.name).toEqual('Juri');
                    });

                $httpBackend.expectGET('/api/people/123');
                $httpBackend.flush();
            });

            xit('should return the requested resource by its id when passing it as object', function() {
                PersonModel.get({
                    id: 123
                });

                $httpBackend.expectGET('/api/people/123');
                $httpBackend.flush();
            });

        });

        describe('when calling $save()', function() {
            var $httpBackend;

            beforeEach(inject(function(_$httpBackend_) {
                $httpBackend = _$httpBackend_;
            }));

            afterEach(function() {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            it('should execute a POST when we have a new model', function() {
                var newModel = new PersonModel({
                    name: 'Juri'
                });

                $httpBackend.expectPOST('/api/people', JSON.stringify(newModel)).respond(200, '');

                // act
                newModel.$save();
                $httpBackend.flush();
            });

            it('should execute a PUT when we have an existing model', function() {
                var newModel = new PersonModel({
                    id: 123,
                    name: 'Juri'
                });

                $httpBackend.expectPUT('/api/people/123', JSON.stringify(newModel)).respond(200, '');

                // act
                newModel.$save();
                $httpBackend.flush();
            });

            it('should update the entry with the new results from the server', function(){
                var newModel = new PersonModel({
                    name: 'Juri'
                });

                $httpBackend.expectPOST('/api/people', JSON.stringify(newModel)).respond(200, JSON.stringify({id: 12, name: 'Juri Strumpflohner'}));

                //act
                newModel.$save();
                $httpBackend.flush();

                expect(newModel.id).toEqual(12);
                expect(newModel.name).toEqual('Juri Strumpflohner');
            });

        });

        describe('when calling $revert', function(){

            it('should revert to the previous values of the object', function(){
                var newModel = new PersonModel({
                    name: 'Juri'
                });

                // act
                newModel.name = 'Jack';
                newModel.$revert();

                expect(newModel.name).toEqual('Juri');
            });

            xit('should NOT revert to the old values after an entity has been persisted with $save', inject(function($httpBackend){
                var newModel = new PersonModel({
                    name: 'Juri'
                });

                newModel.name = 'Jack';

                // persist it
                newModel.$save();

                $httpBackend
                    .expectPOST('/api/people')
                    .respond(200, JSON.stringify({ id: 1, name: 'Jack'}));
                $httpBackend.flush();

                // act
                newModel.$revert();

                // assert
                expect(newModel.name).toEqual('Jack'); // there is nothing to revert 'cause the model is fresh from the server'
            }));

        });

        describe('when deleting an object', function() {
            var $httpBackend;

            beforeEach(inject(function(_$httpBackend_) {
                $httpBackend = _$httpBackend_;
            }));

            afterEach(function() {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });


            it('should properly execute a DELETE request', function(){
                var theModel = new PersonModel({
                    id: 1234
                });

                // act
                theModel.$destroy();

                $httpBackend.expectDELETE('/api/people/1234').respond(200,'');
                $httpBackend.flush();
            });

            it('should remove the deleted object from a model list when the deletion succeeds', function(){
                var modelList = new PersonModel.List([
                    {
                        id: 1,
                        name: 'Juri'
                    },
                    {
                        id: 2,
                        name: 'Jack'
                    },
                    {
                        id: 3,
                        name: 'Austin'
                    }
                    ]);

                // act
                modelList[1].$destroy();


                $httpBackend.expectDELETE('/api/people/2').respond(200, '');
                $httpBackend.flush();

                expect(modelList.length).toEqual(2);
            });

            it('should NOT remove the deleted object from a model list when the deletion fails', function(){
                var modelList = new PersonModel.List([
                    {
                        id: 1,
                        name: 'Juri'
                    },
                    {
                        id: 2,
                        name: 'Jack'
                    },
                    {
                        id: 3,
                        name: 'Austin'
                    }
                    ]);

                // act
                modelList[1].$destroy();


                $httpBackend.expectDELETE('/api/people/2').respond(500, '');
                $httpBackend.flush();

                expect(modelList.length).toEqual(3);
            });

        });

    });

    describe('with defaults', function() {

        beforeEach(function() {
            angular.module('test-module', ['modelFactory'])
                .factory('PersonModel', function($modelFactory) {
                    return $modelFactory('/api/people', {
                        defaults: {
                            age: 18 //stupid example I know :)
                        }
                    });
                });
        });

        beforeEach(angular.mock.module('test-module'));

        beforeEach(inject(function(_PersonModel_) {
            PersonModel = _PersonModel_;
        }));

        it('should have them properly set when instantiating a new empty object', function() {
            var personWithDefaults = new PersonModel();

            expect(personWithDefaults.age).toEqual(18);
        });

        it('should use the defaults when creating an object with some data', function() {
            var personWithDefaults = new PersonModel({
                name: 'Juri'
            });

            expect(personWithDefaults.age).toEqual(18);
        });

        it('should set the defaults when creating a list', function() {
            var personWithDefaultsList = new PersonModel.List([{
                name: 'Juri'
            }]);

            expect(personWithDefaultsList[0].age).toEqual(18);
        });

        it('should not overwrite with the default when passing a value for it', function() {
            var personWithDefaults = new PersonModel({
                name: 'Juri',
                age: 29
            });

            expect(personWithDefaults.age).toEqual(29);
        });

    });

    describe('with custom actions', function() {
        var $httpBackend;

        beforeEach(function() {
            angular.module('test-module', ['modelFactory'])
                .factory('PersonModel', function($modelFactory) {
                    return $modelFactory('/api/people', {
                        actions: {
                            queryChildren: {
                                type: 'GET',
                                url: 'children',
                                isArray: true
                            }
                        }
                    });
                });
        });

        beforeEach(angular.mock.module('test-module'));

        beforeEach(inject(function(_PersonModel_, _$httpBackend_) {
            PersonModel = _PersonModel_;
            $httpBackend = _$httpBackend_;
        }));

        it('should correctly call the defined url', function(){
            PersonModel.queryChildren();
            $httpBackend.expectGET('/api/people/children').respond(200, []);
            $httpBackend.flush();
        })

        // BUG: the query params are not passed. should the HTTP method be passed
        // as type: 'GET' or method: 'GET'?
        xit('should allow to specify query parameters', function(){

            PersonModel.queryChildren({ type: 'minor' });

            $httpBackend.expectGET('/api/people/children?type=minor').respond(200, '');
            $httpBackend.flush();
        });

        it('should wrap the returned objects', function(){

            PersonModel.queryChildren()
                .then(function(result){
                    expect(result.length).toBe(1);
                    expect(result[0] instanceof PersonModel).toBeTruthy(); // check whether it's a model
                });

            $httpBackend.expectGET('/api/people/children').respond(200, [
                {
                    type: 'minor',
                    name: 'Juri'
                }
                ]);
            $httpBackend.flush();
        });

    });

});