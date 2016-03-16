Object.assign = Object.assign || require('assign')

/**
 * Creates a class-like object constructor.
 *
 * @param {object} proto The prototype. It can contain a `constructor` function which must return an object.
 * If it does not, a default constructor is used.
 * 
 * @returns {function} A function which calls the prototype's `constructor` method and then sets the prototype of
 * the resulting object to `proto`.
 */

exports.clazz = (proto) => {
  const constructor = typeof proto.constructor === 'function' ? proto.constructor : function(a){return a}
  return (...args) => Object.assign(Object.create(proto), constructor(...args))
}

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

exports.modify = function (source, ...targets) {
  return Object.freeze(Object.assign(Object.create(Object.getPrototypeOf(source)), source, ...targets))
}

/**
 * Creates a method that retrieves the value of a property.
 * @param {string} key The key of the property.
 * @returns {function} A function which when attached to an object returns the current value of the property.
 */

exports.getter = (key) =>
  function() {
    return this[key]
  }

/**
 * Creates a method that changes the value of a property (by creating a new version of the object).
 *
 * @param {string} key The key of the property.
 *
 * @returns {function} A function which when attached to an object returns a new version of the object to which it is attached,
 * where the value of `key` is changed changed to the one passed as an argument.
 */

exports.setter = (key) =>
  function (val) {
    return exports.modify(this, {[key]:val})
  }

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

exports.alias = (key, methodName) =>
  function(...args) {
    return this[key][methodName](...args)
  }

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

exports.lens = (key, methodName) =>
  function(...args) {
    return exports.modify(this, {[key]: this[key][methodName](...args)})
  }


