class Point
  constructor: (@x, @y) ->
class Size
  constructor: (@width, @height) ->
class Rect
  constructor: (@point, @size) ->

root = {}

root.point = {}
root.point.make = pm =  (x, y) -> new Point(x, y)

# Distance between two points (magnitude)
root.point.distance = (pt1, pt2) ->
  Math.sqrt(Math.pow((pt2.x - pt1.x), 2) + Math.pow((pt2.y - pt1.y), 2))

root.point.ZERO = root.point.make(0,0)


root.size = {}
root.size.make = (width, height) -> new Size(width, height)

root.rect = {}
root.rect.make = (x,y,width,height) -> new Rect(new Point(x,y), new Size(width,height))

root.rect.makeFromGridBounds = (ulBound, lrBound) ->
  {gridX:x, gridY:y} = ulBound
  width = lrBound.gridX - x
  height = lrBound.gridY - y
  root.rect.make x, y, width, height

root.rect.toGridBounds = (rect) ->
  [{gridX: rect.point.x, gridY:rect.point.y}, {gridX:(rect.point.x + rect.size.width), gridY:(rect.point.y + rect.size.height)}]

root.rect.ZERO = root.rect.make(0,0,0,0)
root.rect.area = (rect) -> rect.size.width * rect.size.height

root.rect.points = (rect) ->
  [
    pm(rect.point.x, rect.point.y) # Top left
    pm(rect.point.x + rect.size.width, rect.point.y) # Top right
    pm(rect.point.x + rect.size.width, rect.point.y + rect.size.height) # Bottom right
    pm(rect.point.x, rect.point.y + rect.size.height) # Bottom left
  ]

# Returns all the whole-number points within the provided rect.
root.rect.surfacePoints = (rect) ->
  pts = []
  for y in [0..(Math.floor(rect.size.width))]
    for x in [0..(Math.floor(rect.size.height))]
      do (x,y) ->
        pts.push root.point.make(rect.point.x + x, rect.point.y + y)
  pts

root.rect.intersects = (rect1, rect2) ->
  for pt in root.rect.points(rect2)
    return true if root.rect.contains(rect1, pt)
  false

root.rect.contains = (rect, pt) ->
  [tl, tr, br, bl] = root.rect.points(rect)
  # Touching a line is "in"
  pt.x >= tl.x && pt.x <= br.x && pt.y >= tl.y && pt.y <= br.y

module.exports = root
