import { defaults } from './defaults';

export function ModelFactoryProvider(){

  this.defaultOptions = defaults;

  this.$get = function($rootScope, $http, $q, $log, $cacheFactory) {
    "ngInject";

    return {

      

    };
  };

};
