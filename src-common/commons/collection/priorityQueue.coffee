class PriorityQueue
  constructor: (comparator) ->
    # root is at idx == 1 to make the arithmetic more intuitive.
    @_store      = [null]
    @_comparator = comparator ? (x, y) -> x > y

  enqueue: (val) ->
    store = @_store
    store[idx = store.length] = val
    @moveUp(idx)
    val

  dequeue: ->
    store = @_store
    val = store[1]
    store[1] = store[idx = store.length - 1]
    store.splice(-1)
    @moveDown(1)
    val

  moveUp: (idx) ->
    store = @_store
    if @_comparator(val = store[idx], store[par = @parentIdx(idx)]) #(val = store[idx]) > store[par = @parentIdx(idx)]
      store[idx] = store[par]
      store[par] = val
      @moveUp(par)
      par
    else
      val

  moveDown: (idx) ->
    store = @_store
    # this subtly relies on x <= undefined being false for all x to
    # do the right thing at leaf nodes
    lci = @leftChildIdx(idx)
    rci = @rightChildIdx(idx)
    if store[rci]? and ! @_comparator(store[lci], store[rci]) #store[lci = @leftChildIdx(idx)] <= store[rci = @rightChildIdx(idx)]
      child    = store[rci]
      childIdx = rci
    else
      child    = store[lci]
      childIdx = lci
    if child? and ! @_comparator(val = store[idx], child) #(val = store[idx]) <= child
      store[idx]      = child
      store[childIdx] = val
      console.dir [idx, val, childIdx, child]
      @moveDown(childIdx)
      childIdx
    else
      idx

  parentIdx: (idx) ->
    return null if idx <= 1
    Math.floor(idx/2)

  leftChildIdx: (idx) ->
    2 * idx

  rightChildIdx: (idx) ->
    2 * idx + 1

module.exports = PriorityQueue