mf = require "../../mf"
Configuration = mf.component "configuration"

class ConfigurationBuilder
  @build: (rawConfig, scopes) ->
    new this(rawConfig, scopes).build()

  constructor: (@rawConfiguration, @scopes = ["global"]) ->
  build: ->
    # Rip through raw config, looking for scope unions.
    # Apply configs in order, singles first.
    # Apply scope unions if the union scopes are specified in the @scopes constructor argument.
    unions = []
    builtConfig = {}
    for k,v of @rawConfiguration
      if (scopes = k.split("+")).length > 0
        unions.push scopes

    for scope in @scopes
      if config = @rawConfiguration[scope]
        do (scope, config) ->
          builtConfig[k] = v for k,v of config

    containsAll = (haystack, needles) ->
      hasAll = yes
      for needle in needles
        if not (needle in haystack)
          hasAll = no
          break
      hasAll

    unions.sort (ary1, ary2) ->
      return 0 if ary1.length == ary2.length
      if ary1.length < ary2.length then return -1 else return 1

    for union in unions
      do (union) =>
        if containsAll(@scopes, union)
          unionKey = union.join("+")
          if config = @rawConfiguration[unionKey]
            builtConfig[k] = v for k,v of config

    c = new Configuration(builtConfig)
    c.autoAccessorize(builtConfig)
    c

module.exports = ConfigurationBuilder
