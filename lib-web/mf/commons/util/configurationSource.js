(function() {
  var ConfigurationSource;

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

  module.exports = ConfigurationSource;

}).call(this);