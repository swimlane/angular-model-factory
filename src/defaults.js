import { ServiceEntity } from './ServiceEntity';

export const defaults = {

  /**
   * URL Prefix for requests.  This should only really
   * be used at the provider level, not an instance.
   */
  prefix: '',

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
   * Hash declaration of model actions.
   *
   * NOTE: Anything prefixed with `$` will be attached to the
   * model instance rather than the static.
   */
  actions: {

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
      asClass: ServiceEntity,

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
  }
}
