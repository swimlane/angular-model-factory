/**
 * modelFactory makes working with RESTful APIs in AngularJS easy
 * @version v1.0.3 - 2015-11-09
 * @link http://swimlane.github.io/angular-model-factory/
 * @author Austin McDaniel <amcdaniel2@gmail.com>, Juri Strumpflohner <juri.strumpflohner@gmail.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

!function(e){"use strict";var t,n,a=[];if(typeof global==="object"&&global){t=global}else if(typeof window!=="undefined"){t=window}else{t={}}n=t.DeepDiff;if(n){a.push(function(){if("undefined"!==typeof n&&t.DeepDiff===p){t.DeepDiff=n;n=e}})}function r(e,t){e.super_=t;e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:false,writable:true,configurable:true}})}function i(e,t){Object.defineProperty(this,"kind",{value:e,enumerable:true});if(t&&t.length){Object.defineProperty(this,"path",{value:t,enumerable:true})}}function f(e,t,n){f.super_.call(this,"E",e);Object.defineProperty(this,"lhs",{value:t,enumerable:true});Object.defineProperty(this,"rhs",{value:n,enumerable:true})}r(f,i);function l(e,t){l.super_.call(this,"N",e);Object.defineProperty(this,"rhs",{value:t,enumerable:true})}r(l,i);function u(e,t){u.super_.call(this,"D",e);Object.defineProperty(this,"lhs",{value:t,enumerable:true})}r(u,i);function s(e,t,n){s.super_.call(this,"A",e);Object.defineProperty(this,"index",{value:t,enumerable:true});Object.defineProperty(this,"item",{value:n,enumerable:true})}r(s,i);function h(e,t,n){var a=e.slice((n||t)+1||e.length);e.length=t<0?e.length+t:t;e.push.apply(e,a);return e}function c(t,n,a,r,i,p,o){i=i||[];var b=i.slice(0);if(typeof p!=="undefined"){if(r&&r(b,p)){return}b.push(p)}var d=typeof t;var k=typeof n;if(d==="undefined"){if(k!=="undefined"){a(new l(b,n))}}else if(k==="undefined"){a(new u(b,t))}else if(d!==k){a(new f(b,t,n))}else if(t instanceof Date&&n instanceof Date&&t-n!==0){a(new f(b,t,n))}else if(d==="object"&&t!==null&&n!==null){o=o||[];if(o.indexOf(t)<0){o.push(t);if(Array.isArray(t)){var v,y=t.length;for(v=0;v<t.length;v++){if(v>=n.length){a(new s(b,v,new u(e,t[v])))}else{c(t[v],n[v],a,r,b,v,o)}}while(v<n.length){a(new s(b,v,new l(e,n[v++])))}}else{var m=Object.keys(t);var g=Object.keys(n);m.forEach(function(i,f){var l=g.indexOf(i);if(l>=0){c(t[i],n[i],a,r,b,i,o);g=h(g,l)}else{c(t[i],e,a,r,b,i,o)}});g.forEach(function(t){c(e,n[t],a,r,b,t,o)})}o.length=o.length-1}}else if(t!==n){if(!(d==="number"&&isNaN(t)&&isNaN(n))){a(new f(b,t,n))}}}function p(t,n,a,r){r=r||[];c(t,n,function(e){if(e){r.push(e)}},a);return r.length?r:e}function o(e,t,n){if(n.path&&n.path.length){var a=e[t],r,i=n.path.length-1;for(r=0;r<i;r++){a=a[n.path[r]]}switch(n.kind){case"A":o(a[n.path[r]],n.index,n.item);break;case"D":delete a[n.path[r]];break;case"E":case"N":a[n.path[r]]=n.rhs;break}}else{switch(n.kind){case"A":o(e[t],n.index,n.item);break;case"D":e=h(e,t);break;case"E":case"N":e[t]=n.rhs;break}}return e}function b(e,t,n){if(e&&t&&n&&n.kind){var a=e,r=-1,i=n.path.length-1;while(++r<i){if(typeof a[n.path[r]]==="undefined"){a[n.path[r]]=typeof n.path[r]==="number"?new Array:{}}a=a[n.path[r]]}switch(n.kind){case"A":o(a[n.path[r]],n.index,n.item);break;case"D":delete a[n.path[r]];break;case"E":case"N":a[n.path[r]]=n.rhs;break}}}function d(e,t,n){if(n.path&&n.path.length){var a=e[t],r,i=n.path.length-1;for(r=0;r<i;r++){a=a[n.path[r]]}switch(n.kind){case"A":d(a[n.path[r]],n.index,n.item);break;case"D":a[n.path[r]]=n.lhs;break;case"E":a[n.path[r]]=n.lhs;break;case"N":delete a[n.path[r]];break}}else{switch(n.kind){case"A":d(e[t],n.index,n.item);break;case"D":e[t]=n.lhs;break;case"E":e[t]=n.lhs;break;case"N":e=h(e,t);break}}return e}function k(e,t,n){if(e&&t&&n&&n.kind){var a=e,r,i;i=n.path.length-1;for(r=0;r<i;r++){if(typeof a[n.path[r]]==="undefined"){a[n.path[r]]={}}a=a[n.path[r]]}switch(n.kind){case"A":d(a[n.path[r]],n.index,n.item);break;case"D":a[n.path[r]]=n.lhs;break;case"E":a[n.path[r]]=n.lhs;break;case"N":delete a[n.path[r]];break}}}function v(e,t,n){if(e&&t){var a=function(a){if(!n||n(e,t,a)){b(e,t,a)}};c(e,t,a)}}Object.defineProperties(p,{diff:{value:p,enumerable:true},observableDiff:{value:c,enumerable:true},applyDiff:{value:v,enumerable:true},applyChange:{value:b,enumerable:true},revertChange:{value:k,enumerable:true},isConflict:{get:function(){return"undefined"!==typeof n},enumerable:true},noConflict:{value:function(){if(a){a.forEach(function(e){e()});a=null}return p},enumerable:true}});if(typeof module!=="undefined"&&module&&typeof exports==="object"&&exports&&module.exports===exports){module.exports=p}else{t.DeepDiff=p}}();
(function (global, factory) {
	if (typeof define === 'function' && define.amd) {
		define([], factory);
	} else if (typeof module !== 'undefined' && module.exports){
		module.exports = factory();
	} else {
		global.UriTemplate = factory();
	}
})(this, function () {
	var uriTemplateGlobalModifiers = {
		"+": true,
		"#": true,
		".": true,
		"/": true,
		";": true,
		"?": true,
		"&": true
	};
	var uriTemplateSuffices = {
		"*": true
	};

	function notReallyPercentEncode(string) {
		return encodeURI(string).replace(/%25[0-9][0-9]/g, function (doubleEncoded) {
			return "%" + doubleEncoded.substring(3);
		});
	}

	function uriTemplateSubstitution(spec) {
		var modifier = "";
		if (uriTemplateGlobalModifiers[spec.charAt(0)]) {
			modifier = spec.charAt(0);
			spec = spec.substring(1);
		}
		var separator = "";
		var prefix = "";
		var shouldEscape = true;
		var showVariables = false;
		var trimEmptyString = false;
		if (modifier == '+') {
			shouldEscape = false;
		} else if (modifier == ".") {
			prefix = ".";
			separator = ".";
		} else if (modifier == "/") {
			prefix = "/";
			separator = "/";
		} else if (modifier == '#') {
			prefix = "#";
			shouldEscape = false;
		} else if (modifier == ';') {
			prefix = ";";
			separator = ";",
			showVariables = true;
			trimEmptyString = true;
		} else if (modifier == '?') {
			prefix = "?";
			separator = "&",
			showVariables = true;
		} else if (modifier == '&') {
			prefix = "&";
			separator = "&",
			showVariables = true;
		}

		var varNames = [];
		var varList = spec.split(",");
		var varSpecs = [];
		var varSpecMap = {};
		for (var i = 0; i < varList.length; i++) {
			var varName = varList[i];
			var truncate = null;
			if (varName.indexOf(":") != -1) {
				var parts = varName.split(":");
				varName = parts[0];
				truncate = parseInt(parts[1]);
			}
			var suffices = {};
			while (uriTemplateSuffices[varName.charAt(varName.length - 1)]) {
				suffices[varName.charAt(varName.length - 1)] = true;
				varName = varName.substring(0, varName.length - 1);
			}
			var varSpec = {
				truncate: truncate,
				name: varName,
				suffices: suffices
			};
			varSpecs.push(varSpec);
			varSpecMap[varName] = varSpec;
			varNames.push(varName);
		}
		var subFunction = function (valueFunction) {
			var result = "";
			var startIndex = 0;
			for (var i = 0; i < varSpecs.length; i++) {
				var varSpec = varSpecs[i];
				var value = valueFunction(varSpec.name);
				if (value == null || (Array.isArray(value) && value.length == 0) || (typeof value == 'object' && Object.keys(value).length == 0)) {
					startIndex++;
					continue;
				}
				if (i == startIndex) {
					result += prefix;
				} else {
					result += (separator || ",");
				}
				if (Array.isArray(value)) {
					if (showVariables) {
						result += varSpec.name + "=";
					}
					for (var j = 0; j < value.length; j++) {
						if (j > 0) {
							result += varSpec.suffices['*'] ? (separator || ",") : ",";
							if (varSpec.suffices['*'] && showVariables) {
								result += varSpec.name + "=";
							}
						}
						result += shouldEscape ? encodeURIComponent(value[j]).replace(/!/g, "%21") : notReallyPercentEncode(value[j]);
					}
				} else if (typeof value == "object") {
					if (showVariables && !varSpec.suffices['*']) {
						result += varSpec.name + "=";
					}
					var first = true;
					for (var key in value) {
						if (!first) {
							result += varSpec.suffices['*'] ? (separator || ",") : ",";
						}
						first = false;
						result += shouldEscape ? encodeURIComponent(key).replace(/!/g, "%21") : notReallyPercentEncode(key);
						result += varSpec.suffices['*'] ? '=' : ",";
						result += shouldEscape ? encodeURIComponent(value[key]).replace(/!/g, "%21") : notReallyPercentEncode(value[key]);
					}
				} else {
					if (showVariables) {
						result += varSpec.name;
						if (!trimEmptyString || value != "") {
							result += "=";
						}
					}
					if (varSpec.truncate != null) {
						value = value.substring(0, varSpec.truncate);
					}
					result += shouldEscape ? encodeURIComponent(value).replace(/!/g, "%21"): notReallyPercentEncode(value);
				}
			}
			return result;
		};
		var guessFunction = function (stringValue, resultObj) {
			if (prefix) {
				if (stringValue.substring(0, prefix.length) == prefix) {
					stringValue = stringValue.substring(prefix.length);
				} else {
					return null;
				}
			}
			if (varSpecs.length == 1 && varSpecs[0].suffices['*']) {
				var varSpec = varSpecs[0];
				var varName = varSpec.name;
				var arrayValue = varSpec.suffices['*'] ? stringValue.split(separator || ",") : [stringValue];
				var hasEquals = (shouldEscape && stringValue.indexOf('=') != -1);	// There's otherwise no way to distinguish between "{value*}" for arrays and objects
				for (var i = 1; i < arrayValue.length; i++) {
					var stringValue = arrayValue[i];
					if (hasEquals && stringValue.indexOf('=') == -1) {
						// Bit of a hack - if we're expecting "=" for key/value pairs, and values can't contain "=", then assume a value has been accidentally split
						arrayValue[i - 1] += (separator || ",") + stringValue;
						arrayValue.splice(i, 1);
						i--;
					}
				}
				for (var i = 0; i < arrayValue.length; i++) {
					var stringValue = arrayValue[i];
					if (shouldEscape && stringValue.indexOf('=') != -1) {
						hasEquals = true;
					}
					var innerArrayValue = stringValue.split(",");
					for (var j = 0; j < innerArrayValue.length; j++) {
						if (shouldEscape) {
							innerArrayValue[j] = decodeURIComponent(innerArrayValue[j]);
						}
					}
					if (innerArrayValue.length == 1) {
						arrayValue[i] = innerArrayValue[0];
					} else {
						arrayValue[i] = innerArrayValue;
					}
				}

				if (showVariables || hasEquals) {
					var objectValue = resultObj[varName] || {};
					for (var j = 0; j < arrayValue.length; j++) {
						var innerValue = stringValue;
						if (showVariables && !innerValue) {
							// The empty string isn't a valid variable, so if our value is zero-length we have nothing
							continue;
						}
						if (typeof arrayValue[j] == "string") {
							var stringValue = arrayValue[j];
							var innerVarName = stringValue.split("=", 1)[0];
							var stringValue = stringValue.substring(innerVarName.length + 1);
							innerValue = stringValue;
						} else {
							var stringValue = arrayValue[j][0];
							var innerVarName = stringValue.split("=", 1)[0];
							var stringValue = stringValue.substring(innerVarName.length + 1);
							arrayValue[j][0] = stringValue;
							innerValue = arrayValue[j];
						}
						if (objectValue[innerVarName] !== undefined) {
							if (Array.isArray(objectValue[innerVarName])) {
								objectValue[innerVarName].push(innerValue);
							} else {
								objectValue[innerVarName] = [objectValue[innerVarName], innerValue];
							}
						} else {
							objectValue[innerVarName] = innerValue;
						}
					}
					if (Object.keys(objectValue).length == 1 && objectValue[varName] !== undefined) {
						resultObj[varName] = objectValue[varName];
					} else {
						resultObj[varName] = objectValue;
					}
				} else {
					if (resultObj[varName] !== undefined) {
						if (Array.isArray(resultObj[varName])) {
							resultObj[varName] = resultObj[varName].concat(arrayValue);
						} else {
							resultObj[varName] = [resultObj[varName]].concat(arrayValue);
						}
					} else {
						if (arrayValue.length == 1 && !varSpec.suffices['*']) {
							resultObj[varName] = arrayValue[0];
						} else {
							resultObj[varName] = arrayValue;
						}
					}
				}
			} else {
				var arrayValue = (varSpecs.length == 1) ? [stringValue] : stringValue.split(separator || ",");
				var specIndexMap = {};
				for (var i = 0; i < arrayValue.length; i++) {
					// Try from beginning
					var firstStarred = 0;
					for (; firstStarred < varSpecs.length - 1 && firstStarred < i; firstStarred++) {
						if (varSpecs[firstStarred].suffices['*']) {
							break;
						}
					}
					if (firstStarred == i) {
						// The first [i] of them have no "*" suffix
						specIndexMap[i] = i;
						continue;
					} else {
						// Try from the end
						for (var lastStarred = varSpecs.length - 1; lastStarred > 0 && (varSpecs.length - lastStarred) < (arrayValue.length - i); lastStarred--) {
							if (varSpecs[lastStarred].suffices['*']) {
								break;
							}
						}
						if ((varSpecs.length - lastStarred) == (arrayValue.length - i)) {
							// The last [length - i] of them have no "*" suffix
							specIndexMap[i] = lastStarred;
							continue;
						}
					}
					// Just give up and use the first one
					specIndexMap[i] = firstStarred;
				}
				for (var i = 0; i < arrayValue.length; i++) {
					var stringValue = arrayValue[i];
					if (!stringValue && showVariables) {
						// The empty string isn't a valid variable, so if our value is zero-length we have nothing
						continue;
					}
					var innerArrayValue = stringValue.split(",");
					var hasEquals = false;

					if (showVariables) {
						var stringValue = innerArrayValue[0]; // using innerArrayValue
						var varName = stringValue.split("=", 1)[0];
						var stringValue = stringValue.substring(varName.length + 1);
						innerArrayValue[0] = stringValue;
						var varSpec = varSpecMap[varName] || varSpecs[0];
					} else {
						var varSpec = varSpecs[specIndexMap[i]];
						var varName = varSpec.name;
					}

					for (var j = 0; j < innerArrayValue.length; j++) {
						if (shouldEscape) {
							innerArrayValue[j] = decodeURIComponent(innerArrayValue[j]);
						}
					}

					if ((showVariables || varSpec.suffices['*'])&& resultObj[varName] !== undefined) {
						if (Array.isArray(resultObj[varName])) {
							resultObj[varName] = resultObj[varName].concat(innerArrayValue);
						} else {
							resultObj[varName] = [resultObj[varName]].concat(innerArrayValue);
						}
					} else {
						if (innerArrayValue.length == 1 && !varSpec.suffices['*']) {
							resultObj[varName] = innerArrayValue[0];
						} else {
							resultObj[varName] = innerArrayValue;
						}
					}
				}
			}
		};
		subFunction.varNames = varNames;
		return {
			prefix: prefix,
			substitution: subFunction,
			unSubstitution: guessFunction
		};
	}

	function UriTemplate(template) {
		if (!(this instanceof UriTemplate)) {
			return new UriTemplate(template);
		}
		var parts = template.split("{");
		var textParts = [parts.shift()];
		var prefixes = [];
		var substitutions = [];
		var unSubstitutions = [];
		var varNames = [];
		while (parts.length > 0) {
			var part = parts.shift();
			var spec = part.split("}")[0];
			var remainder = part.substring(spec.length + 1);
			var funcs = uriTemplateSubstitution(spec);
			substitutions.push(funcs.substitution);
			unSubstitutions.push(funcs.unSubstitution);
			prefixes.push(funcs.prefix);
			textParts.push(remainder);
			varNames = varNames.concat(funcs.substitution.varNames);
		}
		this.fill = function (valueFunction) {
			if (valueFunction && typeof valueFunction !== 'function') {
				var value = valueFunction;
				valueFunction = function (varName) {
					return value[varName];
				};
			}

			var result = textParts[0];
			for (var i = 0; i < substitutions.length; i++) {
				var substitution = substitutions[i];
				result += substitution(valueFunction);
				result += textParts[i + 1];
			}
			return result;
		};
		this.fromUri = function (substituted) {
			var result = {};
			for (var i = 0; i < textParts.length; i++) {
				var part = textParts[i];
				if (substituted.substring(0, part.length) !== part) {
					return undefined;
				}
				substituted = substituted.substring(part.length);
				if (i >= textParts.length - 1) {
					if (substituted == "") {
						break;
					} else {
						return undefined;
					}
				}
				var nextPart = textParts[i + 1];
				var offset = i;
				while (true) {
					if (offset == textParts.length - 2) {
						var endPart = substituted.substring(substituted.length - nextPart.length);
						if (endPart !== nextPart) {
							return undefined;
						}
						var stringValue = substituted.substring(0, substituted.length - nextPart.length);
						substituted = endPart;
					} else if (nextPart) {
						var nextPartPos = substituted.indexOf(nextPart);
						var stringValue = substituted.substring(0, nextPartPos);
						substituted = substituted.substring(nextPartPos);
					} else if (prefixes[offset + 1]) {
						var nextPartPos = substituted.indexOf(prefixes[offset + 1]);
						if (nextPartPos === -1) nextPartPos = substituted.length;
						var stringValue = substituted.substring(0, nextPartPos);
						substituted = substituted.substring(nextPartPos);
					} else if (textParts.length > offset + 2) {
						// If the separator between this variable and the next is blank (with no prefix), continue onwards
						offset++;
						nextPart = textParts[offset + 1];
						continue;
					} else {
						var stringValue = substituted;
						substituted = "";
					}
					break;
				}
				unSubstitutions[i](stringValue, result);
			}
			return result;
		}
		this.varNames = varNames;
		this.template = template;
	}
	UriTemplate.prototype = {
		toString: function () {
			return this.template;
		},
		fillFromObject: function (obj) {
			return this.fill(obj);
		}
	};

	return UriTemplate;
});

/* global angular:false */
'use strict';

