## Functions

<dl>
<dt><a href="#clazz">clazz(proto)</a> ⇒ <code>function</code></dt>
<dd><p>Creates a class-like object constructor.</p>
</dd>
<dt><a href="#assign">assign(source, target)</a> ⇒ <code>object</code></dt>
<dd><p>Applies a transformation to one or several properties of an object and returns a transformed object with the same prototype
and the same values of non-altered properties.</p>
</dd>
<dt><a href="#getter">getter(key)</a> ⇒ <code>function</code></dt>
<dd><p>Creates a method that retrieves the value of a property.</p>
</dd>
<dt><a href="#setter">setter(key)</a> ⇒ <code>function</code></dt>
<dd><p>Creates a method that changes the value of a property (by creating a new version of the object).</p>
</dd>
<dt><a href="#alias">alias(key, methodName)</a> ⇒ <code>function</code></dt>
<dd><p>Creates a method that calls another method on one of the values stored in the object and returns the result. 
May be used for creating shorthands for calling a <code>getter</code>.</p>
</dd>
<dt><a href="#lens">lens(key, methodName)</a> ⇒ <code>function</code></dt>
<dd><p>A combination between <code>set</code> and <code>alias</code>. Creates a method that modifies an object&#39;s key and returns a new version
of the object with the new version of the key. Can be for creating shorthands for calling a <code>setter</code>.</p>
</dd>
</dl>

<a name="clazz"></a>

## clazz(proto) ⇒ <code>function</code>
Creates a class-like object constructor.

**Kind**: global function  
**Returns**: <code>function</code> - An object constructor which calls the prototype's `constructor` method and then sets the prototype ofthe resulting object to `proto`.  

| Param | Type | Description |
| --- | --- | --- |
| proto | <code>object</code> | The prototype.  It can contain a key called `constructor` with function which must return an object. If it does, this function is used as the object's constructor. If it does not, a default constructor is used.  It can also contain a key called `properties` with a plain object specifying all properties that the object can have: `default`, `lens`, `alias`. See below. |

<a name="assign"></a>

## assign(source, target) ⇒ <code>object</code>
Applies a transformation to one or several properties of an object and returns a transformed object with the same prototypeand the same values of non-altered properties.

**Kind**: global function  
**Returns**: <code>object</code> - A new version of the instance object.  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>object</code> | The object which you want to transform. |
| target | <code>object</code> | A plain object containing one or several keys which are to be changed or added to the instance,  along with their new values. Multiple targets are also supported. |

<a name="getter"></a>

## getter(key) ⇒ <code>function</code>
Creates a method that retrieves the value of a property.

**Kind**: global function  
**Returns**: <code>function</code> - A function which when attached to an object returns the current value of the property.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key of the property. |

<a name="setter"></a>

## setter(key) ⇒ <code>function</code>
Creates a method that changes the value of a property (by creating a new version of the object).

**Kind**: global function  
**Returns**: <code>function</code> - A function which when attached to an object returns a new version of the object to which it is attached,where the value of `key` is changed changed to the one passed as an argument.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key of the property. |

<a name="alias"></a>

## alias(key, methodName) ⇒ <code>function</code>
Creates a method that calls another method on one of the values stored in the object and returns the result. May be used for creating shorthands for calling a `getter`.

**Kind**: global function  
**Returns**: <code>function</code> - A function which when attached to an object calls the aliased method with the arguments given to it and returns the result.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key where the aliased object is stored. |
| methodName | <code>string</code> | The name of the method. |

<a name="lens"></a>

## lens(key, methodName) ⇒ <code>function</code>
A combination between `set` and `alias`. Creates a method that modifies an object's key and returns a new versionof the object with the new version of the key. Can be for creating shorthands for calling a `setter`.

**Kind**: global function  
**Returns**: <code>function</code> - A function which when attached to an object calls the aliased method with the arguments given to it and returns a new version of the object where the value of `key` is replaced with the result of the method.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key where the aliased object is stored. |
| methodName | <code>string</code> | The name of the method. The method should return a new version of the object. |

