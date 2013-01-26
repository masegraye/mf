assert = harness.assert

mf            = require "mf"
Configuration = mf.component "configuration"

suite "Configuration", ->
  test "Basic get / set", ->
    conf = new Configuration {}

    conf.set("this", "that")
    assert.equal conf.get("this"), "that"

  test "Basic get", ->
    conf = new Configuration
      foo: 'bar'

    assert.equal conf.get('foo'), "bar"
    