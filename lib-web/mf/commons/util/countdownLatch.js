(function() {
  var CountdownLatch, mf;
  var __slice = Array.prototype.slice;

  mf = require("../../mf");

  CountdownLatch = (function() {

    function CountdownLatch() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      switch (args.length) {
        case 1:
          this._steps = 1;
          this._onDone = args[0];
          break;
        case 2:
          this._steps = args[0];
          this._onDone = args[1];
          break;
        default:
          throw new Error("Expected either a callback, or a step number and callback");
      }
      this._curr = 0;
      this._firing = false;
      this._maybeFire();
    }

    CountdownLatch.prototype.step = function(steps) {
      if (steps == null) steps = 1;
      this._curr += steps;
      return this._maybeFire();
    };

    CountdownLatch.prototype._maybeFire = function() {
      if (this._curr >= this._steps && !this._firing) {
        this._firing = true;
        return mf.core.taskManager().runTaskFast(this._onDone);
      }
    };

    return CountdownLatch;

  })();

}).call(this);
