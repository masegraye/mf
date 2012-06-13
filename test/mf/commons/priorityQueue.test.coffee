assert = harness.assert

mf             = require "mf"
PriorityQueue  = mf.component "commons/collection/priorityQueue"

suite "Priority Queue", ->
  test "Sanity", ->
    assert.ok p = new PriorityQueue

  test "Enqueue and dequeue", ->
    assert.ok p = new PriorityQueue
    ar = [1..10]

    # enqueue the elements in random order
    while ar.length > 0
      n = ar.splice(Math.floor(Math.random() * ar.length), 1)[0]
      assert.ok p.enqueue n

    # dequeue highest priority first
    for i in [10..1]
      assert.equal i, p.dequeue()

