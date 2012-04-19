class RawConfiguration
  constructor: (fallback, rawConfig = {}) ->
    @rawConfig = rawConfig
    @fallback = fallback
  get: (key, defaultVal) ->
    (@rawConfig[key] ? @fallback?.get?(key, defaultVal)) ? defaultVal

module.exports = RawConfiguration
