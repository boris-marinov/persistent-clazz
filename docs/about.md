# persistent-clazz
A collection of utilities for making lightweight persistent objects (and hierarchies of such) in JS.

This library facilitates a specific style of OOP which favours composition over inheritance and immutable over mutable.

![quote](./docs/quote.jpg)

##Motivation/About

Making a user friendly persistent API is tricky, especially when dealing with nested structures. You have to explicitly construct a new object on each change. You cannot just call a method of an object you reference - you have to update the reference with the new version.

However fluent persistent API's are also a real pleasure to use and they work as a very nice alternative to functional composition. JavaScript already has facilities for creating immmutable datastructures - the `Object.freeze` method so all it takes to finish up the job is to define a couple of very simple helpers.

##Example

The following example defines two types, `Point` and `Circle`, where both of them are persistent.

```javascript
