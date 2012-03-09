_ = require "underscore"

class Set
  constructor: (initialSet...) ->
    # Use an object for fast lookup
    @members = {}
    @add initialSet...

  add: (members...) ->
    for k in members
      @members[k] = true

  remove: (member) ->
    m = @members[member]
    if m
      delete @members[member]
      m = member
    m

  contains: (member) ->
    @members[member]?

  toArray: ->
    (k for k, v of @members)

  clear: ->
    for k,v of @members
      @remove k

  toString: ->
    "Set [members=Array[#{@toArray().join(", ")}]]"

  each: (fun) ->
    for k, v of @members
      fun(k)
    undefined

  ##
  # Set operations.
  intersection: (set) ->
    new Set (k for k, v of @members when set.contains k)...

  union: (set) ->
    s = new Set @toArray()...
    s.add set.toArray()...
    s

  # Set subtraction. Not symetric.
  minus: (set) ->
    new Set (k for k, v of @members when ! set.contains k)...

  # Symetric difference. A union B - A intersect B. There's probably a
  # faster way to do this via direct array operations. But this is
  # correct.
  symDifference: (set) ->
    @union(set).minus(@intersection(set))

module.exports = Set
