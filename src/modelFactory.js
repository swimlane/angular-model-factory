/* global angular:false */

'use strict';

var module = angular.module('modelFactory', []);

// compression
var forEach = angular.forEach,
    extend = angular.extend,
    copy = angular.copy;

// keywords that are reserved for model instance
// internal usage only and to be stripped
// before sending to server
var instanceKeywords = [ '$$array', '$save', '$destroy',
    '$pending', '$revert', '$diff', '$extend' ];

// keywords that are reserved for the model static
// these are used to determine if a attribute should be extended
// to the model static class for like a helper that is not a http method
var staticKeywords = [ 'actions', 'instance', 'list', 'defaults',
    'pk', 'stripTrailingSlashes', 'map' ];

// Deep extends
// http://stackoverflow.com/questions/15310935/angularjs-extend-recursive
var extendDeep = function extendDeep(dst) {
    forEach(arguments, function(obj) {
        if (obj !== dst) {
            forEach(obj, function(value, key) {
                if(instanceKeywords.indexOf(key) === -1){
                    if (dst[key] && angular.isObject(dst[key])) {
                        extendDeep(dst[key], value);
                    } else if(!angular.isFunction(dst[key])) {
                        dst[key] = value;
                    }
                }
            });
        }
    });
    return dst;
};

