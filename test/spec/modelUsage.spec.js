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
                expect(modelList[0].$save).toBeDefined();
            });

            // TODO this one fails...clarify whether it is intended behavior
            xit('should allow to define an empty list', function() {
                var newEmptyList = new PersonModel.List();
                expect(newEmptyList).toBeDefined();
                expect(newEmptyList.length).toEqual(0);
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

        });

    });

    describe('with defaults specified', function() {

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



});