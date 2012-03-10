(function() {
  var Set, StateGuard, _;
  var __slice = Array.prototype.slice;

  Set = require("mf").component("commons/collection/set");

  _ = require("underscore");

  StateGuard = (function() {

    function StateGuard() {
      var possibleStates;
      possibleStates = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.possibleStates = (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return typeof result === "object" ? result : child;
      })(Set, possibleStates, function() {});
      this.recordedStates = new Set();
    }

    StateGuard.prototype.require = function() {
      var allPresent, requiredStates;
      var _this = this;
      requiredStates = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      allPresent = _.all(requiredStates, function(s) {
        return _this.recordedStates.contains(s);
      });
      if (!allPresent) {
        throw new Error("StateGuard required states (" + (requiredStates.join(", ")) + "), but not all were recorded");
      }
      return this;
    };

    StateGuard.prototype.prevent = function() {
      var preventedStates, preventers;
      var _this = this;
      preventedStates = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      preventers = _.any(preventedStates, function(s) {
        return _this.recordedStates.contains(s);
      });
      if (preventers) {
        throw new Error("State prevention requested. Wanted to prevent: (" + (preventedStates.join(", ")) + "); states recorded: (" + (this.recordedStates.toString()) + ")");
      }
      return this;
    };

    StateGuard.prototype.record = function() {
      var newStates, validStates, _ref;
      var _this = this;
      newStates = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      validStates = _.every(newStates, function(s) {
        return _this.possibleStates.contains(s);
      });
      if (validStates) {
        (_ref = this.recordedStates).add.apply(_ref, newStates);
      } else {
        throw new Error("Invalid state specified in `record'. Valid states are: (" + (this.possibleStates.toString()) + "). Provided (" + (newStates.join(", ")) + ")");
      }
      return this;
    };

    StateGuard.prototype.reset = function() {
      this.recordedStates.clear();
      return this.recordedStates = new Set();
    };

    return StateGuard;

  })();

  StateGuard.prototype.deny = StateGuard.prototype.prevent;

  module.exports = StateGuard;

}).call(this);
