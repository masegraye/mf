assert = harness.assert

mf            = require "mf"
Set           = mf.component "commons/collection/set"
StateGuard    = mf.component "commons/util/stateGuard"
Configuration = mf.component "commons/util/configuration"
StateLatch    = mf.component "commons/util/stateLatch"

suite "Commons", () ->
  test "Set", () ->
    s = new Set("massively", "fun")
    assert.instanceOf s, Set
    assert.ok s.contains("massively")
    assert.ok s.contains("fun")
    assert.ok !s.contains("boring")

    nope = s.remove("lame")
    assert.isUndefined nope

    m = s.remove("massively")

    assert.equal m, 'massively'
    assert.ok !s.contains("massively")
    assert.ok s.contains("fun")

    s.clear()

    assert.ok !s.contains("fun")

    s1 = new Set [1..3]...
    s2 = new Set [4..6]...

    assert.ok i = s1.intersection s2
    assert.equal i.toArray().length, 0

    assert.ok u = s1.union s2
    assert.equal u.toArray().length, 6

    s1 = new Set [1..3]...
    s2 = new Set [3..5]...

    assert.ok sub = s1.minus s2
    assert.equal sub.toArray().length, 2   # should contain 1, 2

    assert.ok sym = s1.symDifference s2
    assert.equal sym.toArray().length, 4   # should contain 1,2,4,5

  test "StateGuard", () ->
    s = new StateGuard("one", "two", "three")

    assert.throws (->
      s.require "one"
    ), /but not all were recorded/, "Required one without recording"

    s.record "one"

    assert.doesNotThrow (->
      s.require "one"
    ), /but not all were recorded/, "Required one with recording"

    assert.throws (->
      s.require "two"
    ), /but not all were recorded/, "Required two without recording"
  test "Configuration", () ->
    raw =
      propOne: 1
      propTwo: null
      propThree: 0

    config = new Configuration(raw)
    assert.equal 1, config.get("propOne")
    assert.equal null, config.get("propTwo")
    assert.equal 0, config.get("propThree")

    assert.equal 4, config.get("propFour", 4)

    # Make sure if we manually set a config value to undefined, it's sticky
    # and doesn't fall back to defaults
    config.set("propFive", undefined)
    assert.equal undefined, config.get("propFive", "defined")

    assert.equal "expensive", config.getf("expensiveProp", (->
      # EXPENSIVE OPS HERE
      "expensive"
    ))

  test "StateLatch", (done) ->
    tm = mf.core.taskManager()
    count = 0
    s = new StateLatch tm, ["one", "two"], ->
      assert.ok s.done()
      done()

    s.record("one")
    s.record("two")
