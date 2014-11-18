# modelFactory

A light-weight model layer that bridges the gap between some of the features that are common with SPA.

Why would you use this over other available solutions?

- Lightweight/Simple, the code simply does some basic copy/extending and prototypical instances; no magic required.
- Patterns/Practices, the model definition closely resembles Angular's ngResource meaning its easy to swap out, replace later (if ngResource gets awesome suddenly), eases scaling new devs / organizations, and its designed for Angular; not a backbone port!
- Utiilizes Angular at the core, it doesn't duplicate things Angular already does.  Any action can be passed a `$http` configuration option, all your interceptors still work, it uses Angular's cache, etc!
- Compliant, URI Template matches the specs.
- 1.45KB gziped/minified ( excludes depedencies )
- Minimal Depdencies, only use URI template and deep-diff ( this isn't even required ) utility.  NO underscore, lodash, jquery, etc!
- Its full of awesome features


### Other Solutions

- [Restmod](https://github.com/platanus/angular-restmod)
Very nice solution but very opinionated and hyper-active. 22kb min

- [Modelizer](https://github.com/VasilioRuzanni/angular-modelizer)
Good but requires Lodash. 23kb min

- [ModelCore](https://github.com/klederson/ModelCore/)
Good but not very well tested and not active.

- [angular-watch-resource](https://github.com/marmorkuchen-net/angular-watch-resource) - Really only handles collections

- [angular-restful](http://esdrasedu.github.io/angular-restful/#/) - Very basic but nice

- [ngResource](https://docs.angularjs.org/api/ngResource/service/$resource)
Out of the box model layer, very limited.

- [angularjs-rails-resource](https://github.com/FineLinePrototyping/angularjs-rails-resource)
Too rails-ish.

- [angular-nested-resource](https://github.com/roypeled/angular-nested-resource) - Okay API, not loving the nested architecture.

- [Aar.js](http://aarjs.com/)
Very light, not sure what value this adds.

- [Angular Activerecord](https://github.com/bfanger/angular-activerecord)
A copy of BackboneModel but doesn't really work with Angular patterns.

- [Angular-Data](http://angular-data.pseudobry.com/)
Not really a model layer but a data store.  Very very heavy ( 67kb min )

- [ngActiveResource](https://github.com/FacultyCreative/ngActiveResource)
Very ruby-ish api.  Requires lodash.  Has validation but thats not needed in angular if you do it right.

- [restangular](https://github.com/mgonto/restangular) 
I don't consider this a model layer; it feels moore like a fancy http layer that returns promises because everyone complains about ngResource not doing it.  It requires underscore.

- [BreezeJS](http://www.breezejs.com/) 
This is a very full featured model/cache/validation etc.  Its framework agnostic, which means it follows its own patterns and not angulars.  Its very heavy, requires server data massaging, and the API looks like Microsoft Entity Framework ( overkill IMO ).

- [ng-backbone](https://github.com/adrianlee44/ng-backbone)
Another backbone model clone.  This one actually requires backbone and lodash.


## Features

- URI Templates (RFC6570)
- Object Deep Diff / Reversion
- Model instances
- Collections
- Single Datastore
- Caching
- Default value population
- Pending / Completed Status
- Relationships
- Track active promises to prevent duplicate sends


## Roadmap

- Lifecyle events ( pre-save, post-save, after-update, after-delete, etc )
- Inhertiance 
- Deseralizers
- Socket listeners - probably could do w/ events
- API Versioning ( api/v1/  ... api/v2/ )
- Pagination out of the box


## Depedencies

- Angular >= 1.3
- [deep-diff](https://github.com/flitbit/diff)
- [uri-templates](https://github.com/geraintluff/uri-templates)
 
*NOTE: You will need to include deep-diff and uritemplates references and ensure usage is correct.*


## API

### Using it

- Include `dist/modelFactory-build.js` in your app
- Include `modelFactory` in your module
- Enjoy magic ;)

#### The Factory

**Simple Definition**

A basic model definition.

    var module = angular.module('services.zoo', ['modelFactory']);

    module.factory('AnimalModel', function($modelFactory){
      return $modelFactory('api/zoo');
    });
    
    return module;

**Advanced Definition**

A advanced definition that demonstrates all scenarios.

    var module = angular.module('services.zoo', ['modelFactory']);

    module.factory('AnimalModel', function($modelFactory){
    
        var model = $modelFactory('api/zoo', {
        
            // the default primary key
            pk: 'id',
        
            map: {
                'zooId: 'id',

                // has many
                'animals': AnimalModel.List,

                // has one
                'location': LocationModel
            },
            
            // only called on empty inits
            defaults: {
                'created': new Date()
            },
            
            // All return $promise 
            // Note: All default options are transposed to all new instance
            // unless explicitly overridened
            actions:{
                'base': {
                    // any $http argument
                    
                    // before ajax call
                    // this only manipulates data sent not core object
                    beforeRequest: function() { ... } 
                    
                    // after ajax call response
                    // happens before the object is wrapped
                    afterRequest: function(){ ... }
                },
                
                // these are implied by default given
                // the base url unless overridden like below
                // - get
                // - query
                // - post
                // - update
                // - delete
                
                'query': { 
                    // lets cache all query requests
                    // this uses the out of the box angular caching
                    // for $http.  I create a cache factory on each
                    // instance so you can access it via `$cache` attribute
                    cache: true
                },
                
                // custom methods
                'queryFood':{
                    type: 'GET',
                    
                    // urls inherit the base url
                    // url becomes: api/zoo/food
                    url: 'food', 
                    
                    // doesn't attach prototype methods
                    wrap: false 
                },
                
                'update': {
                    // by default, save/update/delete will all
                    // invalidate the cache if defined.
                    invalidateCache: true
                },
                
                // anything with $ prefix is attached to instance
                '$copy': {
                    type: 'POST',
                    url: 'stlouis/zoo/copy',
                    
                    // overrides the root url
                    override: true
                }
            },
            
            list: {
            
              // example list helper
              nameById: function(id) {
                   var user = this.find(function(u){
                       return u.id === id;
                   });
                   return user ? user.name() : "Unavailable";
               }
               
            },
            
            instance: {
                
                // instance api
                // - $save
                // - $destroy
                
                // revision api
                // - $diff
                // - $revert
            
                // example custom helper
                'getName': function(val){ 
                    return val.first + ' ' val.last 
                } 
            },
            
            // any method that does not represent a http action
            // that will be attached to the static class
            myStaticMethod: function(){
            
            }
        });
        
        return model;
    
    });

#### Controller Usage

    module.controller('ZooCtrl', function ($scope, AnimalModel) {

        // create single
        var animal = new AnimalModel({
            name: 'Panda'
        });
        
        // creates if no id
        // updates if has id
        animal.$save();

        // create list
        // objects will automatically be wrapped
        var animalList = new AnimalModel.List([ {}, {}, ... ]);
        
        // add the model to this list
        animalList.push(animal)
        
        // deletes the model
        // and removes from the list i pushed into
        animal.$destroy();
    });
    
#### Example Requests
    
    //-> api/zoo/345234
    return AnimalsModel.get(id);
    
    //-> api/zoo/345234?type=panda
    return AnimalsModel.get(id, { type: panda });
    
    //-> api/zoo/345234
    return AnimalsModel.get({ id: id });
    
    //-> api/zoo?name=panda
    return AnimalsModel.query({ name: 'panda' });
    
#### UI-Router resolves

    $stateProvider.state('zoo', {
        url: '/zoo',
        templateUrl: 'zoo.tpl.html',
        controller: 'ZooCtrl',
        resolve: {
            animals: function (AnimalsModel) {
                return AnimalsModel.query({ name: 'panda' });
                
            }
        }
    });
    
#### Lists

    module.controller('ZooCtrl', function ($scope, AnimalModel, animals) {
        // animals === [ AnimalModel({ type: 'panda' }) ]
        
        var animal = animals[0];
        //-> animals = [ { type: 'panda' } ]
        
        // Update an instance in the list
        animal.type = 'lion';
        //-> animal[0].type == 'lion'
        
        //-> commits THIS model to server
        animal.$save();

        // automatically deletes from list
        animal.$destory();
        //-> animals = []
    
    });

#### Useful Tips/Notes

**Usage**

This system DOESNT make sense for all your `$http` assets.  I'd recommend implementing for assets that have CRUD with [RESTful APIs](http://www.restapitutorial.com/).


**Cache**

Angular caches the http response from the server in a `$cacheFactory` based on the url of the request.  Angular does not handle cache invalidation though.  During a POST/UPDATE/DELETE `$modelFactory` actually will invalidate the cache using the `invalidateCache` factory.  This will remove ALL cache instances for that particular model.

If you choose to use the cache, you should also consider other clients invalidating your cache.  This can be achieved by using a socket implementation at the server level to distribute events to the client to invalidate cache.  `$modelFactory` keeps an instance of the `$cacheFactory` on its static instance for easy access to do your invalidation.


**Event Distribution**

Sometimes you need a pub/sub model.  Using Angular's core broadcast system we can achieve that relatively simple.


    var factory = $modelFactory('api/zoo', {
        actions:{
            'delete': {
                afterRequest:function(model){
                    $rootScope.$broadcast('animalDeleted', model.id);
                }
            }
        }
    });

then later in another controller/etc:

    $rootScope.$on('animalDeleted', function(id){
        alert('Animal deleted: ' + id)    
    })

**Button States**

The `$pending` attribute on the model can be used to easily disable a button while things are saving/updating/deleting.  Example:

    <button ng-disabled="myModel.$pending">Save</button>
  
when completed the `$pending` state will be set to false re-enabling the button.

## Todos

- Tests

- Better cache invalidation

- Investigate copy/extend usage for perf

- Fetch relationships if not present in response

- Odd API cases like: `POST api/zoo/{locationId}/{animalId}/` with data that might look like: `{ id: 1234, animalName: 'panda', ... }`
