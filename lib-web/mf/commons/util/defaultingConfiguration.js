(function() {
  var Configuration, ConfigurationSource, DefaultingConfiguration, RawConfiguration, mf,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  mf = require("../../mf");

  Configuration = mf.component("configuration");

  RawConfiguration = mf.component("rawConfiguration");

  ConfigurationSource = mf.component("configurationSource");

  DefaultingConfiguration = (function(_super) {

    __extends(DefaultingConfiguration, _super);

    function DefaultingConfiguration(rawDefaultConfig, rawUserConfig) {
      var defaultConfig;
      defaultConfig = new RawConfiguration(void 0, rawDefaultConfig);
      this.source = new ConfigurationSource(new RawConfiguration(defaultConfig, rawUserConfig));
    }

    return DefaultingConfiguration;

  })(Configuration);

  module.exports = DefaultingConfiguration;

}).call(this);
