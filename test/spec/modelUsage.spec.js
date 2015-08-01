/// <reference path="../../typings/jasmine/jasmine.d.ts"/>
'use strict';

/*
    High level unit/acceptance tests that
    simulate the usage of modelFactory from the perspective
    of a developer/library user, without testing
    the inner workings of the modelFactory service.
*/

describe('A person model defined using modelFactory', function() {
    var PersonModel, PersonWithMapModel;


    beforeEach(angular.mock.module('modelFactory'));

    describe('with the default configuration', function() {

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

        beforeEach(inject(function(_PersonModel_, _PersonWithMapModel_) {
            PersonModel = _PersonModel_;
            PersonWithMapModel = _PersonWithMapModel_;
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
            it('should wrap newly added JavaScript objects', function() {
                modelList.push({
                    name: 'Tom'
                });

                expect(modelList[1] instanceof PersonModel).toBeTruthy();
            });

            it('should account for Array.push(obj1, obj2,...) API; all passed obj should be wrapped as models', function() {
                var newList = new PersonModel.List();

                // act
                newList.push({
                    name: 'Juri'
                }, {
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

            it('should allow to add elements on a previously empty model list collection', function() {
                var newList = new PersonModel.List();

                newList.push({
                    name: 'Juri'
                });
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

                $httpBackend.expectGET('/api/people?age=29&name=Juri').respond(200, backendListResponse);
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

            it('should allow to add additional query params', function(){
                PersonModel.get('123', { age: 29 });

                $httpBackend.expectGET('/api/people/123?age=29').respond({
                    id: 1,
                    age: 29
                });
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

        describe('when calling $update()', function() {

            it('should update the existing model properties with the new ones', function() {
                var newModel = new PersonModel({
                    name: null
                });

                var newModelUpdate = new PersonModel({
                    name: 'elec29a',
                    language: {
                      de: 'hallo'
                    }
                });

                //act
                newModel.$update(newModelUpdate);

                expect(newModel.name).toEqual('elec29a');
                expect(newModel.language).toBeDefined();
                expect(newModel.language.de).toEqual('hallo');
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

            it('should update the entry with the new results from the server', function() {

                var children = {
                    count: 1
                };

                var newModel = new PersonModel({
                    name: 'Juri',
                    kids: children
                });

                $httpBackend.expectPOST('/api/people', JSON.stringify(newModel)).respond(200, JSON.stringify({
                    id: 12,
                    name: 'Juri Strumpflohner',
                    kids: { count: 99 }
                }));

                //act
                newModel.$save();
                $httpBackend.flush();

                expect(newModel.id).toEqual(12);
                expect(newModel.name).toEqual('Juri Strumpflohner');

                // Make sure object references are not lost
                expect(newModel.kids).toBe(children);
                expect(children.count).toEqual(99);
            });

            it('Should overwrite array properties with the returned server version on update', function() {

                // Set PersonModel object with an array property
                var people = [];
                people.push(new PersonModel({
                        name: 'Ryan'
                    }
                ));
                people.push(new PersonModel({
                        name: 'Austin'
                    }
                ));
                var newModel = new PersonModel({
                    friends: people
                });

                // Create a changed array to return which has an extra element
                var sender = people.slice().reverse();
                sender.push(new PersonModel( { name: 'Juri'}));

                $httpBackend.expectPOST('/api/people', JSON.stringify(newModel)).respond(200, JSON.stringify({
                    friends: sender
                }));

                //act
                newModel.$save();
                $httpBackend.flush();

                // Arrays should be exactly as returned
                expect(newModel.friends.length).toBe(3);
                expect(newModel.friends[1].name).toBe('Ryan');
            });

            it('on a copied model it should sent back the copied model data', function(){
                var newModel = new PersonModel({
                    name: 'Juri'
                });

                var copied = angular.copy(newModel);
                copied.name = 'Austin'; //change something in the clone

                $httpBackend.expectPOST('/api/people', JSON.stringify(copied)).respond(200, '');


                copied.$save();
                $httpBackend.flush();
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

        });

        describe('when calling $rollback', function() {

            it('should revert to the previous values of the object', function() {
                var newModel = new PersonModel({
                    name: 'Juri'
                });

                // act
                newModel.name = 'Jack';
                newModel.$rollback();

                expect(newModel.name).toEqual('Juri');
            });

            xit('should NOT revert to the old values after an entity has been persisted with $save', inject(function($httpBackend) {
                var newModel = new PersonModel({
                    name: 'Juri'
                });

                newModel.name = 'Jack';

                // persist it
                newModel.$save();

                $httpBackend
                    .expectPOST('/api/people')
                    .respond(200, JSON.stringify({
                        id: 1,
                        name: 'Jack'
                    }));
                $httpBackend.flush();

                // act
                newModel.$rollback();

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


            it('should properly execute a DELETE request', function() {
                var theModel = new PersonModel({
                    id: 1234
                });

                // act
                theModel.$destroy();

                $httpBackend.expectDELETE('/api/people/1234').respond(200, '');
                $httpBackend.flush();
            });

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

            it('should properly execute a correct DELETE request with a different PK name', function(){
                var theModel = new PersonWithMapModel({
                    fooId: 1234
                });

                // act
                theModel.$destroy();

                $httpBackend.expectDELETE('/api/peoplemodified/1234').respond(200, '');
                $httpBackend.flush();
            });

            it('should remove the deleted object from a model list when the deletion succeeds', function() {
                var modelList = new PersonModel.List([{
                    id: 1,
                    name: 'Juri'
                }, {
                    id: 2,
                    name: 'Jack'
                }, {
                    id: 3,
                    name: 'Austin'
                }]);

                // act
                var modelToDelete = modelList[1];
                modelToDelete.$destroy();

                // assert
                $httpBackend.expectDELETE('/api/people/2').respond(200, '');
                $httpBackend.flush();

                expect(modelList.length).toEqual(2);
                expect(modelList[0].id).toEqual(1);
                expect(modelList[1].id).toEqual(3);
            });

            it('should remove the deleted object even if the list order changed', function() {
                var modelList = new PersonModel.List([{
                    id: 1,
                    name: 'Juri'
                }, {
                    id: 2,
                    name: 'Otto'
                }, {
                    id: 3,
                    name: 'Austin'
                }]);

                var modelToDelete = modelList[1];

                // resort the list s.t. the array indices change..
                modelList.sort(function(a, b){
                    return a.name.localeCompare(b.name);
                });

                // act
                modelToDelete.$destroy();

                // should still delete "Otto"
                $httpBackend.expectDELETE('/api/people/2').respond(200, '');
                $httpBackend.flush();

                expect(modelList.length).toEqual(2);
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

            it('should NOT remove the deleted object from a model list when the deletion fails', function() {
                var modelList = new PersonModel.List([{
                    id: 1,
                    name: 'Juri'
                }, {
                    id: 2,
                    name: 'Jack'
                }, {
                    id: 3,
                    name: 'Austin'
                }]);

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

    describe('backend URL resolution', function() {
        var $httpBackend;

        beforeEach(function() {
          angular.module('test-module', ['modelFactory'])
              .factory('PersonModel', function($modelFactory) {
                  return $modelFactory('/api/people', {
                      actions: {

                          // static
                          queryChildren: {
                              url: 'children',
                              isArray: true
                          },

                          getById: {
                              url: 'child/{id}/some/subpath'
                          },

                          getByName: {
                              url: 'child/{name}/some/subpath'
                          },

                          // instance function
                          '$serverCopy': {
                              method: 'POST',
                              url: 'copy/{name}'
                          },

                          '$customUpdate': {
                              method: 'PUT',
                              url: 'update/{name}'
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

        it('should work with GET and id variable', function(){
            PersonModel.getById({ id: 123 });

            $httpBackend.expectGET('/api/people/child/123/some/subpath').respond(200, []);
            $httpBackend.flush();
        });

        it('should work with GET and name variable', function(){
            PersonModel.getByName({ name: 'juri' });

            $httpBackend.expectGET('/api/people/child/juri/some/subpath').respond(200, []);
            $httpBackend.flush();
        });

        it('should work with POST and name variable', function(){
            var person = new PersonModel({
              name: 'juri'
            });

            person.$serverCopy();

            $httpBackend.expectPOST('/api/people/copy/juri').respond(200, []);
            $httpBackend.flush();
        });

        it('should work with PUT and name variable', function(){
            var person = new PersonModel({
              name: 'juri'
            });

            person.$customUpdate();

            $httpBackend.expectPUT('/api/people/update/juri').respond(200, []);
            $httpBackend.flush();
        });

    });

    describe('with custom actions', function() {
        var $httpBackend;

        beforeEach(function() {
            angular.module('test-module', ['modelFactory'])
                .factory('PersonModel', function($modelFactory) {
                    return $modelFactory('/api/people', {
                        actions: {

                            // static
                            queryChildren: {
                                url: 'children',
                                isArray: true
                            },

                            // instance function
                            '$serverCopy': {
                                method: 'POST',
                                url: 'copy'
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

        it('should correctly call the defined url', function() {
            PersonModel.queryChildren();
            $httpBackend.expectGET('/api/people/children').respond(200, []);
            $httpBackend.flush();
        });

        it('should allow to specify query parameters', function() {

            PersonModel.queryChildren({
                type: 'minor'
            });

            $httpBackend.expectGET('/api/people/children?type=minor').respond(200, '');
            $httpBackend.flush();
        });

        it('should wrap the returned objects', function() {

            PersonModel.queryChildren()
                .then(function(result) {
                    expect(result.length).toBe(1);
                    expect(result[0] instanceof PersonModel).toBeTruthy(); // check whether it's a model
                });

            $httpBackend.expectGET('/api/people/children').respond(200, [{
                type: 'minor',
                name: 'Juri'
            }]);
            $httpBackend.flush();
        });

        it('should correctly invoke the custom model instance function', function() {
            var model = new PersonModel({
                name: 'Juri'
            });

            $httpBackend.expectPOST('/api/people/copy').respond(200, '');
            // act
            model.$serverCopy();
            $httpBackend.flush();
        });

    });

    describe('using the isArray property', function(){
        var AddressModel, $httpBackend;

        beforeEach(function() {
            angular.module('test-module', ['modelFactory'])
                .factory('AddressModel', function($modelFactory) {
                    return $modelFactory('/api/addresses', {
                        actions: {
                            'query': {
                                isArray: false
                            },

                            'myCustomAction': {
                                url: 'customAction',
                                isArray: false
                            }
                        }
                    });
                });
        });

        beforeEach(angular.mock.module('test-module'));

        beforeEach(inject(function(_AddressModel_, _$httpBackend_) {
            AddressModel = _AddressModel_;
            $httpBackend = _$httpBackend_;
        }));

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('when setting it to false should accept non-array responses', function(){
            AddressModel.query()
                .then(function(result){
                    expect(result.rows.length).toBe(1);
                    expect(result.numRecords).toBe(1);
                });

            $httpBackend.expectGET('/api/addresses').respond(200, { rows: [{ id: 1, street: 'test'}], numRecords: 1 });
            $httpBackend.flush();
        });

        it('when setting it to false on a custom action should accept non-array responses', function(){
            AddressModel.myCustomAction()
                .then(function(result){
                    expect(result.rows.length).toBe(1);
                    expect(result.numRecords).toBe(1);
                });

            $httpBackend.expectGET('/api/addresses/customAction').respond(200, { rows: [{ id: 1, street: 'test'}], numRecords: 1 });
            $httpBackend.flush();
        });

    });

    describe('when backend respond with metadata', function() {
        var StadiumModel, $httpBackend;

        beforeEach(function() {
            angular.module('test-module', ['modelFactory'])
                .factory('StadiumModel', function($modelFactory) {
                    return $modelFactory('/api/stadiums', {
                        actions: {
                            'base': {
                                afterRequest: function(response) {
                                    var transfrom = response.data;
                                    delete response.data;
                                    transfrom.meta = response;
                                    return transfrom;
                                }
                            },
                            'query': {
                                afterRequest: function(response) {
                                    var transfrom = response.data;
                                    transfrom.paginator = response.paginator;
                                    return transfrom;
                                }
                            },
                        }
                    });
                });
        });

        beforeEach(angular.mock.module('test-module'));

        beforeEach(inject(function(_StadiumModel_, _$httpBackend_) {
            StadiumModel = _StadiumModel_;
            $httpBackend = _$httpBackend_;
        }));

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('when backend respond with pagination ', function() {
            StadiumModel.query()
                .then(function(result) {
                    expect(result.length).toBe(3);
                    expect(result.paginator.limit).toBe(3);
                });

            $httpBackend.expectGET('/api/stadiums').respond(200, {
                'data': [{
                    'title': 'Accusantium rem magni accusantium placeat.'
                }, {
                    'title': 'Maxime ut eum pariatur magni quia iusto.'
                }, {
                    'title': 'Sapiente perferendis consectetur ut ipsa consectetur.'
                }],
                'paginator': {
                    'totalCount': 30,
                    'totalPage': 10,
                    'currentPage': 1,
                    'limit': 3
                }
            });
            $httpBackend.flush();
        });
        it('when backend respond with metadata ', function() {
            StadiumModel.get(1)
                .then(function(result) {
                    // console.log(result.meta);
                    expect(result.meta.status.code).toBe(1000);
                    // expect(result.paginator.limit).toBe(3);
                });

            $httpBackend.expectGET('/api/stadiums/1').respond(200, {
                'data': {
                    'title': 'Accusantium rem magni accusantium placeat.'
                },
                'status': {
                    'code': 1000
                }
            });
            $httpBackend.flush();
        });

    });

    describe('using the map property',function(){
        var PersonModel, $httpBackend;

         beforeEach(function() {
            angular.module('test-module', ['modelFactory'])
                .factory('PersonModel', function($modelFactory) {
                    return $modelFactory('/api/people',{
                        map:{
                            'id' : 'personId',
                            'address' :'street'
                        }
                    });
                });
        });

        beforeEach(angular.mock.module('test-module'));

        beforeEach(inject(function(_PersonModel_,_$httpBackend_) {
            PersonModel = _PersonModel_;
            $httpBackend = _$httpBackend_;
        }));

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('setting map, transpose `personId` to `id` and `street` to `address` on our instance', function(){
            PersonModel.query()
                .then(function(result){
                    expect(result[0].id).toBe(1);
                    expect(result[0].address).toBe('test');
                });

            $httpBackend.expectGET('/api/people').respond(200, [{ personId: 1, street: 'test'}]);
            $httpBackend.flush();
        });

    });

    describe('when the server returns an error response',function(){
        var PersonModel, $httpBackend;

         beforeEach(function() {
            angular.module('test-module', ['modelFactory'])
                .factory('PersonModel', function($modelFactory) {
                    return $modelFactory('/api/people');
                });
        });

        beforeEach(angular.mock.module('test-module'));

        beforeEach(inject(function(_PersonModel_,_$httpBackend_) {
            PersonModel = _PersonModel_;
            $httpBackend = _$httpBackend_;
        }));

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should not call the success callback', function(){
            PersonModel.query()
                .then(function(){
                    // this should never be executed
                    expect(false).toBeTruthy();
                });

            $httpBackend.expectGET('/api/people').respond(500);
            $httpBackend.flush();
        });

        it('should be passed to the error promise', function(){
            PersonModel.query()
                .then(function(){
                })
                .catch(function(response){
                    expect(response).toBeDefined();
                    expect(response.status).toEqual(500);
                });

            $httpBackend.expectGET('/api/people').respond(500);
            $httpBackend.flush();
        });

        it('should be possible to use the error callback instead of catch', function(){
            PersonModel.query()
                .then(function(){
                }, function(response){
                    expect(response).toBeDefined();
                    expect(response.status).toEqual(500);
                });

            $httpBackend.expectGET('/api/people').respond(500);
            $httpBackend.flush();
        });

    });

    describe('using the model instance features',function(){
        var Contact, Phone, Address;

         beforeEach(function() {
            angular.module('test-module', ['modelFactory'])
                .factory('Contact', function($modelFactory, Address) {
                    var model = $modelFactory('contacts', {
                        pk: 'Id',
                        map: {
                            Addresses: Address.List
                        },
                        defaults: {
                            GivenName: '',
                            FamilyName: '',
                            Addresses: []
                        },
                        instance: {
                            addAddress: function (options) {
                                this.Addresses.push(new Address(options));
                            },
                            removeAddress: function (address) {
                                this.Addresses.splice(this.Addresses.indexOf(address), 1);
                            }
                        }
                    });

                    return model;
                })
                .factory('Address', function ($modelFactory, Phone) {
                    var model = $modelFactory('Address', {
                        pk: 'Id',
                        map: {
                            Phones: Phone.List
                        },
                        defaults: {
                            Line1: '',
                            Phones: []
                        },
                        instance: {
                            addPhone: function (options) {
                                this.Phones.push(new Phone(options));
                            },
                            removePhone: function (phone) {
                                this.Phones.splice(this.Phones.indexOf(phone), 1);
                            }
                        }
                    });

                    return model;
                })
                .factory('Phone', function($modelFactory){
                    return $modelFactory('', {
                        pk: 'Id',
                        defaults: {
                            Type: 'Mobile',
                            PhoneCode: '1',
                            Number: '',
                            Extension: '',
                            IsPrimary: false
                        }
                    });
                });
        });

        beforeEach(angular.mock.module('test-module'));

        beforeEach(inject(function(_Contact_, _Phone_, _Address_) {
            Contact = _Contact_;
            Phone = _Phone_;
            Address = _Address_;
        }));

        it('should work with addresses',function(){
            var address = new Address();
            expect(address).toBeDefined();

            address.addPhone();

            var anotherAddress = new Address();
            anotherAddress.addPhone();

            expect(address.Phones.length).toEqual(1);
            expect(anotherAddress.Phones.length).toEqual(1);
        });

        it('multiple nesting of Models and Model collections through map', function(){
            var contact = new Contact();

            contact.addAddress({ Line1: '123 Main St'});

            expect(contact.Addresses.length).toEqual(1);
            expect(contact.Addresses[0].Line1).toEqual('123 Main St');
            expect(contact.Addresses[0].Phones.length).toEqual(0);
        });

    });

    describe('regression test',function(){
        var Contact, Phone, Address;

         beforeEach(function() {
            angular.module('test-module', ['modelFactory'])
                .factory('Contact', function($modelFactory, Address) {
                    var model = $modelFactory('contacts', {
                        pk: 'Id',
                        map: {
                            Addresses: Address.List
                        },
                        defaults: {
                            GivenName: '',
                            FamilyName: '',
                            Addresses: []
                        },
                        instance: {
                            addAddress: function (options) {
                                this.Addresses.push(new Address(options));
                            },
                            removeAddress: function (address) {
                                this.Addresses.splice(this.Addresses.indexOf(address), 1);
                            }
                        }
                    });

                    return model;
                })
                .factory('Address', function ($modelFactory, Phone) {
                    var model = $modelFactory('address', {
                        pk: 'Id',
                        map: {
                            Phone: Phone
                        },
                        defaults: {
                            Line1: ''
                        }
                    });

                    return model;
                })
                .factory('Phone', function($modelFactory){
                    return $modelFactory('phone', {
                        pk: 'Id',
                        defaults: {
                            Type: 'Mobile',
                            PhoneCode: '1',
                            Number: '',
                            Extension: '',
                            IsPrimary: false
                        }
                    });
                });
        });

        beforeEach(angular.mock.module('test-module'));

        beforeEach(inject(function(_Contact_, _Phone_, _Address_) {
            Contact = _Contact_;
            Phone = _Phone_;
            Address = _Address_;
        }));

        it('should work with addresses',function(){
            var contact = new Contact();

            contact.addAddress({
                Line1: '123 Main St',
                Phone: {
                    Number: '112233'
                }
            });

            expect(contact.Addresses.length).toEqual(1);
            expect(contact.Addresses[0].Line1).toEqual('123 Main St');
            expect(contact.Addresses[0].Phone.Number).toEqual('112233');
        });

    });

});
