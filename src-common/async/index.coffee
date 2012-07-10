
class Flag
  constructor: ->
    @_isSet = false

  set: (v) ->
    @_isSet = (v ? true)

  unset: ->
    @_isSet = false

  isSet: ->
    @_isSet

class AsyncCore
  constructor: (@_mf) ->

  mapUntil: (flag, collection, fun) ->
    c = new CondWalker(@_mf.core.taskManager(), flag, collection, fun)
    c.run()
    c

  flag: ->
    new Flag

class CondWalker
  constructor: (@_taskManager, @_flag, @_collection, @_fun) ->
    @_idx = 0
    @_canceled = new Flag()

  step: =>
    @_kick()

  _kick: ->
    if !@_canceled.isSet() && !@_flag.isSet() && (@_idx < @_collection.length)
      elt = @_collection[@_idx]
      @_idx++
      @_taskManager.runTask =>
        @_fun(@step, elt)

  run: ->
    @_kick()

  cancel: ->
    @_canceled.set()

module.exports = AsyncCore
