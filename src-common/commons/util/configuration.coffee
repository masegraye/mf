
class ConfigurationSource
  constructor: (fallback) ->
    unless fallback? and typeof fallback.get == "function"
      throw "Fallback source must define method `get'"

    @nextSource = fallback
    @values = {}
    @definedHere = {}
  get: (key, defaultVal) ->
    val = @values[key]
    if not val? and @definedHere[key]
      # The user has manually set it to
      # undefined, so return undefined, preventing
      # further cascading
      val
    else
      @nextSource.get(key) ? defaultVal
  set: (key, value) ->
    @definedHere[key] = true
    @values[key] = value

class RawConfiguration
  constructor: (rawConfig = {}) ->
    @rawConfig = rawConfig
  get: (key) ->
    @rawConfig[key]

class Configuration
  constructor: (rawConfig) ->
    @source = new ConfigurationSource new RawConfiguration(rawConfig)
  get: (key, defaultVal) ->
    @source.get key, defaultVal
  # Like #get, but allows you to pass a fun which will be evaluated in the event
  # the configuration value isn't set. Useful for expensive defaults.
  getf: (key, fun) ->
    @source.get(key) ? fun()
  set: (key, val) ->
    @source.set key, val

module.exports = Configuration
