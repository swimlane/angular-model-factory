'use strict';

/*
    High level unit/acceptance tests that
    simulate the usage of modelFactory from the perspective
    of a developer/library user, without testing
    the inner workings of the modelFactory service.
*/

describe('A person model defined using modelFactory', function(){
    var PersonModel;

    beforeEach(angular.mock.module('modelFactory'));

    beforeEach(function(){
        angular.module('test-module', ['modelFactory'])
            .factory('PersonModel', function($modelFactory){
                return $modelFactory('/api/people');
            });
    });

    beforeEach(angular.mock.module('test-module'));


    beforeEach(inject(function(_PersonModel_){
        PersonModel = _PersonModel_;
    }));

    describe('when creating a new instance using the "new" keyword', function(){
        var theModel;

        beforeEach(function(){
            theModel = new PersonModel();
        });

        it('we should get a proper instance', function(){
            expect(theModel).toBeDefined();
        });

        it('should have a $save function', function(){
            expect(theModel.$save).toBeDefined();
        });

    });

    describe('when using the list helper', function(){
        var modelList;

        beforeEach(function(){
            modelList = new PersonModel.List([
                {
                    name: 'Juri'
                }
            ]);
        });

        it('should instantiate a new model list with some predefined objects', function(){
            expect(modelList).toBeDefined();
            expect(modelList.length).toEqual(1);
        });

        it('should contain wrapped model objects', function(){
            expect(modelList[0].$save).toBeDefined();
        });

        // TODO this one fails...clarify whether it is intended behavior
        xit('should allow to define an empty list', function(){
            var newEmptyList = new PersonModel.List();
            expect(newEmptyList).toBeDefined();
            expect(newEmptyList.length).toEqual(0);
        });

        it('should allow to add new models', function(){

            modelList.push({
                name: 'Anna'
            });

            expect(modelList.length).toEqual(2);
        });

    });

    describe('when calling query()', function(){
        var $httpBackend;

        beforeEach(inject(function(_$httpBackend_){
            $httpBackend = _$httpBackend_;

            $httpBackend
                .whenGET('/api/people')
                .respond([
                    {
                        name: 'Juri'
                    },
                    {
                        name: 'Jack'
                    },
                    {
                        name: 'Anne'
                    }
                ]);
        }));

        afterEach(function(){
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should return a list of people', function(){
            PersonModel.query()
                .then(function(peopleList){

                    expect(peopleList).toBeDefined();
                    expect(peopleList.length).toEqual(3);

                });

            $httpBackend.expectGET('/api/people');
            $httpBackend.flush();
        });

    });

    describe('when calling get(..)', function(){
        var $httpBackend;

        beforeEach(inject(function(_$httpBackend_){
            $httpBackend = _$httpBackend_;

            $httpBackend
                .whenGET('/api/people/123')
                .respond({
                        id: 123,
                        name: 'Juri'
                    });
        }));

        afterEach(function(){
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should return the requested resource by its id (as number)', function(){
            PersonModel.get(123)
                .then(function(theFetchedPerson){
                    expect(theFetchedPerson).toBeDefined();
                    expect(theFetchedPerson.name).toEqual('Juri');
                });

            $httpBackend.expectGET('/api/people/123');
            $httpBackend.flush();
        });

        it('should return the requested resource by its id (as string)', function(){
            PersonModel.get('123')
                .then(function(theFetchedPerson){
                    expect(theFetchedPerson).toBeDefined();
                    expect(theFetchedPerson.name).toEqual('Juri');
                });

            $httpBackend.expectGET('/api/people/123');
            $httpBackend.flush();
        });

    });

    describe('when calling $save()', function(){
        var $httpBackend;

        beforeEach(inject(function(_$httpBackend_){
            $httpBackend = _$httpBackend_;
        }));

        afterEach(function(){
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should execute a POST when we have a new model', function(){
            var newModel = new PersonModel({
                    name: 'Juri'
                });

            $httpBackend.expectPOST('/api/people', JSON.stringify(newModel)).respond(200, '');

            // act
            newModel.$save();
            $httpBackend.flush();
        });

        it('should execute a PUT when we have an existing model', function(){
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