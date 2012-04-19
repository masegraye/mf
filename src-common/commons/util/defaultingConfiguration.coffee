mf = require "../../mf"
Configuration = mf.component "configuration"
RawConfiguration = mf.component "rawConfiguration"
ConfigurationSource = mf.component "configurationSource"
class DefaultingConfiguration extends Configuration
  constructor: (rawDefaultConfig, rawUserConfig) ->
    defaultConfig = new RawConfiguration(undefined, rawConfiguration)
    @source = new ConfigurationSource(new RawConfiguration(defaultConfig, rawUserConfig))

module.exports = DefaultingConfiguration
