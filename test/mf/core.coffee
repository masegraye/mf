mf = require "mf"
assert = harness.assert

relative = (f) ->
  "#{__dirname}/#{f}"

suite "MF Context Detection", () ->
  test "correctly detects node context", () ->
    MfExecutionContextDetector = mf.core.getKlass "MfExecutionContextDetector"
    assert.isFunction MfExecutionContextDetector
    d = new MfExecutionContextDetector()
    context = d.detect()
    assert.isObject context
    assert.equal "node", context.name()
  test "can correctly override execution context", () ->
    loaderCalled = 0
    # Our fake context
    class FakeContext
      loader: ->
        loaderCalled++

    # MF_TEST_CONFIG is a global object. Be sure to reset when done.
    MF_TEST_CONFIG.EXECUTION_CONTEXT = new FakeContext()

    MfExecutionContextDetector = mf.core.getKlass "MfExecutionContextDetector"
    assert.isFunction MfExecutionContextDetector
    d = new MfExecutionContextDetector()
    context = d.detect()
    assert.isObject context
    assert.equal MF_TEST_CONFIG.EXECUTION_CONTEXT, context

    # Reset this, so other tests don't get trampled
    MF_TEST_CONFIG.EXECUTION_CONTEXT = undefined

    assert.isFunction context.loader
    context.loader()
    assert.equal(1, loaderCalled)

suite "MF Messages", () ->
  test "MfMessages is defined", () ->
    assert.isObject mf.messages
  test "can create channel", (done) ->
    owner = {}
    channel = mf.messages.channel owner
    assert.isObject channel
    assert.equal owner, channel.owner

    notificationCount = 0
    subscriber = (message) ->
      notificationCount++
      assert.equal "someMessage", message
      assert.equal 1, notificationCount
      done()
    channel.subscribe subscriber
    channel.publish owner, "someMessage"
  test "only owner can publish", () ->
    owner = {}
    impersonator = {}

    channel = mf.messages.channel owner
    assert.notEqual impersonator, channel.owner

    exceptions = 0
    try
      channel.publish impersonator, "impersonatedMessage"
    catch e
      assert.ok /Sentinel not equal/.test(e)
      exceptions++
    assert.equal 1, exceptions

  test "can cancel a subscription", (done) ->
    owner = {}
    channel = mf.messages.channel owner
    callCount = 0
    subscriber = (message) ->
      console.log 'here'
      callCount++

    monitor = (message) ->
      assert.equal 0, callCount
      done()


    channel.subscribe subscriber
    channel.subscribe monitor
    channel.unsubscribe subscriber
    channel.publish owner, "HELLO"