(function(global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['angular', 'uri-templates', 'deep-diff'], factory);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(require('angular'), require('uri-templates'), require('deep-diff'));
    } else {
        global.ModelFactory = factory(global.angular, global.UriTemplate, global.DeepDiff);
    }
})(this, function(angular, UriTemplate, DeepDiff) {

var module = angular.module('modelFactory', []);

// compression
var forEach = angular.forEach,
    extend = angular.extend,
    copy = angular.copy;

// keywords that are reserved for model instance
// internal usage only and to be stripped
// before sending to server
var instanceKeywords = [ '$$array', '$save', '$destroy',
    '$pending', '$rollback', '$diff', '$update', '$commit', '$copy' ];

// keywords that are reserved for the model static
// these are used to determine if a attribute should be extended
// to the model static class for like a helper that is not a http method
var staticKeywords = [ 'actions', 'instance', 'list', 'defaults',
    'pk', 'stripTrailingSlashes', 'map'];

// Deep extends
// http://stackoverflow.com/questions/15310935/angularjs-extend-recursive
var extendDeep = function (dst) {
    forEach(arguments, function (obj) {
        if (obj !== dst) {
            forEach(obj, function (value, key) {
                if (instanceKeywords.indexOf(key) === -1) {
                    if (dst[key]) {
                        if (angular.isArray(dst[key])) {
                            dst[key].concat(value.filter(function (v) {
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
var shallowClearAndCopy = function(src, dst) {
    dst = dst || {};

    // Remove any properties in destination that were not
    // returned from the source
    forEach(dst, function (value, key) {
        if(!src.hasOwnProperty(key) && key.charAt(0) !== '$') {
            delete dst[key];
        }
    });

    for(var key in src) {

        if(src.hasOwnProperty(key) && key.charAt(0) !== '$')  {
            // For properties common to both source and destination,
            // check for object references and recurse as needed. Route around
            // arrays to prevent value/order inconsistencies
            if(angular.isObject(src[key]) && !angular.isArray(src[key])) {
                dst[key] = shallowClearAndCopy(src[key], dst[key]);
            } else {
                // Not an object, so just overwrite with value from source
                dst[key] = src[key];
            }
        }
    }

    return dst;
};


module.provider('$modelFactory', function(){
    var provider = this;

    provider.defaultOptions = {

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

    provider.$get = ['$rootScope', '$http', '$q', '$log', '$cacheFactory', function($rootScope, $http, $q, $log, $cacheFactory) {

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

            /**
             * Make a pretty name from the url
             * for the event emitters
             */
            var nameSplit = url.split('/'),
                prettyName = nameSplit[nameSplit.length - 1];

            // copy so we also extend our defaults and not override
            //var actions = angular.extend({}, defaultOptions.actions, options.actions);
            options = extendDeep({}, copy(provider.defaultOptions), options);

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
                value = value || [];

                // wrap each obj
                value.forEach(function(v, i){
                    // this should not happen but prevent blow up
                    if(v === null || v === undefined) return;

                    // reset to new instance
                    value[i] = wrapAsNewModelInstance(v, value);
                });

                // override push to set an instance
                // of the list on the model so destroys will chain
                var __oldPush = value.push;
                value.push = function(){
                    // Array.push(..) allows to pass in multiple params
                    var args = Array.prototype.slice.call(arguments);

                    for(var i=0; i<args.length; i++){
                        args[i] = wrapAsNewModelInstance(args[i], value);
                    }

                    __oldPush.apply(value, args);
                };

                // add list helpers
                if(options.list){
                    extend(value, options.list);
                }

                return value;
            };

            // helper function for creating a new instance of a model from
            // a raw JavaScript obj. If it is already a model, it will be left
            // as it is
            var  wrapAsNewModelInstance = function(rawObj, arrayInst){
                // create an instance
                var inst = rawObj.constructor === Model ?
                    rawObj : new Model(rawObj);

                // set a pointer to the array
                inst.$$array = arrayInst;

                return inst;
            };

            // ES5, IE compatible version to retrieve the name of a function. ES6
            // would permit to do something like functionRef.name
            var functionName = function(fun){
                var ret = fun.toString();
                ret = ret.substr('function '.length);
                ret = ret.substr(0, ret.indexOf('('));
                return ret;
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
                var instance = this,
                    commits = [];

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
                            value[k] = copy(v(value));
                        } else {
                            value[k] = copy(v);
                        }
                    }
                });

                // Map all the objects to new names or relationships
                forEach(options.map, function(v, k){
                    if (functionName(v) === functionName(Model) || functionName(v) === functionName(ModelCollection)) {
                        value[k] = new v(value[k]); // jshint ignore:line
                    } else if (typeof v === 'function') {
                        // if its a function, invoke it,
                        // this would be helpful for seralizers
                        // like: map: { date: function(val){ return moment(val) } }
                        value[k] = v(value[k], value);
                    } else {
                        value[k] = value[v];
                        delete value[v];
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
                     var actionType = instance[options.pk] ? 'update' : 'post',
                         promise = Model[actionType](this);

                    instance.$pending = true;

                    promise.then(function(value){
                        instance.$pending = false;

                        // extend the value from the server to me
                        if (value) {
                            instance.$update(value);
                        }

                        var broadcastName = actionType === 'post' ? 'created' : 'updated';
                        $rootScope.$broadcast(prettyName + '-' + broadcastName, instance);

                        // commit the change for reversion
                        commits.push(angular.toJson(instance));
                    }, function () {
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

                    var promise = Model.delete(this);
                    instance.$pending = true;

                    promise.then(function(){
                        instance.$pending = false;

                        var arr = instance.$$array;
                        if(arr){
                            arr.splice(arr.indexOf(instance), 1);
                        }

                        $rootScope.$broadcast(prettyName + '-destroyed', instance);
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
                instance.$diff = function(version){
                    var prevCommit = commits[version || commits.length - 1],
                        currCommit = angular.toJson(instance);

                    return DeepDiff.diff(JSON.parse(prevCommit), JSON.parse(currCommit), function(path, key) {
                        return key[0] === '$';
                    });
                };


                /**
                 * Commits the change the commits bucket for rollback later if needed.
                 */
                instance.$commit = function () {
                    // stringify it so you have a clean instance
                    commits.push(angular.toJson(instance));
                    return instance;
                };

                /**
                 * Reverts the current instance back either the latest instance
                 * or you can pass a specific instance on the commits stack.
                 */
                instance.$rollback = function(version) {
                    var prevCommit = commits[version || commits.length - 1];
                    instance.$update(JSON.parse(prevCommit));
                    return instance;
                };

                /**
                 * Extends the properties of the new object onto
                 * the current object without replacing it.  Helpful
                 * when copying and then re-copying new props back
                 */
                instance.$update = function(n){
                    shallowClearAndCopy(n, instance);
                    return instance;
                };


                /**
                 * Creates a copy by taking the raw data values and by
                 * creating a new instance of the model.
                 */
                instance.$copy = function(){
                  // get the raw data of the model
                  var rawData = angular.toJson(this);

                  // ..then wrap it into a new instance to create a clone
                  return new Model(angular.fromJson(rawData));
                };

                // Create a copy of the value last so we get all the goodies,
                // like default values and whatnot.
                instance.$commit();
            }

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

                // make sure we have a method specified, otherwise
                // default to GET
                clone.method = clone.method || 'GET';

                // uri template to parameterize
                var uri = options.prefix ? options.prefix + '/' : '';

                // make sure we didn't override the base url prefixing
                if(!clone.override){

                    // set the uri to the base
                    uri += url;

                    // if we have a url defined, append to base
                    if(clone.url) {
                        uri += '/' + clone.url;
                    }


                    // set the uri to the base
                    uri = Model.$url(uri, data, clone.method);

                    // attach the pk referece by default if it is a 'core' type
                    if(action === 'get' || action === 'post' || action === 'update' || action === 'delete'){
                        uri += '/{' + options.pk + '}';
                    }

                    if(clone.method === 'GET' && (angular.isString(data) || angular.isNumber(data))){
                        // if we have a get method and its a number or a string
                        // you can assume i'm wanting to do something like:
                        // ZooModel.get(1234) instead of ZooModel.get({ id: 1234 });
                        var obj = {};
                        obj[options.pk] = data;
                        data = obj;

                        // if we have a extra argument on this case we should assume its a
                        //
                        if(extras){
                            // data.param = extras;
                            clone.params = extendDeep({}, clone.params, extras);
                            // uri += '{?param*}';
                        }
                    } else if(clone.method === 'GET' && angular.isObject(data)){
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

                clone.url = Model.$url(uri, data, clone.method);

                // don't include the payload for DELETE requests
                if(action !== 'delete' && clone.method !== 'DELETE'){
                    clone.data = data;
                }

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

                $http(params).then(function(response){
                    // after callbacks
                    if(params.afterRequest) {
                        var transform = params.afterRequest(response.data);
                        if(transform) {
                            response.data = transform;
                        }
                    }

                    // if we had a cache, remove it
                    // this could be optimized to only do
                    // the invalidation of things by id/etc
                    if(params.invalidateCache){
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
                }, def.reject).finally(function () {
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
            Model.$url = function(u, params, method){
                var uri = new UriTemplate(u || url)
                            .fill(function(variableName){
                                var resolvedVariable = params[variableName];

                                // if we have a match, substitute and remove it
                                // from the original params object
                                if(resolvedVariable){
                                    // only remove params on GET requests as the
                                    // passed object is intended to be used
                                    // as URL params. For persistent HTTP calls
                                    // the object has to be left as it is (for now)
                                    if(method === 'GET'){
                                      delete params[variableName];
                                    }

                                    return resolvedVariable;
                                }else{
                                    // ?? log an error??
                                    return null;
                                }
                            });
                            // .fillFromObject(params || {});

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
                if(args && typeof args === 'object'){
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
        }

        return modelFactory;
    }];
});

return module;
});
