'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

Object.assign = Object.assign || require('assign');
var id = function id(a) {
  return a;
};

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

var expandProps = function expandProps(proto) {
  return _typeof(proto.props) !== 'object' ? proto : Object.keys(props).reduce(function (proto, propName) {
    var propValue = proto.props[propName];
  }, proto);
};

var processProto = function processProto(proto) {
  return expandProps(Object.assign(proto, protoUtils));
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
  var constructor = typeof proto.constructor === 'function' ? proto.constructor : function (a) {
    return a;
  };
  var protoProcessed = processProto(proto);
  return function () {
    return Object.assign(Object.create(protoProcessed), constructor.apply(undefined, arguments));
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

exports.alias = function (key, methodName) {
  return function alias() {
    var _key5;

    return (_key5 = this[key])[methodName].apply(_key5, arguments);
  };
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

exports.lens = function (key, methodName) {
  return function lens() {
    var _key6;

    return exports.assign(this, _defineProperty({}, key, (_key6 = this[key])[methodName].apply(_key6, arguments)));
  };
};