const {clazz, getter, setter, alias, lens, modify} = require('../src/main')

//Define a class-like object using the 'clazz' helper (or with any other)
const Point = clazz({
  //Define constructors
  constructor(x, y) {
    return {x,y}
  },
  toString(){
    return `(${this.x}, ${this.y})`
  },
  // Easily define getters and immutable setters with support for validation:
  setX:setter('x'),
  setY:setter('y'),
  getX:getter('x'),
  getY:getter('y'),
})

exports.getterSetter = (test) => {

  // Create the object as you normally would.
  point = Point(1, 2)

  // Apply transformations to an object to get a new one
  newPoint = point
              .setX(2)
              .setY(3) 

  // The reference to the new object is updated
  test.equal(newPoint.toString(), '(2, 3)')

  // Old value remains unchanged
  test.equal(point.toString(), '(1, 2)' )

  test.done()
}


const Circle = clazz({

  //Use the objects that you have to build new ones.
  constructor (x, y, radius) {
    const center = Point(x, y)
    return { center, radius }
  },

  //Create lenses for accessing properties of member objects
  printCenter: alias('center', 'toString'),
  
  // Create lenses for modifying properties of member objects.
  setX:lens('center', 'setX'),
  setY:lens('center', 'setY'),

  // Use the low level 'modify' method to define custom modification methods without also defining explicit setters
  changeSize (amount) {
    return modify(this, {radius: this.radius + amount})
  }
})

exports.hierarchies = (test) => {
  const circle = Circle(0, 0, 1)
  // And use methods for both the host and member objects.
  biggerCircle = circle
                  .changeSize(1)
                  .setX(10)
                  .setY(10)

  test.equal(biggerCircle.radius, 2)

  test.equal(biggerCircle.printCenter(), '(10, 10)')

  test.done()
}
