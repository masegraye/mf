(function() {
  var Configuration, ConfigurationSource, RawConfiguration;

  ConfigurationSource = (function() {

    function ConfigurationSource(fallback) {
      if (!((fallback != null) && typeof fallback.get === "function")) {
        throw "Fallback source must define method `get'";
      }
      this.nextSource = fallback;
      this.values = {};
      this.definedHere = {};
    }

    ConfigurationSource.prototype.get = function(key, defaultVal) {
      var val, _ref;
      val = this.values[key];
      if (!(val != null) && this.definedHere[key]) {
        return val;
      } else {
        return (_ref = this.nextSource.get(key)) != null ? _ref : defaultVal;
      }
    };

    ConfigurationSource.prototype.set = function(key, value) {
      this.definedHere[key] = true;
      return this.values[key] = value;
    };

    return ConfigurationSource;

  })();

  RawConfiguration = (function() {

    function RawConfiguration(rawConfig) {
      if (rawConfig == null) rawConfig = {};
      this.rawConfig = rawConfig;
    }

    RawConfiguration.prototype.get = function(key) {
      return this.rawConfig[key];
    };

    return RawConfiguration;

  })();

  Configuration = (function() {

    function Configuration(rawConfig) {
      this.source = new ConfigurationSource(new RawConfiguration(rawConfig));
    }

    Configuration.prototype.get = function(key, defaultVal) {
      return this.source.get(key, defaultVal);
    };

    Configuration.prototype.getf = function(key, fun) {
      var _ref;
      return (_ref = this.source.get(key)) != null ? _ref : fun();
    };

    Configuration.prototype.set = function(key, val) {
      return this.source.set(key, val);
    };

    return Configuration;

  })();

  module.exports = Configuration;

}).call(this);
