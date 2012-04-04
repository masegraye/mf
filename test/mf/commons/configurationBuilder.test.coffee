assert = harness.assert

mf            = require "mf"
ConfigurationBuilder = mf.component "configurationBuilder"

suite "Configuration Builder", () ->
  test "can set without scopes", () ->
    rawConfig =
      "global":
        "testOne" : 1
        "testTwo" : 2

    assert.ok config = ConfigurationBuilder.build(rawConfig, ["global"])

    assert.equal 1, config.get('testOne')
    assert.equal 2, config.get('testTwo')

  test "can set with multiple scopes", () ->
    rawConfig =
      "scopeOne":
        "testOne" : 1
      "scopeTwo":
        "testTwo": 2

    assert.ok config = ConfigurationBuilder.build(rawConfig, ["scopeOne", "scopeTwo"])

    assert.equal 1, config.get('testOne')
    assert.equal 2, config.get('testTwo')

  test "can set with scope unions", () ->
    rawConfig =
      "scopeThree+NOSCOPE":
        "testSix" : 6
      "scopeOne":
        "testOne": 1
      "scopeTwo":
        "testTwo": 2
      "scopeThree":
        "testThree": 3
      "scopeOne+scopeTwo":
        "testFour": 4
      "scopeTwo+scopeThree":
        "testFive": 5

    assert.ok config = ConfigurationBuilder.build rawConfig, ["scopeOne", "scopeTwo", "scopeThree"]

    assert.equal 1, config.get "testOne"
    assert.equal 2, config.get "testTwo"
    assert.equal 3, config.get "testThree"
    assert.equal 4, config.get "testFour"
    assert.equal 5, config.get "testFive"
    assert.equal undefined, config.get "testSix"

  test "unioned scopes override individual scopes", () ->
    rawConfig =
      "scopeOne+scopeTwo":
        "testThree" : 4
      "scopeOne":
        "testOne": 1
        "testTwo": 2
      "scopeTwo":
        "testThree": 3
        "testFour": 4

    assert.ok config = ConfigurationBuilder.build rawConfig, ["scopeOne", "scopeTwo"]

    assert.equal 1, config.get "testOne"
    assert.equal 2, config.get "testTwo"
    assert.equal 4, config.get "testFour"

    # And this should have been overriden
    assert.equal 4, config.get "testThree"



