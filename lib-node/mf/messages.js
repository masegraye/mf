(function() {
  var init;

  init = function(mf) {
    var MfMessageChannel, MfMessages;
    if (mf == null) throw "Core package is not defined";
    MfMessages = (function() {

      function MfMessages() {
        this.channels = [];
      }

      MfMessages.prototype.channel = function(owner) {
        return new MfMessageChannel(owner);
      };

      return MfMessages;

    })();
    MfMessageChannel = (function() {

      function MfMessageChannel(sentinel) {
        this.wrappedFuns = {};
        this.owner = sentinel;
        this.notificationCenter = mf.core.notificationCenter();
        this.name = "MfMessageChannel-" + (mf.core.sequencer("MfMessageChannel").advance());
      }

      MfMessageChannel.prototype.publish = function(sentinel, message) {
        if (sentinel !== this.owner) {
          throw "Sentinel not equal to the one provided during channel creation";
        }
        if (message == null) throw "You must publish a meaningful message";
        return this.notificationCenter.notify(this, this.name, message);
      };

      MfMessageChannel.prototype.subscribe = function(fun) {
        if (!((fun != null) && typeof fun === "function")) {
          throw "Message subscription requires a function";
        }
        this.wrappedFuns[fun] = function(args) {
          return fun(args[0]);
        };
        return this.notificationCenter.subscribe(this, this.name, this.wrappedFuns[fun]);
      };

      MfMessageChannel.prototype.unsubscribe = function(fun) {
        if (!((fun != null) && typeof fun === "function")) {
          throw "Message unsubscription requires a function";
        }
        if (this.wrappedFuns[fun]) {
          return this.notificationCenter.cancel(this, this.name, this.wrappedFuns[fun]);
        }
      };

      return MfMessageChannel;

    })();
    return mf.messages = new MfMessages();
  };

  if (typeof exports !== "undefined" && exports !== null) {
    module.exports = function(options) {
      return init(options.mf);
    };
  } else {
    if (typeof mf === "undefined" || mf === null) {
      throw "Core package is not in scope";
    }
    init(mf);
  }

}).call(this);
