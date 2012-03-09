init = (mf) ->
  throw "Core package is not defined" unless mf?
  class MfMessages
    constructor: ->
      @channels = []
    channel: (owner) ->
      new MfMessageChannel(owner)

  class MfMessageChannel
    # Only the object used to construct this channel may publish messages
    # to this channel.
    constructor: (sentinel) ->
      @wrappedFuns = {}
      @owner = sentinel
      @notificationCenter = mf.core.notificationCenter()
      @name = "MfMessageChannel-#{mf.core.sequencer("MfMessageChannel").advance()}"
    publish: (sentinel, message) ->
      if sentinel != @owner
        throw "Sentinel not equal to the one provided during channel creation"
      unless message?
        throw "You must publish a meaningful message"

      @notificationCenter.notify this, @name, message
    # Subscribe to this external channel's messages
    subscribe: (fun) ->
      unless fun? && typeof fun == "function"
        throw "Message subscription requires a function"
      @wrappedFuns[fun] = (args) ->
        fun args[0]
      @notificationCenter.subscribe this, @name, @wrappedFuns[fun]
    unsubscribe: (fun) ->
      unless fun? && typeof fun == "function"
        throw "Message unsubscription requires a function"
      if @wrappedFuns[fun]
        @notificationCenter.cancel this, @name, @wrappedFuns[fun]
  mf.messages = new MfMessages()

if exports?
  module.exports = (options) ->
    init(options.mf)
else
  # We must attempt to load mf from the local scope
  throw "Core package is not in scope" unless mf?
  init(mf)
