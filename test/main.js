const {clazz, getter, setter, alias, lens, assign} = require('../src/main')

const number = (val) => {
  if (typeof val === 'number') {
    return val
  } else {
    throw new Error(val + ' is not a number')
  }
}

//Define a class-like object using the 'clazz' helper (or with any other)
const Point = clazz({
  // Declare properties and their default values
  x: 0, 
  y: 0,
  // Easily define getters and immutable setters with support for validation:
  setX: setter('x', number),
  setY: setter('y', number),
  getX: getter('x'),
  getY: getter('y'),
  // Define normal methods
  toString(){
    return `(${this.x}, ${this.y})`
  },
})

exports.getterSetter = ({throws, equal, done}) => {

  // Create the object as you normally would.
  point = Point({x:1, y:2})

  // Apply transformations to an object to get a new one
  newPoint = point
              .setX(2)
              .setY(3) 

  // The reference to the new object is updated
  equal(newPoint.toString(), '(2, 3)')

  // Old value remains unchanged
  equal(point.toString(), '(1, 2)' )

  // Validation functions passed in to the setter are automatically  called
  throws(()=> { point.setX('a')} )

  // The properties you pass in the constructor are validated against the default values in the prototype
  throws(()=> Point({x:'1', y:'2'})) // ""x" is set to a value of type "string" in the constructor, but it is a "number" in the object prototype."
  done()
}


const Circle = clazz({
  center:Point(),
  radius: 0,

  //Create aliases  methods of member objects
  printCenter: alias('center', 'toString'),
  
  // Create lenses for modifying properties of member objects.
  setX:lens('center', 'setX'),
  setY:lens('center', 'setY'),

  // Use the low level 'assign' method to define custom modification methods without also defining explicit setters
  changeSize (amount) {
    return this.assign({radius: this.radius + amount})
  }
})

exports.hierarchies = ({throws, equal, done}) => {
  // When there is no constructor defined, you just pass a plain object that you want to use:
  const circle = Circle({radius:1})

  // You can use methods for both the host and member objects.
  biggerCircle = circle
                  .changeSize(1)
                  .setX(10)
                  .setY(10)

  equal(biggerCircle.radius, 2)
  equal(biggerCircle.printCenter(), '(10, 10)')
  //
  //lenses and aliases cannot be created if there are no default values for the properties
  throws(() => clazz({
    unexistingMethod: lens('unexistingProperty', 'method')
  })) // The property "unexistingProperty" is undefined in the clazz please set a default value for the property before making an lens
  
  //lenses and aliases cannot be created if there are no default values for the properties
  throws(() => clazz({
    center:Point(),
    unexistingMethod: lens('center', 'unexistingMethod')
  })) // The object that is stored in "center" does not have a method "unexistingMethod" You cannot create an lens for an unexisting method

  done()
}
