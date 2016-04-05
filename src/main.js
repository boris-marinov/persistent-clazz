Object.assign = Object.assign || require('assign')
const id = a => a
const {difference} = require('lodash')

const protoUtils = {
  assign (...targets) {
    return exports.assign(this, ...targets)
  },
  set (name, val) {
    return exports.assign(this, {[name]: val})
  },
  remove (...props) {
    return exports.remove(this, ...props)
  }
}

const typeCheckProto = (proto) => {
  Object.keys(proto) 
    .forEach((propName) => {
      const prop = proto[propName] 
      const meta = prop._clazzMetadata_
      if(typeof meta === 'object') {
        const memberObject = proto[meta.key]
        if (typeof memberObject === 'undefined') {
          throw TypeError(`The property \n
                           "${meta.key}" is undefined in the clazz\n
                           please set a default value for the property before making a(n) ${meta.functionType}`)
        } else if (typeof memberObject !== 'object') {
          throw TypeError(`The property \n
                           "${meta.key}" is not an object.\n
                           You cannot create an\n
                           ${meta.functionType} for a non-object property`)
                           
        } else if (typeof memberObject[meta.func] !== 'function') {
          throw TypeError(`The object that is stored in \n
                           "${meta.key}" does not have a method  \n
                           "${meta.func}"\n
                           You cannot create an ${meta.functionType} for an unexisting method`)
        }
      }
    })
  return proto
}

const processProto = (proto) => typeCheckProto(Object.assign(proto, protoUtils))

const typeCheck = (object, proto) => {
  if(typeof object == 'undefined'){
    return {}
  } else if (typeof object !== 'object') {
    throw TypeError(`Constructor expects a plain object but got "${typeof object}" instead`)
  }
  Object.keys(object).forEach((key) => {
    if (typeof object[key] !== typeof proto[key]) {
      throw TypeError(`"${key}" is set to a value of type \n
                      "${typeof object[key]}" in the constructor, but it is a \n
                      "${typeof proto[key]}" in the object prototype.`)
    }
  })
  return object
}




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

exports.clazz = (proto) => {
  const protoProcessed = processProto(proto)
  return (obj) => Object.assign(Object.create(protoProcessed), typeCheck(obj, proto))
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

exports.assign = function (source, ...targets) {
  return Object.freeze(Object.assign(Object.create(Object.getPrototypeOf(source)), source, ...targets))
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
exports.remove = function (source, ...props) {
  const copy = Object.assign(Object.create(Object.getPrototypeOf(source)))
  return props.reduce((copy, prop) => {
    delete copy[prop]
    return copy
  }, copy)
}

/**
 * Creates a method that retrieves the value of a property.
 * @param {string} key The key of the property.
 * @returns {function} A function which when attached to an object returns the current value of the property.
 */

exports.getter = (key) =>
  function getter () {
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

exports.setter = (key, f) =>
  function (val) {
    return exports.assign(this, {[key]:(f||id)(val, this)})
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

exports.alias = (key, func) => {
  const f = function (...args) {
    return this[key][func](...args)
  }
  f._clazzMetadata_ = {
    key,
    func,
    functionType:'alias'
  }
  return f
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

exports.lens = (key, func) => {
  const f = function lens (...args) {
    return exports.assign(this, {[key]: this[key][func](...args)})
  }
  f._clazzMetadata_ = {
    key,
    func,
    functionType:'lens'
  }
  return f
}
