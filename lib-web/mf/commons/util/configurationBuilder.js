(function() {
  var Configuration, ConfigurationBuilder, mf,
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  mf = require("../../mf");

  Configuration = mf.component("configuration");

  ConfigurationBuilder = (function() {

    ConfigurationBuilder.build = function(rawConfig, scopes) {
      return new this(rawConfig, scopes).build();
    };

    function ConfigurationBuilder(rawConfiguration, scopes) {
      this.rawConfiguration = rawConfiguration;
      this.scopes = scopes != null ? scopes : ["global"];
    }

    ConfigurationBuilder.prototype.build = function() {
      var builtConfig, c, config, containsAll, k, scope, scopes, union, unions, v, _fn, _i, _j, _len, _len2, _ref, _ref2,
        _this = this;
      unions = [];
      builtConfig = {};
      _ref = this.rawConfiguration;
      for (k in _ref) {
        v = _ref[k];
        if ((scopes = k.split("+")).length > 0) unions.push(scopes);
      }
      _ref2 = this.scopes;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        scope = _ref2[_i];
        if (config = this.rawConfiguration[scope]) {
          (function(scope, config) {
            var k, v, _results;
            _results = [];
            for (k in config) {
              v = config[k];
              _results.push(builtConfig[k] = v);
            }
            return _results;
          })(scope, config);
        }
      }
      containsAll = function(haystack, needles) {
        var hasAll, needle, _j, _len2;
        hasAll = true;
        for (_j = 0, _len2 = needles.length; _j < _len2; _j++) {
          needle = needles[_j];
          if (!(__indexOf.call(haystack, needle) >= 0)) {
            hasAll = false;
            break;
          }
        }
        return hasAll;
      };
      unions.sort(function(ary1, ary2) {
        if (ary1.length === ary2.length) return 0;
        if (ary1.length < ary2.length) {
          return -1;
        } else {
          return 1;
        }
      });
      _fn = function(union) {
        var k, unionKey, v, _results;
        if (containsAll(_this.scopes, union)) {
          unionKey = union.join("+");
          if (config = _this.rawConfiguration[unionKey]) {
            _results = [];
            for (k in config) {
              v = config[k];
              _results.push(builtConfig[k] = v);
            }
            return _results;
          }
        }
      };
      for (_j = 0, _len2 = unions.length; _j < _len2; _j++) {
        union = unions[_j];
        _fn(union);
      }
      c = new Configuration(builtConfig);
      c.autoAccessorize(builtConfig);
      return c;
    };

    return ConfigurationBuilder;

  })();

  module.exports = ConfigurationBuilder;

}).call(this);
