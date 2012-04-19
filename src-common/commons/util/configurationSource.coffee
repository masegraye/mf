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

module.exports = ConfigurationSource
