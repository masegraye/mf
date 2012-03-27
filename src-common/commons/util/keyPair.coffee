class KeyPair
  @get: (x, y) ->
    new @(x, y)

  constructor: (@x, @y) ->

  hashCode: ->
    prime = 31
    result = prime + @x
    result = prime * result + @y
    result

  equals: (other) ->
    other.x == @x and other.y == @y

  toString: () ->
    "[#{@x},#{@y}]"

module.exports = KeyPair
