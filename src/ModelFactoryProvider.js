import angular from 'angular';
import { extendDeep } from './utils';
import { defaults } from './defaults';
import { ServiceEntity } from './models/ServiceEntity';
import { BuildRequest } from './builder';

export function ModelFactoryProvider(){

  this.defaultOptions = defaults;

  this.$get = function($rootScope, $http, $q, $log, $cacheFactory) {
    "ngInject";

    let factory = (url, options) => {

      /**
       * Prevents multiple calls of the exact same type.
       *
       *      { key: url, value: promise }
       *
       */
      let promiseTracker = {};

      // copy so we also extend our defaults and not override
      //var actions = angular.extend({}, defaultOptions.actions, options.actions);
      options = extendDeep({}, angular.copy(this.defaultOptions), options);

      // set some pointers for our model
      ServiceEntity.$rootScope = $rootScope;
      ServiceEntity.$http = $http;
      ServiceEntity.$cacheFactory = $cacheFactory;

      // attach actions
      angular.forEach(options.actions, (v, k) => {
        // don't do base or instance fns
        if(k === 'base' || k[0] === '$') return;

        ServiceEntity[k] = function(){
          let args = Array.prototype.slice.call(arguments);
          return BuildRequest.apply(this, [k, v].concat(args));
        };
      });

      return ServiceEntity;
    };

    return factory;
  };

};
