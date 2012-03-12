Set = require("../../mf").component "commons/collection/set"
_ = require "underscore"

class StateGuard
  constructor: (possibleStates...) ->
    @possibleStates = new Set(possibleStates...)
    @recordedStates = new Set()
  require: (requiredStates...) ->
    allPresent = _.all requiredStates, (s) =>
      @recordedStates.contains(s)
    if not allPresent
      throw new Error("StateGuard required states (#{requiredStates.join(", ")}), but not all were recorded")
    this
  prevent: (preventedStates...) ->
    preventers = _.any preventedStates, (s) =>
      @recordedStates.contains(s)

    if preventers
      throw new Error("State prevention requested. Wanted to prevent: (#{preventedStates.join(", ")}); states recorded: (#{@recordedStates.toString()})")
    this
  record: (newStates...) ->
    validStates = _.every newStates, (s) =>
      @possibleStates.contains(s)
    if validStates
      @recordedStates.add newStates...
    else
      throw new Error("Invalid state specified in `record'. Valid states are: (#{@possibleStates.toString()}). Provided (#{newStates.join(", ")})")
    this
  reset: ->
    @recordedStates.clear()
    @recordedStates = new Set()

StateGuard::deny = StateGuard::prevent

module.exports = StateGuard
