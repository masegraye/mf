(function() {
  var Set, _;
  var __slice = Array.prototype.slice;

  _ = require("underscore");

  Set = (function() {

    function Set() {
      var initialSet;
      initialSet = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.members = {};
      this.add.apply(this, initialSet);
    }

    Set.prototype.add = function() {
      var k, members, _i, _len, _results;
      members = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _results = [];
      for (_i = 0, _len = members.length; _i < _len; _i++) {
        k = members[_i];
        _results.push(this.members[k] = true);
      }
      return _results;
    };

    Set.prototype.remove = function(member) {
      var m;
      m = this.members[member];
      if (m) {
        delete this.members[member];
        m = member;
      }
      return m;
    };

    Set.prototype.contains = function(member) {
      return this.members[member] != null;
    };

    Set.prototype.toArray = function() {
      var k, v, _ref, _results;
      _ref = this.members;
      _results = [];
      for (k in _ref) {
        v = _ref[k];
        _results.push(k);
      }
      return _results;
    };

    Set.prototype.clear = function() {
      var k, v, _ref, _results;
      _ref = this.members;
      _results = [];
      for (k in _ref) {
        v = _ref[k];
        _results.push(this.remove(k));
      }
      return _results;
    };

    Set.prototype.toString = function() {
      return "Set [members=Array[" + (this.toArray().join(", ")) + "]]";
    };

    Set.prototype.each = function(fun) {
      var k, v, _ref;
      _ref = this.members;
      for (k in _ref) {
        v = _ref[k];
        fun(k);
      }
      return;
    };

    Set.prototype.intersection = function(set) {
      var k, v;
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return typeof result === "object" ? result : child;
      })(Set, (function() {
        var _ref, _results;
        _ref = this.members;
        _results = [];
        for (k in _ref) {
          v = _ref[k];
          if (set.contains(k)) _results.push(k);
        }
        return _results;
      }).call(this), function() {});
    };

    Set.prototype.union = function(set) {
      var s;
      s = (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return typeof result === "object" ? result : child;
      })(Set, this.toArray(), function() {});
      s.add.apply(s, set.toArray());
      return s;
    };

    Set.prototype.minus = function(set) {
      var k, v;
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return typeof result === "object" ? result : child;
      })(Set, (function() {
        var _ref, _results;
        _ref = this.members;
        _results = [];
        for (k in _ref) {
          v = _ref[k];
          if (!set.contains(k)) _results.push(k);
        }
        return _results;
      }).call(this), function() {});
    };

    Set.prototype.symDifference = function(set) {
      return this.union(set).minus(this.intersection(set));
    };

    return Set;

  })();

  module.exports = Set;

}).call(this);
