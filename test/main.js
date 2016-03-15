const {clazz, getter, setter, assign, alias, lens} = require('../src/main')
  
//Define a class-like object using the 'clazz' method
const Point = clazz({
  constructor(x, y) {
    return {x,y}
  },
  toString(){
    return `(${this.x}, ${this.y})`
  },
  // Easily define getters and immutable setters
  setX:setter('x'),
  setY:setter('y'),
  getX:getter('x'),
  getY:getter('y'),

})

exports.getterSetter = (test) => {
  point = Point(1, 2)
  newPoint = point.setX(2).setY(3) //Setters are fluent
  test.equal(newPoint.toString(), '(2, 3)')
  test.equal(point.toString(), '(1, 2)' )// Old value remains unchanged.
  test.done()
}

//Define hierarchies of objects.
const Circle = clazz({
  //Compose objects with one another
  constructor(x, y, radius) {
    const center = Point(x, y)
    return { center, radius }
  },
  //Create lenses for modifying properties of the member objects...
  setX:lens('center', 'setX'),
  setY:lens('center', 'setY'),

  setRadius:setter('radius'),
    
  toString () {
    return `${this.center.toString()}X3`
  }
})

exports.hierarchies = (test) => {
  circle = Circle(0, 0, 1)
  // And use methods for both the host and member objects.
  test.equal(circle.setX(1).setRadius(3).toString(), '(1, 0)X3')
  test.done()
}
