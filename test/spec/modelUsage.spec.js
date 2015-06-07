'use strict';

/*

# Angular Model Factory

Angular model-factory is a lightweight model layer that bridges the gap
between AngularJS and your RESTful APIs.

More infos can be found at the [official GitHub Repo](https://github.com/Swimlane/angular-model-factory).

*/

describe('A person model defined using modelFactory', function() {
    var PersonModel;

    beforeEach(angular.mock.module('modelFactory'));

/*
## Setting it up

Model-factory is based upon the concept of having a JavaScript object
upon which we can act to retrieve the according data. Meaning, if we have
an API `/api/v1/people`, we create (for instance) a model `PersonModel` which
wrapps all the interactions with that specific endpoint. The PersonModel object
already comes with **predefined static functions** to retrieve new instances and
**per-instance functions** to operate upon existing data.
 */

    describe('the angular-model-factory', function(){
        var module;

        beforeEach(function(){

            // First of all, we have to **reference the "modelFactory" module**
            // to make use of the services it comes with.
            module = angular.module('test-module', ['modelFactory']);
        });

        beforeEach(angular.mock.module('test-module'));


/*

## Define a new Model

 */

        describe('after defining a new model', function(){

            beforeEach(function(){
                // To define a new model, create a factory, import `$modelFactory` from
                // the angular-model-factory module and configure it.
                module.factory('PersonModel', function($modelFactory) {
                    // In the simplest scenario, simply define the endpoint
                    // url of the model.
                    return $modelFactory('/api/people');
                });

            });

            beforeEach(angular.mock.module('test-module'));

            beforeEach(inject(function(_PersonModel_) {
                PersonModel = _PersonModel_;
            }));

            it('you can simply create a new instance using the "new" keyword', function(){
                // Once you defined a model, it can simply be instantiated using the `new` keyword.
                var person = new PersonModel();

                expect(person).toBeDefined();
                expect(person instanceof PersonModel).toBeTruthy();
            });

            it('you can initialize the model with some data passed to the constructor', function(){

                // It is also possible to initialize the model directly with some
                // data by simply passing an object to the "constructor"...
                var person = new PersonModel({
                    name: 'Juri',
                    age: 30
                });

                expect(person.name).toBe('Juri');
                expect(person.age).toBe(30);
            });

            it('you can set model properties just like with any other JavaScript object', function(){
                var person = new PersonModel();

                // ...or simply set the data on the existing object.
                person.name = 'Juri';

                expect(person.name).toBe('Juri');
            });


            it('you can also use the $update function and pass in an entire object', function() {
                var newModel = new PersonModel({
                    name: null
                });

                var newModelUpdate = new PersonModel({
                    name: 'elec29a',
                    language: {
                      de: 'hallo'
                    }
                });

                // By using the `$update(someObj)` function, you can update a whole set of
                // properties by passing in the interested ones.
                newModel.$update(newModelUpdate);

                expect(newModel.name).toEqual('elec29a');
                expect(newModel.language).toBeDefined();
                expect(newModel.language.de).toEqual('hallo');
            });

/*
## Model Lists

Model Factory has build-in support for lists as well.

*/
            describe('instantiate a list by using the Model.List constructor', function() {
                var modelList;

                beforeEach(function() {
                    // You can define a new model list by creating a new instance of `PersonModel.List` instead of `PersonModel`. Then, instead of an object, pass in an array of objects.
                    modelList = new PersonModel.List([{
                        name: 'Juri'
                    }]);
                });

                it('should instantiate a new model list with some predefined objects', function() {
                    expect(modelList).toBeDefined();
                    expect(modelList.length).toEqual(1);
                });

                it('should contain wrapped model objects', function() {
                    // All JavaScript objects added to a Model list are automatically wrapped as instances
                    // of that model.
                    expect(modelList[0] instanceof PersonModel).toBeTruthy();
                });

                it('you can instantiate an empty list and add new objects later using push()', function() {

                    // Obviously it allows to define an empty list...
                    var newEmptyList = new PersonModel.List();

                    expect(newEmptyList).toBeDefined();
                    expect(newEmptyList.length).toEqual(0);

                    // ..where later in your application you push new objects into it using
                    // the `.push(...)` function as you normally would.
                    newEmptyList.push({
                        name: 'Juri'
                    });

                    expect(newEmptyList.length).toEqual(1);
                    expect(newEmptyList[0] instanceof PersonModel).toBeTruthy();
                });

                it('you can even push multiple objects separated by a comma', function() {
                    var newList = new PersonModel.List();

                    // You can even push multiple JavaScript objects to the `push(...)`
                    // function. Obviously, all of them will be wrapped as models.
                    newList.push({
                        name: 'Juri'
                    }, {
                        name: 'Austin'
                    });

                    expect(newList.length).toEqual(2);
                    expect(newList[0] instanceof PersonModel).toBeTruthy();
                    expect(newList[1] instanceof PersonModel).toBeTruthy();
                });

            });

/*
## Build-in REST comunication functions

Model factory not only encapsulates your backend communication in dedicated data
services, but it's main objective is to make any data exchange as easy as possible.

As such there are a couple of build-in functions.
 */
            describe('to contact the remote backend', function(){
                var $httpBackend,
                    backendMockResponse;

                beforeEach(inject(function(_$httpBackend_) {
                    $httpBackend = _$httpBackend_;

                    backendMockResponse = [{
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

                /*
                ### To fetch multiple records

                Use the static function `.query()` to fetch a list of records from the backend. In a REST
                like API this usually maps to `<baseurl>/entityname/`.

                 */
                describe('when you want to fetch multiple records', function(){
                    var backendMockResponse;

                    beforeEach(function() {
                        backendMockResponse = [{
                            name: 'Juri'
                        }, {
                            name: 'Jack'
                        }, {
                            name: 'Anne'
                        }];
                    });

                    it('you can use query() to fetch all of the records', function(){
                        // `PersonModel.query()` returns a promise which return a list of people where each
                        // entry is already wrapped as an instance of "PersonModel".
                        PersonModel.query()
                            .then(function(peopleList) {
                                expect(peopleList).toBeDefined();
                                expect(peopleList.length).toEqual(3);
                                expect(peopleList[0] instanceof PersonModel).toBeTruthy();
                            });

                        $httpBackend.expectGET('/api/people').respond(200, backendMockResponse);
                        $httpBackend.flush();
                    });

                    it('you can also pass an object to query(..) which will be passed as query params', function(){
                        // In order **to send additional parameters to your backend** (i.e. `/../people/?name=Juri...`),
                        // simply pass an object containing the desired params to the `query()` function.
                        PersonModel.query({
                            name: 'Juri',
                            age: 29
                        });

                        $httpBackend.expectGET('/api/people?name=Juri&age=29').respond(200, backendMockResponse);
                        $httpBackend.flush();
                    });

                });


/*
### To fetch a single record

To fetch a single instance of some record from your backend, you'd make a call to `<baseurl>/people/<id>`.
 */
                describe('when you want to fetch a single record from the backend', function(){

                    beforeEach(function() {
                        $httpBackend
                            .whenGET('/api/people/123')
                            .respond({
                                id: 123,
                                name: 'Juri'
                            });
                    });

                    it('you can use get(<id>) to fetch a single instance, usually identified by some id', function(){

                        // You can do this by using the `.get(123)` function.
                        PersonModel.get(123)
                            .then(function(theFetchedPerson) {
                                expect(theFetchedPerson).toBeDefined();
                                expect(theFetchedPerson.name).toEqual('Juri');
                            });

                        $httpBackend.expectGET('/api/people/123');
                        $httpBackend.flush();
                    });

                    it('you can also pass the id as a string', function(){
                        PersonModel.get('123')
                            .then(function(theFetchedPerson) {
                                expect(theFetchedPerson).toBeDefined();
                                expect(theFetchedPerson.name).toEqual('Juri');
                            });

                        $httpBackend.expectGET('/api/people/123');
                        $httpBackend.flush();
                    });

                    it('you can also pass additional params to you get call to apply further filters', function(){
                        // If you need, you can pass further filters to your `.get(..)` call as illustrated in the
                        // following piece of code.
                        PersonModel.get(123, { age: 29 });

                        $httpBackend
                            .whenGET('/api/people/123?age=29')
                            .respond({
                                id: 123,
                                name: 'Juri',
                                age: 29
                            });

                        $httpBackend.expectGET('/api/people/123?age=29');
                        $httpBackend.flush();
                    });
                });

/*

### Persisting data

The next step after knowing how to fetch data from the backend, is to learn
how you can save any modifications back to the server.

There are two build-in options:

- `$save()`
- `$destroy()`

*/
                describe('using $save()', function() {
                    var $httpBackend;

                    beforeEach(inject(function(_$httpBackend_) {
                        $httpBackend = _$httpBackend_;
                    }));

                    afterEach(function() {
                        $httpBackend.verifyNoOutstandingExpectation();
                        $httpBackend.verifyNoOutstandingRequest();
                    });

/*
#### Create and save a new object

*/

                    it('should execute a POST when we have a new model', function() {
                        // After creating a new model instance (as already illustrated before),
                        var newModel = new PersonModel({
                            name: 'Juri'
                        });

                        var postData = JSON.stringify(newModel);

                        // use `$save()` on that instance to send the data to your backend API.
                        newModel.$save();

                        // If the model is a new one, that is, it's primary key property (default: `id`) is not defined or equal to 0, calling `$save()` issues
                        // a `POST /api/people` request.
                        $httpBackend.expectPOST('/api/people', postData).respond(200, '');
                        $httpBackend.flush();
                    });

                    it('should execute a PUT when we have an existing model', function() {
                        // Instead, if the model represents an existing instance you previously
                        // fetched from the server (again, `id` > 0), then
                        var newModel = new PersonModel({
                            id: 123,
                            name: 'Juri'
                        });
                        var postData = JSON.stringify(newModel);

                        newModel.$save();

                        // a `PUT /api/people/<id>` will be executed.
                        $httpBackend.expectPUT('/api/people/123', postData).respond(200, '');
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

                        newModel.$save();
                        $httpBackend.flush();

                        // The cool thing is that the model will automatically be updated
                        // with the data sent back from the server.
                        expect(newModel.id).toEqual(12);
                        expect(newModel.name).toEqual('Juri Strumpflohner');

                        // It even takes care of your object references s.t. your two-way bindings
                        // won't be broken :).
                        expect(newModel.kids).toBe(children);
                        expect(children.count).toEqual(99);
                    });

                    // That works even with arrays. If you sent back an array within a model-factory instance
                    // that contains 2 elements and the server sends back another one, the same array on the
                    // client side will synch with the one returned by the server.
                    it('should overwrite array properties with the returned server version on update', function() {
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

                        var sender = people.slice().reverse();
                        sender.push(new PersonModel( { name: 'Juri'}));

                        $httpBackend.expectPOST('/api/people', JSON.stringify(newModel)).respond(200, JSON.stringify({
                            friends: sender
                        }));

                        //act
                        newModel.$save();
                        $httpBackend.flush();

                        expect(newModel.friends.length).toBe(3);
                        expect(newModel.friends[1].name).toBe('Ryan');
                    });

                });


/*
#### Delete an object

*/
                // If you want to delete an object instead, use the `$destroy()` function
                // on the object instance you'd like to remove.
                describe('using $destroy()', function() {
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

                        theModel.$destroy();

                        // That executes a `DELETE /api/people/<id>` request.
                        $httpBackend.expectDELETE('/api/people/1234').respond(200, '');
                        $httpBackend.flush();
                    });

                    it('should remove the deleted object from a model list when the deletion succeeds', function() {
                        // When you have a list of models, always using the `Model.List` constructor,...
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

                        // ...and you delete a model,
                        var modelToDelete = modelList[1];
                        modelToDelete.$destroy();

                        $httpBackend.expectDELETE('/api/people/2').respond(200, '');
                        $httpBackend.flush();

                        // it will automatically be removed from that list if the deletion
                        // succeeds, that is, the server returns a `HTTP 200 ok` response.
                        expect(modelList.length).toEqual(2);
                        expect(modelList[0].id).toEqual(1);
                        expect(modelList[1].id).toEqual(3);
                    });

                    // That works totally independent from the order of the objects in the list, obviously.
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

                        modelList.sort(function(a, b){
                            return a.name.localeCompare(b.name);
                        });

                        modelToDelete.$destroy();

                        $httpBackend.expectDELETE('/api/people/2').respond(200, '');
                        $httpBackend.flush();

                        expect(modelList.length).toEqual(2);
                    });

                    // On the other side, the model won't be removed from the list, if the deletion fails
                    // (the server returns a reponse code <> 200).
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


                        modelList[1].$destroy();

                        $httpBackend.expectDELETE('/api/people/2').respond(500, '');
                        $httpBackend.flush();

                        expect(modelList.length).toEqual(3);
                    });

                });

            });

        });


/*
## Defaults

You can define defaults which often come in handy.

*/
        describe('Model defaults', function() {
            var PersonModelWithDefaults;

            beforeEach(function() {
                module.factory('PersonModelWithDefaults', function($modelFactory) {
                    return $modelFactory('/api/people', {
                        // Simply declare a `defaults` object within the model
                        // configuration and set the desired default properties
                        // accordingly.
                        defaults: {
                            age: 18
                        }
                    });
                });
            });

            beforeEach(inject(function(_PersonModelWithDefaults_) {
                PersonModelWithDefaults = _PersonModelWithDefaults_;
            }));

            it('when you instantiate the model, the default properties are already set', function() {
                // Thus, when you create a new instance,
                var personWithDefaults = new PersonModelWithDefaults();

                // the default property is set to the value you specified before.
                expect(personWithDefaults.age).toEqual(18);
            });

            // Obviously it doesn't only work with empty objects, but also when you already pass
            // some data to the constructor of the object.
            it('should use the defaults when creating an object with some data', function() {
                var personWithDefaults = new PersonModelWithDefaults({
                    name: 'Juri'
                });

                expect(personWithDefaults.age).toEqual(18);
            });

            it('should not overwrite with the default when passing a value for it', function() {
                // Moreover, when you explicity assign some value to the property specified in the
                // defaults, in the constructor, that value takes precedence over the previously
                // specified default value.
                var personWithDefaults = new PersonModelWithDefaults({
                    name: 'Juri',
                    age: 29
                });

                expect(personWithDefaults.age).toEqual(29);
            });

            it('should set the defaults when creating a list', function() {
                var personWithDefaultsList = new PersonModelWithDefaults.List([{
                    name: 'Juri'
                }]);

                expect(personWithDefaultsList[0].age).toEqual(18);
            });

        });

/*
## Custom actions

The predefined REST actions like `query, get, $save, $destroy` might not be enough in many cases. Model-factory
is flexible enought, though, to define custom endpoints at will.

*/
        describe('custom actions', function() {
            var PersonModel, $httpBackend;

            beforeEach(function() {
                module.factory('PersonModel', function($modelFactory) {
                    return $modelFactory('/api/people', {
                        // Define an `actions` object
                        actions: {

                            // and then your custom endpoint.
                            queryChildren: {
                                // The `url` is appended to the base URL of the model.
                                url: 'children',

                                // The `method` allows to override the HTTP method to
                                // be used. `GET` is the default.
                                method: 'GET',

                                // By setting the `isArray` you can control whether the
                                // expected result is an array or a single object.
                                isArray: true,

                                // The `wrap` param sets whether the response should be wrapped
                                // as an instance (or instance list) of models. Default is `true`.
                                wrap: true
                            },

                            // Functions prefixed by `$` instance-level functions.
                            '$serverCopy': {
                                method: 'POST',
                                url: 'copy'
                            }

                        }
                    });
                });
            });

            beforeEach(inject(function(_PersonModel_, _$httpBackend_) {
                PersonModel = _PersonModel_;
                $httpBackend = _$httpBackend_;
            }));

            it('should correctly call the defined url', function() {
                // You can then simply invoke the custom action by its name.
                PersonModel.queryChildren();
                $httpBackend.expectGET('/api/people/children').respond(200, []);
                $httpBackend.flush();
            });

            it('take params as JavaScript objects and append them to the url', function() {
                // As with the default REST functions you can pass parameters as JavaScript objects.
                PersonModel.queryChildren({
                    type: 'minor'
                });

                // Parameters are appended as query params.
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

                // Instance-level actions have to be used on an instance of the model.
                model.$serverCopy();
                $httpBackend.flush();
            });

        });

/*
### URL templates

Internally, model-factory uses the uri-templates library to resolve the URLs.

*/

        describe('custom URL templates', function() {
            var $httpBackend;

            beforeEach(function() {
                module.factory('PersonModel', function($modelFactory) {
                      return $modelFactory('/api/people', {
                          actions: {

                              // That means you can specify placeholders like `{id}` within
                              // your url and it will be replaced by the according JavaScript property
                              // passed to the method call.
                              getById: {
                                  url: 'child/{id}/some/subpath'
                              },

                              // It not only works with the primary key but with any arbitrary property.
                              getByName: {
                                  url: 'child/{name}/some/subpath'
                              },

                              // It works on the instance-level functions in the exact same way, just that
                              // the properties are resolved from the model properties itself.
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

            beforeEach(inject(function(_PersonModel_, _$httpBackend_) {
                PersonModel = _PersonModel_;
                $httpBackend = _$httpBackend_;
            }));

            it('should resolve any {id} placeholder with the appropriate value', function(){
                PersonModel.getById({ id: 123 });

                $httpBackend.expectGET('/api/people/child/123/some/subpath').respond(200, []);
                $httpBackend.flush();
            });

            it('should also work with properties other than the pk', function(){
                PersonModel.getByName({ name: 'juri' });

                $httpBackend.expectGET('/api/people/child/juri/some/subpath').respond(200, []);
                $httpBackend.flush();
            });

            it('should also work with POST requests and name variable', function(){
                var person = new PersonModel({
                  name: 'juri'
                });

                person.$serverCopy();

                $httpBackend.expectPOST('/api/people/copy/juri').respond(200, []);
                $httpBackend.flush();
            });

            it('should also work with PUT requests and name variable', function(){
                var person = new PersonModel({
                  name: 'juri'
                });

                person.$customUpdate();

                $httpBackend.expectPUT('/api/people/update/juri').respond(200, []);
                $httpBackend.flush();
            });

        });

    });

    describe('with the default configuration', function() {

        beforeEach(function() {

            // First of all, we have to **reference the "modelFactory" module**
            // to make use of the services it comes with.
            angular.module('test-module', ['modelFactory'])

                // Define a new factory for an endpoint to read
                // people.
                .factory('PersonModel', function($modelFactory) {
                    return $modelFactory('/api/people', {
                        actions: {
                            '$customDelete': {
                                method: 'DELETE',
                                url: 'customDelete/{id}'
                            }
                        }
                    });
                });
        });

        beforeEach(angular.mock.module('test-module'));

        beforeEach(inject(function(_PersonModel_) {
            PersonModel = _PersonModel_;
        }));

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

            it('should NOT revert to the old values after an entity has been persisted with $save', inject(function($httpBackend) {
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

});
