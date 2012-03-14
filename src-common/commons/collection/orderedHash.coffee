class OrderedHash
  constructor: () ->
    @_nodes      = {}
    @_head       = @_tail = null
    @_arrayCache = []
    @_dirty      = true

  append: (k, v) ->
    return if @_nodes.hasOwnProperty k

    if @_tail
      node         = new Node(v, @_tail)
      @_tail._next = node
    else
      node = new Node v

    @_head  = node unless @_head
    @_tail  = node
    @_dirty = true
    @_nodes[k] = node

  get: (k) ->
    return @_nodes[k]._obj

  remove: (k) ->
    return unless node = @_nodes[k]

    next = node._next
    prev = node._prev

    next._prev = node._prev if next
    prev._next = node._next if prev

    @_head = next if prev == null
    @_tail = prev if next == null

    delete @_nodes[k]
    @_dirty = true
    return node._obj

  toArray: ->
    return @_arrayCache unless @_dirty
    node = @_head
    ar   = []
    while node != null
      ar.push node._obj
      node = node._next
    @_dirty      = false
    @_arrayCache = ar

class Node
  constructor: (obj, prev = null, next = null) ->
    @_obj  = obj
    @_prev = prev
    @_next = next

module.exports = OrderedHash