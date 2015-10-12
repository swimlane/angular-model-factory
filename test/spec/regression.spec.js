'use strict';

/*
  Regression tests that emerge from GitHub issues. Their main purpose is to identify
  a bug and make sure it won't be introduced any more
*/

describe('A person model defined using modelFactory', function() {
    var Department;
    var $httpBackend;

    beforeEach(angular.mock.module('modelFactory'));

    beforeEach(function() {
        angular.module('test-module', ['modelFactory'])
            .factory('Department', function($modelFactory) {
                var model = $modelFactory('department', {
                    pk: 'ID',

                    actions: {
                        // base: {
                        //     override: true
                        // },
                        'lookup': {
                            url: 'Lookups',
                            cache: true,
                            method: 'GET',
                            params: {
                                Range: 'All'
                            }
                        },

                        '$saveChanges': {
                            url: '{id}/changes',
                            method: 'POST'
                        }
                    }
                });

                return model;
            });
    });

    beforeEach(angular.mock.module('test-module'));

    beforeEach(inject(function(_$httpBackend_, _Department_) {
        $httpBackend = _$httpBackend_;
        Department = _Department_;
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should correctly override the defaults with the passed data', function(){
        var customParam = 'test';

        $httpBackend.expectGET('department/Lookups?Range=' + customParam).respond(200, {
            id: 1,
            name: 'Human resources'
        });

        Department.lookup({ Range: customParam });

        $httpBackend.flush();
    });

    it('should properly send the content in the body', function() {
        var someDepartment = new Department({ id: 123, name: 'Human Resources' });
        var objToSend = { test: 'abc', isValid: true };

        $httpBackend.expectPOST('department/123/changes', JSON.stringify(objToSend)).respond(200);
        someDepartment.$saveChanges(objToSend);

        $httpBackend.flush();
    });

});