(function() {
  var Configuration, ConfigurationSource, RawConfiguration, mf;

  mf = require("../../mf");

  ConfigurationSource = mf.component("configurationSource");

  RawConfiguration = mf.component("rawConfiguration");

  Configuration = (function() {

    function Configuration(rawConfig) {
      this.source = new ConfigurationSource(new RawConfiguration(void 0, rawConfig));
    }

    Configuration.prototype.autoAccessorize = function(schema) {
      var k, v, _results;
      var _this = this;
      _results = [];
      for (k in schema) {
        v = schema[k];
        _results.push((function(k) {
          var mGet, mSet, mfGet;
          mGet = "get" + (k.charAt(0).toUpperCase()) + (k.substr(1));
          mfGet = "getf" + (k.charAt(0).toUpperCase()) + (k.substr(1));
          mSet = "set" + (k.charAt(0).toUpperCase()) + (k.substr(1));
          _this[mGet] = function(d) {
            return _this.get(k, d);
          };
          _this[mfGet] = function(fun) {
            return _this.getf(k, fun);
          };
          return _this[mSet] = function(value) {
            return _this.set(k, value);
          };
        })(k));
      }
      return _results;
    };

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
