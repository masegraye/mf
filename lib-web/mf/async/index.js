(function() {
  var AsyncCore, CondWalker, Flag,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Flag = (function() {

    function Flag() {
      this._isSet = false;
    }

    Flag.prototype.set = function(v) {
      return this._isSet = v != null ? v : true;
    };

    Flag.prototype.unset = function() {
      return this._isSet = false;
    };

    Flag.prototype.isSet = function() {
      return this._isSet;
    };

    return Flag;

  })();

  AsyncCore = (function() {

    function AsyncCore(_mf) {
      this._mf = _mf;
    }

    AsyncCore.prototype.mapUntil = function(flag, collection, fun) {
      var c;
      c = new CondWalker(this._mf.core.taskManager(), flag, collection, fun);
      c.run();
      return c;
    };

    AsyncCore.prototype.flag = function() {
      return new Flag;
    };

    return AsyncCore;

  })();

  CondWalker = (function() {

    function CondWalker(_taskManager, _flag, _collection, _fun) {
      this._taskManager = _taskManager;
      this._flag = _flag;
      this._collection = _collection;
      this._fun = _fun;
      this.step = __bind(this.step, this);
      this._idx = 0;
      this._canceled = new Flag();
    }

    CondWalker.prototype.step = function() {
      return this._kick();
    };

    CondWalker.prototype._kick = function() {
      var elt,
        _this = this;
      if (!this._canceled.isSet() && !this._flag.isSet() && (this._idx < this._collection.length)) {
        elt = this._collection[this._idx];
        this._idx++;
        return this._taskManager.runTask(function() {
          return _this._fun(_this.step, elt);
        });
      }
    };

    CondWalker.prototype.run = function() {
      return this._kick();
    };

    CondWalker.prototype.cancel = function() {
      return this._canceled.set();
    };

    return CondWalker;

  })();

  module.exports = AsyncCore;

}).call(this);
