mf = require "../../mf"

class CountdownLatch
  constructor: (args...) ->
    switch args.length
      when 1
        @_steps = 1
        @_onDone = args[0]
      when 2
        @_steps = args[0]
        @_onDone = args[1]
      else
        throw new Error("Expected either a callback, or a step number and callback")

    if @_steps < 1
      throw new Error("Expected at least one step in CountdownLatch.")

    @_curr = 0
    @_firing = false

    # If they pass us a steps of 0, or a negative steps, just fire it soon.
    @_maybeFire()
  step: (steps = 1) =>
    @_curr += steps
    @_maybeFire()

  _maybeFire: ->
    if @_curr >= @_steps and not @_firing
      @_firing = true
      mf.core.taskManager().runTaskFast @_onDone

module.exports = CountdownLatch
