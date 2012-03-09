mf = require "mf"

class StateLatch
  constructor: (taskManager, evts, onAllFiredCb) ->
    @_taskManager = taskManager ? mf.core.taskManager()
    @_firedEvents = {}
    @_allowedEvents = evts ? []
    @_done = false
    for evt in evts
      @_firedEvents[evt] = false

    @_onAllFiredCb = onAllFiredCb ? (->)

    if evts.length < 1
      # Fire next.
      @_allFired()
      @_taskManager.runTask @_onAllFiredCb

  record: (evt) ->
    ret = false
    if @_allowedEvents.indexOf(evt) >= 0
      @_firedEvents[evt] = true
      ret = true
      @checkAllFired()
    ret

  checkAllFired: ->
    for k, v of @_firedEvents
      if not v
        return
    @_allFired()

  _allFired: ->
    @_done = true
    @_taskManager.runTaskFast @_onAllFiredCb

  done: ->
    @_done

  getTrigger: (state) ->
    return (=>
      @record(state)
    )


module.exports = StateLatch
