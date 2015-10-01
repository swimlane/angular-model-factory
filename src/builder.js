import angular from 'angular';
import { extendDeep } from './utils';

/**
 * Builds the request for a set of actions.
 */
export function BuildRequest(action, param, data, extras) {
  var clone = angular.copy(options.actions.base);

  angular.extend(clone, copy(param));

  // if we explicity call cache
  // to true and don't pass a factory
  // lets use our instance level for
  // data storage means
  if (clone.cache === true) {
    clone.cache = Model.$cache;
  }

  // make sure we have a method specified, otherwise
  // default to GET
  clone.method = clone.method || 'GET';

  // uri template to parameterize
  var uri = options.prefix ? options.prefix + '/' : '';

  // make sure we didn't override the base url prefixing
  if (!clone.override) {

    // set the uri to the base
    uri += url;

    // if we have a url defined, append to base
    if (clone.url) {
      uri += '/' + clone.url;
    }


    // set the uri to the base
    uri = BuildUrl(uri, data, clone.method);

    // attach the pk referece by default if it is a 'core' type
    if (action === 'get' || action === 'post' || action === 'update' || action === 'delete') {
      uri += '/{' + options.pk + '}';
    }

    if (clone.method === 'GET' && (angular.isString(data) || angular.isNumber(data))) {
      // if we have a get method and its a number or a string
      // you can assume i'm wanting to do something like:
      // ZooModel.get(1234) instead of ZooModel.get({ id: 1234 });
      var obj = {};
      obj[options.pk] = data;
      data = obj;

      // if we have a extra argument on this case we should assume its a
      //
      if (extras) {
        // data.param = extras;
        clone.params = extendDeep({}, clone.params, extras);
        // uri += '{?param*}';
      }
    } else if (clone.method === 'GET' && angular.isObject(data)) {
      // if its a GET request and its not the above, we can assume
      // you want to do a query param like:
      // ZooModel.query({ type: 'panda' }) and do /api/zoo?type=panda
      // data = { param: data };
      clone.params = extendDeep({}, clone.params, data);
      // uri += '{?param*}';
    }
  } else {
    uri = clone.url;
  }

  clone.url = BuildUrl(uri, data, clone.method);

  // don't include the payload for DELETE requests
  if (action !== 'delete' && clone.method !== 'DELETE') {
    clone.data = data;
  }

  return CallUrl(clone);
};

/**
 * Invokes `$http` given parameters and does some
 * callback before/after and state setting.
 */
function CallUrl(params) {
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
  // params.data = Model.$strip(params.data);

  $http(params).then(function(response) {
    // after callbacks
    if (params.afterRequest) {
      var transform = params.afterRequest(response.data);
      if (transform) {
        response.data = transform;
      }
    }

    // if we had a cache, remove it
    // this could be optimized to only do
    // the invalidation of things by id/etc
    if (params.invalidateCache) {
      Model.$cache.removeAll();
    }

    if (response) {
      if (params.wrap) {
        if (params.isArray) {
          def.resolve(new Model.List(response.data));
        } else {
          def.resolve(new Model(response.data));
        }
      } else {
        def.resolve(response.data);
      }
    } else {
      def.resolve();
    }
  }, def.reject).finally(function() {
    promiseTracker[signature] = undefined;
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
function BuildUrl(u, params, method) {
  var uri = new UriTemplate(u || url)
    .fill(function(variableName) {
      var resolvedVariable = params[variableName];

      // if we have a match, substitute and remove it
      // from the original params object
      if (resolvedVariable) {
        // only remove params on GET requests as the
        // passed object is intended to be used
        // as URL params. For persistent HTTP calls
        // the object has to be left as it is (for now)
        if (method === 'GET') {
          delete params[variableName];
        }

        return resolvedVariable;
      } else {
        // ?? log an error??
        return null;
      }
    });
  // .fillFromObject(params || {});

  if (options.stripTrailingSlashes) {
    uri = uri.replace(/\/+$/, '') || '/';
  }

  return uri;
};
