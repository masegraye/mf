(function() {
  var ComponentLoader;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  ComponentLoader = (function() {

    ComponentLoader.wire = function(requireFun, target) {
      return new this(requireFun, target);
    };

    function ComponentLoader(_requireFun, target) {
      this._requireFun = _requireFun;
      this.component = __bind(this.component, this);
      this._shortCuts = {};
      if (target != null) target.component = this.component;
    }

    ComponentLoader.prototype.registerShortcut = function(componentName, shortName) {
      return this._shortCuts[shortName] = componentName;
    };

    ComponentLoader.prototype.component = function(pathString) {
      var relativePath;
      if (this._shortCuts[pathString] != null) {
        pathString = this._shortCuts[pathString];
      }
      relativePath = "./" + pathString;
      return this._requireFun(relativePath);
    };

    return ComponentLoader;

  })();

  module.exports = ComponentLoader;

}).call(this);
