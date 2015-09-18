import { defaults } from './defaults';

export function ModelFactoryProvider(){

  this.defaultOptions = defaults;

  this.$get = function($rootScope, $http, $q, $log, $cacheFactory) {
    "ngInject";

    let modelFactory => (url, options) {

      /**
       * Prevents multiple calls of the exact same type.
       *
       *      { key: url, value: promise }
       *
       */
      var promiseTracker = {};

      // copy so we also extend our defaults and not override
      //var actions = angular.extend({}, defaultOptions.actions, options.actions);
      options = extendDeep({}, copy(provider.defaultOptions), options);
      

    };

    return modelFactory;
  };

};
