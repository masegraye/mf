assert = harness.assert

mf            = require "mf"
geometry = mf.component "geometry"
suite "Geometry", () ->
  test "The World", () ->
    assert.ok rect = geometry.rect.make(0, 0, 10, 10)
    assert.ok point = geometry.point.make(5, 5)
    assert.ok geometry.rect.contains(rect, point)

    assert.ok rect2 = geometry.rect.make(5, 5, 10, 10)
    assert.ok geometry.rect.intersects(rect, rect2)

    assert.equal 100, geometry.rect.area(rect2)

