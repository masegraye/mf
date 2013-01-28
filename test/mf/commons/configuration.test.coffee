assert = harness.assert

mf            = require "mf"
Configuration = mf.component "configuration"

suite "Configuration", ->
  test "Basic get / set", ->
    conf = new Configuration {}

    conf.set("this", "that")
    assert.equal conf.get("this"), "that"

  test "Basic get with overriden default", ->
    conf = new Configuration
      foo: "bar"

    assert.equal conf.get("foo"), "bar"
    conf.set("foo", "baz")
    assert.equal conf.get("foo"), "baz"
    conf.set("foo", null)
    assert.equal conf.get("foo"), null
