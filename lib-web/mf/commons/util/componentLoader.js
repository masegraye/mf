(function() {
  var ComponentLoader;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  ComponentLoader = (function() {

    function ComponentLoader(_requireFun, target) {
      this._requireFun = _requireFun;
      this.component = __bind(this.component, this);
      if (target != null) target.component = this.component;
    }

    ComponentLoader.prototype.component = function(pathString) {
      var relativePath;
      relativePath = "./" + pathString;
      return this._requireFun(relativePath);
    };

    return ComponentLoader;

  })();

  module.exports = ComponentLoader;

}).call(this);
