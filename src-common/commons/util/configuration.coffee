mf = require("../../mf")
ConfigurationSource = mf.component "configurationSource"
RawConfiguration = mf.component "rawConfiguration"

class Configuration
  constructor: (rawConfig) ->
    @source = new ConfigurationSource new RawConfiguration(undefined, rawConfig)

  # Exists solely for the purpose of determining if this is a configuration object
  # or not.
  _tooFancy: ->
    true
  # Defines get and set methods based on the configuration prototype
  # passed in. Proto is expected to be an object with the keys corresponding
  # to configuration values. This makes it easy to auto-accessorize with
  # a raw object configuration.
  #
  # This will define the methods directly on the object, rather than the prototype, preventing
  # leakage across objects extending Configuration.
  autoAccessorize: (schema) ->
    for k,v of schema
      do (k) =>
        mGet = "get#{k.charAt(0).toUpperCase()}#{k.substr(1)}"
        mfGet = "getf#{k.charAt(0).toUpperCase()}#{k.substr(1)}"
        mSet = "set#{k.charAt(0).toUpperCase()}#{k.substr(1)}"

        @[mGet] = (d) =>
          @get(k, d)

        @[mfGet] = (fun) =>
          @getf(k, fun)

        @[mSet] = (value) =>
          @set(k, value)

  get: (key, defaultVal) ->
    @source.get key, defaultVal
  # Like #get, but allows you to pass a fun which will be evaluated in the event
  # the configuration value isn't set. Useful for expensive defaults.
  getf: (key, fun) ->
    @source.get(key) ? fun()
  set: (key, val) ->
    @source.set key, val

module.exports = Configuration
