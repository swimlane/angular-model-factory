---
layout: tutorial
title: Learning Model-Factory
type: howto
---

# About Model Factory

Model Factory is a light-weight model layer that bridges the gap between AngularJS and your RESTful APIs. Its focus is to be simple to use, yet efficient and flexible enough for most of the use cases you'll encounter.

But why would you use this over other available solutions?

- Lightweight/Simple, the code simply does some basic copy/extending and prototypical instances; no magic required.
- Patterns/Practices, the model definition closely resembles Angular's ngResource meaning its easy to swap out, replace later, eases scaling/transition, and its designed for Angular; not a backbone port!
- Utilizes Angular at the core, it doesn't duplicate things Angular already does. Any action can be passed a $http configuration option, all your interceptors still work, it uses Angular's cache, etc!
- Compliant, URI Template matches the specs.
- Small - 1.45KB gzipped/minified ( excludes depedencies )
- Minimal Dependencies, only use URI template and deep-diff ( this isn't even required ) utility. NO underscore, lodash, jquery, etc!
- Its full of awesome features
- ...

# Installation

There are different possibilities. You can either simply download one of [our releases](https://github.com/Swimlane/angular-model-factory/releases) or directly get the latest version from the [repo itself](https://github.com/Swimlane/angular-model-factory). The `dist` folder should contain everything you need.

## Bower

Alternatively you can get it on [Bower](http://bower.io/search/?q=angular-model-factory).

```
$ bower install angular-model-factory --save
```

# Quickstart example

Here's the quickstart example showing you some of the features

```javascript
angular.module('app', ['modelFactory'])
    // defining a new Person model
    .factory('Person', function($modelFactory){
        return $modelFactory('/api/people');
    })
    .controller('PersonController', function(Person){
        var vm = this;
        vm.peopleList = [];

        // events
        vm.savePerson = savePerson;
        vm.deletePerson = deletePerson;

        activate();

        ////////////////////////////

        function activate(){
            Person.query().then(function(people){
                vm.peopleList = people;
            });
        }

        function savePerson(person){
            // person is already an instance of a model factory
            // model
            person.$save().then(
                function(){
                    console.log('Person successfully saved!');
                })
                .catch(function(){
                    console.error('Oops, there was an error saving the person');
                });
        }

        function deletePerson(person){
            person.$destroy();
        }
    });

```

Here's a live example on Plunkr:

<iframe src="http://embed.plnkr.co/fkbFuGynShAkw3BTrwAo/preview" width="100%" height="300px"> </iframe>

# Using model-factory in your Angular code

## Reference the module

To use model-factory in your own Angular application you have to import its module: `modelFactory`.

```javascript
angular.module('myApp', ['modelFactory']);
```

## Define a new model

Model-factory works with the concept of having one model for each REST resource on your backend. Assume you have

- `/api/departments`
- `/api/people`

..then you'd have a model `Department` and a model `Person`. They can be defined as follows.

```javascript
angular.module('myApp', ['modelFactory'])
    .factory('Department', DepartmentModel)
    .factory('Person', PersonModel);

function DepartmentModel($modelFactory){
    return $modelFactory('/api/departments');
}

function PersonModel($modelFactory){
    return $modelFactory('/api/people');
}
```

Instantiating a model-factory object is just like you would any other JavaScript object. You can pass an object directly to the constructor to initialize it.

```javascript
var person = new PersonModel({
    name: 'Juri',
    age: 30
});

expect(person.name).toBe('Juri');
expect(person.age).toBe(30);
```

Just like with any plain JavaScript objects, you're free to directly set a property:

```javascript
var person = new PersonModel();
person.name = 'Juri';

expect(person.name).toBe('Juri');
```

By using the `$update(someObj)` function, you can update a whole set of properties by passing in the interested ones.

```javascript
var newModel = new PersonModel({
    name: null
});

var newModelUpdate = new PersonModel({
    name: 'elec29a',
    language: {
      de: 'hallo'
    }
});


newModel.$update(newModelUpdate);

expect(newModel.name).toEqual('elec29a');
expect(newModel.language).toBeDefined();
expect(newModel.language.de).toEqual('hallo');
```

## Querying the backend

Each model comes with a set of predefined static and per-instance functions. **Static functions** are used to fetch new instances from your API, basically to get new instances when you don't have some already. **Instance functions** are used to operate upon the data of your existing model instance, normally to either delete a given model, to save or update it with your backend API.

Let's explore them using the example of our previously defined `Person` model.

### `GET /api/people`

```javascript
Person.query().then(function(people){
    // use people which is an array of Person object
    // instances
});
```

### `GET /api/people?name=Juri&age=30`

```javascript
Person
    .query({ name: 'Juri', age: 30})
    .then(function(people){
        // use people which is an array of Person object
        // instances
    });
```

### `GET /api/people/123`

To fetch a single instance of a given model

```javascript
Person.get(123).then(function(person){
    // do something interesting with person
});
```

### `GET /api/people/123?age=30`

```javascript
Person.get(123, { age: 30 }).then(function(person){
    // do something interesting with person
});
```

## Persisting data

Persisting data to your backend is as easy as invoking `$save()` on an existing model instance.

### Creating a new object

When you create a new model instance..

```javascript
var aPerson = new Person({
    name: 'Juri',
    age: 30
});
aPerson.job = 'Awesome Coder';
```

..you can simply send your data to your backend API by invoking the `$save()` method:

```javascript
...
aPerson.$save();
```

This executes a `POST /api/people` with the data in the body of the HTTP request. **Note**, the response of the HTTP request will be automatically written back to the model instance.  

### Updating an existing instance

Alternatively, you might already have an existing instance of a person model. Whether an instance is an existing one or a new one is determined by the value of the identifying property: `id`. If `id > 0` model-factory treats the objects as being an existing one, otherwise it treats it as a being new.

```javascript
// update the name of an existing person object.
// this might also happen through Angular's databinding mechanism
anExistingPerson.name = 'Austin';

anExistingPerson.$save();
```

At this point a `PUT /api/people/123` will be executed, having the data of the object in its body.

### Deleting an existing instance

To delete an existing instance, invoke `$destroy()`:

```javascript
anExistingPerson.$destroy();
```

A `DELETE /api/people/123` will be executed.

## 

