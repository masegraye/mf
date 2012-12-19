(function() {
  var RawConfiguration;

  RawConfiguration = (function() {

    function RawConfiguration(fallback, rawConfig) {
      if (rawConfig == null) rawConfig = {};
      this.rawConfig = rawConfig;
      this.fallback = fallback;
    }

    RawConfiguration.prototype.get = function(key, defaultVal) {
      var _ref, _ref2, _ref3;
      return (_ref = (_ref2 = this.rawConfig[key]) != null ? _ref2 : (_ref3 = this.fallback) != null ? typeof _ref3.get === "function" ? _ref3.get(key, defaultVal) : void 0 : void 0) != null ? _ref : defaultVal;
    };

    return RawConfiguration;

  })();

  module.exports = RawConfiguration;

}).call(this);