// Based on https://gist.github.com/amcdnl/9f5609713ae8a4fd475e
module.factory('$modelFactory', function($http, $q, $log, $cacheFactory){

    var defaultOptions = {

        /**
         * Primary key of the model
         */
        pk: 'id',

        /**
         * By default, trailing slashes will be stripped
         * from the calculated URLs.
         */
        stripTrailingSlashes: true,

        /**
         * Default values for a new instance.
         * This will only be populated if the property
         * is undefined.
         *
         * Example:
         *      defaults: {
         *          'create': new Date()
         *      }
         */
        defaults: {},

        /**
         * Attribute mapping.  Tranposes attributes
         * from a response to a different attribute.
         *
         * Also handles 'has many' and 'has one' relations.
         *
         * Example:
         *      map: {
         *          // transpose `animalId` to
         *          // `id` on our instance
         *          'id': 'animalId',
         *
         *          // transposes `animal` attribute
         *          // to an array of `AnimalModel`'s
         *          'animal': AnimalModel.List,
         *
         *          // transposes `location` attribute
         *          // to an instance of `LocationModel`
         *          'location': LocationModel
         *      }
         */
        map:{},

        /**
         * Hash declaration of model actions.
         *
         * NOTE: Anything prefixed with `$` will be attached to the
         * model instance rather than the static.
         */
        actions:{

            /**
             * Base options to be applied to all other actions by default.
             * In addition to the methods listed here, any `$http` attribute
             * is valid. https://docs.angularjs.org/api/ng/service/$http
             *
             * If the method is a `GET` and the arguments invoking it are a string or number,
             * then the model automatically assumes you are wanting to pass those are the primary key.
             *
             * Action Agnostic Attributes:
             *  - `override` Overrides the base url prefixing.
             *  - `method` Case insensitive HTTP method (e.g. GET, POST, PUT, DELETE, JSONP, etc).
             *  - `url` URL to be invoked by `$http`.  All urls are prefixed with the base url passed initally.  All templates are [URI Template](http://tools.ietf.org/html/rfc6570) spec.
             */
            'base': {
                /**
                 * Wrap the response from an action in a instance of the model.
                 */
                wrap: true,

                /**
                 * Callback before data is sent to server.
                 * This allows developers to manipulate the
                 * object before its sent to the server but
                 * not effect the core object.
                 */
                beforeRequest: undefined,

                /**
                 * Callback after data recieved from server but
                 * before the data is wrapped in an instance.
                 */
                afterRequest: undefined,

                /**
                 * By default, do not cache the requests.
                 */
                cache: false
            },
            'get': {
                method: 'GET'
            },
            'query': {
                method: 'GET',

                /**
                 * If true then the returned object for this action is an array.
                 */
                isArray: true
            },

            /**
             * In theory `post`, `update`, and `delete` below would/should not be used,
             * instead one would use `$save` or `$destroy` to be invoked
             */
            'post': {
                method: 'POST',
                invalidateCache: true
            },
            'update': {
                method: 'PUT',
                invalidateCache: true
            },
            'delete': {
                method: 'DELETE',
                invalidateCache: true
            }
        },

        /**
         * Instance level extensions/helpers.
         *
         * Example:
         *      instance: {
         *          'name': function() {
         *              return this.first + ' ' + this.last
         *          }
         *      }
         */
        instance: {},

        /**
         * List level extensions/helpers.
         *
         * Example:
         *
         *      list: {
         *          'namesById': function(id){
         *              return this.find(function(u){ return u.id === id; });
         *          }
         *      }
         *
         */
        list: {}
    };

    /**
     * Model factory.
     *
     * Example usages:
     *       $modelFactory('api/zoo');
     *       $modelFactory('api/zoo', { ... });
     */
    function modelFactory(url, options) {

        /**
         * Prevents multiple calls of the exact same type.
         *
         *      { key: url, value: promise }
         *
         */
        var promiseTracker = {};

        // copy so we also extend our defaults and not override
        //var actions = angular.extend({}, defaultOptions.actions, options.actions);
        options = extendDeep({}, copy(defaultOptions), options);

        //
        // Collection
        // ------------------------------------------------------------
        //

        /**
         * Model list instance.
         * All raw objects passed will be converted to an instance of this model.
         *
         * If we `push` a item into an existing collection, a pointer will be made
         * so on a destroy items will be removed from the array as well.
         *
         * Example usages:
         *       var zoos = new Zoo.List([ {}, ... ]);
         */
        function ModelCollection(value){
            var instance = this;

            value = value || [];

            // wrap each obj
            value.forEach(function(v, i){
                // this should not happen but prevent blow up
                if(v === null || v === undefined) return;

                // create an instance
                var inst = v.constructor === Model ?
                    v : new Model(v);

                // set a pointer to the array
                inst.$$array = value;

                // reset to new instance
                value[i] = inst;
            });

            // override push to set an instance
            // of the list on the model so destroys will chain
            var __oldPush = value.push;
            value.push = function(model){
                if(model.constructor === Model){
                    model.$$array = value;
                }
                __oldPush.apply(value, arguments);
            };

            // add list helpers
            if(options.list){
                extend(value, options.list);
            }

            return value;
        };


        //
        // Model Instance
        // ------------------------------------------------------------

        /**
         * Model instance.
         *
         * Example usages:
         *       var zoo = new Zoo({ ... });
         */
        function Model(value) {
            var instance = this, old;

            // if the value is undefined, create a empty obj
            value = value || {};

            // build the defaults but only on new instances
            forEach(options.defaults, function(v, k){
                // only populates when not already defined
                if(value[k] === undefined){
                    if(typeof v === 'function'){
                        // pass the value so you can combine things
                        // this could be tricky if you have defaults that rely on other defaults ...
                        // like: { name: function(val) { return val.firstName + val.lastName }) }
                        value[k] = v(value);
                    } else {
                        value[k] = v;
                    }
                }
            });

            // Map all the objects to new names or relationships
            forEach(options.map, function(v, k){
                if (typeof v === Model || typeof v === ModelCollection) {
                    value[k] = new v(value[k]);
                } else if (typeof v === 'function') {
                    // if its a function, invoke it,
                    // this would be helpful for seralizers
                    // like: map: { date: function(val){ return moment(val) } }
                    value[k] = v(value[k], value);
                } else {
                    value[k] = value[k];
                    delete value[k];
                }
            });

            // attach instance actions
            forEach(options.actions, function(v, k){
                if(k[0] === '$'){
                    instance[k] = function(){
                        return Model.$buildRequest(k, v, instance);
                    };
                }
            });

            // copy values to the instance
            extend(instance, value);

            // copy instance level helpers to this instance
            extend(instance, copy(options.instance));

            /**
             * Save the instance to the server.  Posts the instance unless
             * the instance has the `pk` attribute already then it will do a put.
             */
            instance.$save = function(){
                var promise = Model[instance[options.pk] ?
                    'update' : 'post'](instance);

                instance.$pending = true;

                promise.then(function(value){
                    instance.$pending = false;

                    // extend the value from the server to me
                    extendDeep(instance, value);
                }, function(){
                    // rejected
                    instance.$pending = false;
                });

                return promise;
            };

            /**
             * Delete the instance.  Performs a DELETE on this instance performing
             * the delete action passing an instance of itself.
             *
             * If the item is associated with an array, it will automatically be removed
             * on successful delete.
             */
            instance.$destroy = function(){
                // keep a local pointer since we strip before send

                var promise = Model.delete(instance);
                instance.$pending = true;

                promise.then(function(){
                    instance.$pending = false;

                    var arr = instance.$$array;
                    if(arr){
                        arr.splice(arr.indexOf(instance), 1);
                    }
                }, function(){
                    // rejected
                    instance.$pending = false;
                });

                return promise;
            };

            /**
             * Display the difference between the original data and the
             * current instance.
             * https://github.com/flitbit/diff
             */
            instance.$diff = function(){
                return DeepDiff.deep(old, instance, function(path, key) {
                    return key[0] === '$';
                });
            };

            /**
             * Reverts the current instance back to the first instance of the object.
             * This does NOT save the model to the server, call `$save` to do that.
             */
            instance.$revert = function(){
                return instance.$extend(old);
            };

            /**
             * Extends the properties of the new object onto
             * the current object without replacing it.  Helpful
             * when copying and then re-copying new props back
             */
            instance.$extend = function(n){
                extendDeep(instance, n);
                return instance;
            };

            // Create a copy of the value last so we get all the goodies,
            // like default values and whatnot.
            old = copy(value);
        };

        //
        // Model Static
        // ------------------------------------------------------------

        /**
         * Create an instance of a cache factory
         * for tracking data of this instance type.
         * https://docs.angularjs.org/api/ng/service/$cacheFactory
         */
        Model.$cache = $cacheFactory(url);

        // attach actions
        forEach(options.actions, function(v, k){
            // don't do base or $
            if(k === 'base' || k[0] === '$') return;
            Model[k] = function(){
                //http://stackoverflow.com/questions/2091138/why-doesnt-join-work-with-function-arguments
                var args = Array.prototype.slice.call(arguments);
                return Model.$buildRequest.apply(this, [k, v].concat(args));
            };
        });

        /**
         * Builds the request for a set of actions.
         */
        Model.$buildRequest = function(action, param, data, extras){
            var clone = copy(options.actions.base);
            extend(clone, copy(param));

            // if we explicity call cache
            // to true and don't pass a factory
            // lets use our instance level for
            // data storage means
            if(clone.cache === true){
                clone.cache = Model.$cache;
            }

            // uri template to parameterize
            var uri = "";

            // make sure we didn't override the base url prefixing
            if(!clone.override){

                // set the uri to the base
                uri = url;

                // if we have a url defined, append to base
                if(clone.url) {
                    uri += "/" + clone.url;
                }

                // attach the pk referece by default if it is a 'core' type
                if(action === "get" || action === "post" || action === "update" || action === "delete"){
                    uri += "/{" + options.pk + "}";
                }

                if(clone.method === "GET" && (angular.isString(data) || angular.isNumber(data))){
                    // if we have a get method and its a number or a string
                    // you can assume i'm wanting to do something like:
                    // ZooModel.get(1234) instead of ZooModel.get({ id: 1234 });
                    var obj = {};
                    obj[options.pk] = data;
                    data = obj;

                    // if we have a extra argument on this case we should assume its a
                    //
                    if(extras){
                        data.param = extras;
                        uri += "{?param*}";
                    }
                } else if(clone.method === "GET" && angular.isObject(data)){
                    // if its a GET request and its not the above, we can assume
                    // you want to do a query param like:
                    // ZooModel.query({ type: 'panda' }) and do /api/zoo?type=panda
                    data = { param: data };
                    uri += "{?param*}";
                }
            } else {
                uri = clone.url;
            }

            clone.url = Model.$url(uri, data);
            clone.data = data;

            return Model.$call(clone);
        };

        /**
         * Invokes `$http` given parameters and does some
         * callback before/after and state setting.
         */
        Model.$call = function(params){
            // if we have the promise in queue, return it
            var signature = params.method + ':' + params.url;
            if (promiseTracker[signature]) {
                return promiseTracker[signature];
            }

            var def = $q.defer();

            // set the queue for this promise
            promiseTracker[signature] = def.promise;

            // copy the data so we can manipulate
            // it before the request and not affect
            // the core object
            params.data = copy(params.data);

            // before callbacks
            params.beforeRequest &&
                params.beforeRequest(params);

            // strip all the internal functions/etc
            params.data = Model.$strip(params.data);

            $http(params).success(function(response){
                // after callbacks
                params.afterRequest &&
                    params.afterRequest(response);

                // if we had a cache, remove it
                // this could be optimized to only do
                // the invalidation of things by id/etc
                if(params.invalidateCache){
                    Model.$cache.removeAll();
                }

                if(params.wrap){
                    if(params.isArray){
                        def.resolve(new Model.List(response));
                    } else {
                        def.resolve(new Model(response));
                    }
                } else {
                    def.resolve(response);
                }

                promiseTracker[signature] = undefined;
            }).error(function(response){
                promiseTracker[signature] = undefined;
                def.reject(response);
            });

            return def.promise;
        };

        /**
         * Returns a url given the URI template and parameters.
         *
         * Examples:
         *
         *      // obj = { id: 2344 }
         *      Model.$url('api/zoo/{id}', obj)
         *      //-> 'api/zoo/2345'
         *
         *      // {}
         *      Model.$url('api/zoo/{id}')
         *      //-> 'api/zoo'
         *
         *      // { params: { type: 'panda' } }
         *      Model.$url('api/zoo/{?params*}')
         *      //-> 'api/zoo?type=panda'
         *
         * Optionally strips trailing `/`'s.
         *
         * Based on:
         * https://github.com/geraintluff/uri-templates
         */
        Model.$url = function(u, params){
            var uri = new UriTemplate(u || url)
                .fillFromObject(params || {});

            if(options.stripTrailingSlashes){
                uri = uri.replace(/\/+$/, '') || '/';
            }

            return uri;
        };

        /**
         * Remove instances of reserved keywords
         * before sending to server/json.
         */
        Model.$strip = function(args){
            // todo: this needs to account for relationships too?
            // either make recursive or chain invoked
            if(args && typeof args === "object"){
                forEach(args, function(v,k){
                    if(instanceKeywords.indexOf(k) > -1){
                        delete args[k];
                    }
                });
            }
            return args;
        };

        // extend the static class with arguments that are not internal
        forEach(options, function(v, k){
            if(staticKeywords.indexOf(k) === -1){
                Model[k] = v;
            }
        });

        // has to be at end for depedency reasons
        Model.List = ModelCollection;

        return Model;
    };

    return modelFactory;
});
