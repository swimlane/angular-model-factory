import angular from 'angular';
import { instanceKeywords } from './keywords';

// Deep extends
// http://stackoverflow.com/questions/15310935/angularjs-extend-recursive
export let extendDeep = function(dst) {
  angular.forEach(arguments, function(obj) {
    if (obj !== dst) {
      angular.forEach(obj, function(value, key) {
        if (instanceKeywords.indexOf(key) === -1) {
          if (dst[key]) {
            if (angular.isArray(dst[key])) {
              dst[key].concat(value.filter(function(v) {
                var vv = dst[key].indexOf(v) !== -1;
                if (vv) extendDeep(vv, v);
                return vv;
              }));
            } else if (angular.isObject(dst[key])) {
              extendDeep(dst[key], value);
            } else {
              // if value is a simple type like a string, boolean or number
              // then assign it
              dst[key] = value;
            }
          } else if (!angular.isFunction(dst[key])) {
            dst[key] = value;
          }
        }
      });
    }
  });
  return dst;
};

// Create a shallow copy of an object and clear other fields from the destination
// https://github.com/angular/angular.js/blob/master/src/ngResource/resource.js#L30
export let shallowClearAndCopy = function(src, dst) {
  dst = dst || {};

  // Remove any properties in destination that were not
  // returned from the source
  angular.forEach(dst, function(value, key) {
    if (!src.hasOwnProperty(key) && key.charAt(0) !== '$') {
      delete dst[key];
    }
  });

  for (var key in src) {

    if (src.hasOwnProperty(key) && key.charAt(0) !== '$') {
      // For properties common to both source and destination,
      // check for object references and recurse as needed. Route around
      // arrays to prevent value/order inconsistencies
      if (angular.isObject(src[key]) && !angular.isArray(src[key])) {
        dst[key] = shallowClearAndCopy(src[key], dst[key]);
      } else {
        // Not an object, so just overwrite with value from source
        dst[key] = src[key];
      }
    }
  }

  return dst;
};

/**
 * Make a pretty name from the url
 * for the event emitters
 */
export let nameNormalizer = function(url) {
  let nameSplit = url.split('/');
  return nameSplit.join('-');
  //prettyName = nameSplit[nameSplit.length - 1];
}
