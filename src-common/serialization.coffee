init = (mf) ->

  class SerializationCore
    serializationCenter: ->
      new MfSerializationCenter()

  class MfSerializationCenter
    constructor: ->
      @knownTypes = {}

    unregisterAll: ->
      @knownTypes = {}

    # @param type String. The type of the object to be serialized. If an object has the
    #   attribute `serializeAs', the value it's set to will determine which handler
    #   is used, by the type name provided.
    # @param format String. The format this handler handles.
    # @param handler Object. Should have methods `serialize' and `deserialize', each taking their respective object/data
    registerHandler: (type, handler, format = "json") ->
      @knownTypes[type] ?= {}
      @knownTypes[type][format] = handler
    serialize: (obj, format = "json") ->
      type = obj.serializeAs
      unless typeof type == "string"
        throw "Requested serialization of object, but object did not provide a serialization type as attribute `serializeAs'"

      @knownTypes[type] ?= {}
      handler = @knownTypes[type][format]

      unless handler?
        throw "Requested serialization of type `#{type}' to format `#{format}', but no handler was registered"

      handler.serialize(obj)
    deserialize: (objData, type, format = "json") ->
      @knownTypes[type] ?= {}
      handler = @knownTypes[type][format]
      unless handler?
        throw "Requested deserialization of type `#{type}' from format `#{format}', but no handler was registerd"
      handler.deserialize(objData)

  mf.serialization = new SerializationCore()

if exports?
  module.exports = (options) ->
    init(options.mf)
else
  # We must attempt to load mf from the local scope
  throw "Core package is not in scope" unless mf?
  init(mf)
