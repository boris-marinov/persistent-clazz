'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

Object.assign = Object.assign || require('assign');
var id = function id(a) {
  return a;
};

var _require = require('lodash');

var difference = _require.difference;


var protoUtils = {
  assign: function assign() {
    var _exports;

    for (var _len = arguments.length, targets = Array(_len), _key = 0; _key < _len; _key++) {
      targets[_key] = arguments[_key];
    }

    return (_exports = exports).assign.apply(_exports, [this].concat(targets));
  },
  set: function set(name, val) {
    return exports.assign(this, _defineProperty({}, name, val));
  },
  remove: function remove() {
    var _exports2;

    for (var _len2 = arguments.length, props = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      props[_key2] = arguments[_key2];
    }

    return (_exports2 = exports).remove.apply(_exports2, [this].concat(props));
  }
};

var typeCheckProto = function typeCheckProto(proto) {
  Object.keys(proto).forEach(function (propName) {
    var prop = proto[propName];
    var meta = prop._clazzMetadata_;
    if ((typeof meta === 'undefined' ? 'undefined' : _typeof(meta)) === 'object') {
      var memberObject = proto[meta.key];
      if (typeof memberObject === 'undefined') {
        throw TypeError('The property \n\n                           "' + meta.key + '" is undefined in the clazz\n\n                           please set a default value for the property before making a(n) ' + meta.functionType);
      } else if ((typeof memberObject === 'undefined' ? 'undefined' : _typeof(memberObject)) !== 'object') {
        throw TypeError('The property \n\n                           "' + meta.key + '" is not an object.\n\n                           You cannot create an\n\n                           ' + meta.functionType + ' for a non-object property');
      } else if (typeof memberObject[meta.func] !== 'function') {
        throw TypeError('The object that is stored in \n\n                           "' + meta.key + '" does not have a method  \n\n                           "' + meta.func + '"\n\n                           You cannot create an ' + meta.functionType + ' for an unexisting method');
      }
    }
  });
  return proto;
};

var processProto = function processProto(proto) {
  return typeCheckProto(Object.assign(proto, protoUtils));
};

var typeCheck = function typeCheck(object, proto) {
  if (typeof object == 'undefined') {
    return {};
  } else if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) !== 'object') {
    throw TypeError('Constructor expects a plain object but got "' + (typeof object === 'undefined' ? 'undefined' : _typeof(object)) + '" instead');
  }
  Object.keys(object).forEach(function (key) {
    if (_typeof(object[key]) !== _typeof(proto[key])) {
      throw TypeError('"' + key + '" is set to a value of type \n\n                      "' + _typeof(object[key]) + '" in the constructor, but it is a \n\n                      "' + _typeof(proto[key]) + '" in the object prototype.');
    }
  });
  return object;
};

/**
 * Creates a class-like object constructor.
 *
 * @param {object} proto The prototype. 
 *
 * It can contain a key called `constructor` with function which must return an object.
 * If it does, this function is used as the object's constructor. If it does not, a default constructor is used. 
 *
 * It can also contain a key called `properties` with a plain object specifying all properties that the object can have: `default`, `lens`, `alias`. See below.
 * 
 * @returns {function} An object constructor which calls the prototype's `constructor` method and then sets the prototype of
 * the resulting object to `proto`.
 */

exports.clazz = function (proto) {
  var protoProcessed = processProto(proto);
  return function (obj) {
    return Object.assign(Object.create(protoProcessed), typeCheck(obj, proto));
  };
};

/**
 * Applies a transformation to one or several properties of an object and returns a transformed object with the same prototype
 * and the same values of non-altered properties.
 *
 * @param {object} source The object which you want to transform.
 *
 * @param {object} target A plain object containing one or several keys which are to be changed or added to the instance, 
 * along with their new values. Multiple targets are also supported.
 *
 * @returns {object} A new version of the instance object.
 *
 */

exports.assign = function (source) {
  for (var _len3 = arguments.length, targets = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    targets[_key3 - 1] = arguments[_key3];
  }

  return Object.freeze(Object.assign.apply(Object, [Object.create(Object.getPrototypeOf(source)), source].concat(targets)));
};

/**
 * Applies a transformation to one or several properties of an object and returns a transformed object with the same prototype
 * and the same values of non-altered properties.
 *
 * @param {object} source The object which you want to transform.
 *
 * @param {object} target A plain object containing one or several keys which are to be changed or added to the instance, 
 * along with their new values. Multiple targets are also supported.
 *
 * @returns {object} A new version of the instance object.
 *
 */
exports.remove = function (source) {
  var copy = Object.assign(Object.create(Object.getPrototypeOf(source)));

  for (var _len4 = arguments.length, props = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    props[_key4 - 1] = arguments[_key4];
  }

  return props.reduce(function (copy, prop) {
    delete copy[prop];
    return copy;
  }, copy);
};

/**
 * Creates a method that retrieves the value of a property.
 * @param {string} key The key of the property.
 * @returns {function} A function which when attached to an object returns the current value of the property.
 */

exports.getter = function (key) {
  return function getter() {
    return this[key];
  };
};

/**
 * Creates a method that changes the value of a property (by creating a new version of the object).
 *
 * @param {string} key The key of the property.
 *
 * @returns {function} A function which when attached to an object returns a new version of the object to which it is attached,
 * where the value of `key` is changed changed to the one passed as an argument.
 */

exports.setter = function (key, f) {
  return function (val) {
    return exports.assign(this, _defineProperty({}, key, (f || id)(val, this)));
  };
};

/**
 * Creates a method that calls another method on one of the values stored in the object and returns the result. 
 * May be used for creating shorthands for calling a `getter`.
 *
 * @param {string} key The key where the aliased object is stored.
 *
 * @param {string} methodName The name of the method.
 *
 * @returns {function} A function which when attached to an object calls the aliased method with the arguments given to it and returns the result.
 *
 */

exports.alias = function (key, func) {
  var f = function f() {
    var _key5;

    return (_key5 = this[key])[func].apply(_key5, arguments);
  };
  f._clazzMetadata_ = {
    key: key,
    func: func,
    functionType: 'alias'
  };
  return f;
};

/**
 * A combination between `set` and `alias`. Creates a method that modifies an object's key and returns a new version
 * of the object with the new version of the key. Can be for creating shorthands for calling a `setter`.
 *
 * @param {string} key The key where the aliased object is stored.
 *
 * @param {string} methodName The name of the method. The method should return a new version of the object.
 *
 * @returns {function} A function which when attached to an object calls the aliased method with the arguments given to it and returns a new version of the object where the value of `key` is replaced with the result of the method.
 */

exports.lens = function (key, func) {
  var f = function lens() {
    var _key6;

    return exports.assign(this, _defineProperty({}, key, (_key6 = this[key])[func].apply(_key6, arguments)));
  };
  f._clazzMetadata_ = {
    key: key,
    func: func,
    functionType: 'lens'
  };
  return f;
};