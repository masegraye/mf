(function() {
  var ComponentLoader, Log, Logger, Mf, MfCore, MfExecutionContextDetector, MfNotificationCenter, MfSequencer, MfTaskManager, componentLoader, mf,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = Array.prototype.slice;

  Logger = require("jack");

  Log = Logger.create("mf");

  ComponentLoader = require("./commons/util/componentLoader");

  MfExecutionContextDetector = (function() {
    var MfExecutionContext, NodeExecutionContext, WebExecutionContext;

    function MfExecutionContextDetector() {}

    MfExecutionContext = (function() {

      function MfExecutionContext() {}

      MfExecutionContext.prototype.testMode = function() {
        return typeof MF_TEST !== "undefined" && MF_TEST !== null;
      };

      MfExecutionContext.prototype.name = function() {
        throw "Default base MFExecutionContext has no name";
      };

      return MfExecutionContext;

    })();

    WebExecutionContext = (function(_super) {

      __extends(WebExecutionContext, _super);

      function WebExecutionContext() {
        WebExecutionContext.__super__.constructor.apply(this, arguments);
      }

      WebExecutionContext.prototype.name = function() {
        return "web";
      };

      return WebExecutionContext;

    })(MfExecutionContext);

    NodeExecutionContext = (function(_super) {

      __extends(NodeExecutionContext, _super);

      function NodeExecutionContext() {
        NodeExecutionContext.__super__.constructor.apply(this, arguments);
      }

      NodeExecutionContext.prototype.name = function() {
        return "node";
      };

      return NodeExecutionContext;

    })(MfExecutionContext);

    MfExecutionContextDetector.prototype.hasGlobalOverride = function() {
      return typeof EXECUTION_CONTEXT !== "undefined" && EXECUTION_CONTEXT !== null;
    };

    MfExecutionContextDetector.prototype.hasExportsObject = function() {
      return typeof exports !== "undefined" && exports !== null;
    };

    MfExecutionContextDetector.prototype.hasWindowObject = function() {
      return typeof window !== "undefined" && window !== null;
    };

    MfExecutionContextDetector.prototype.detect = function() {
      if (typeof EXECUTION_CONTEXT !== "undefined" && EXECUTION_CONTEXT !== null) {
        return EXECUTION_CONTEXT;
      }
      if ((typeof MF_TEST !== "undefined" && MF_TEST !== null) && (typeof MF_TEST_CONFIG !== "undefined" && MF_TEST_CONFIG !== null) && (MF_TEST_CONFIG.EXECUTION_CONTEXT != null)) {
        return MF_TEST_CONFIG.EXECUTION_CONTEXT;
      }
      if (this.hasWindowObject()) {
        return new WebExecutionContext();
      } else {
        return new NodeExecutionContext();
      }
    };

    return MfExecutionContextDetector;

  })();

  MfExecutionContextDetector.prototype["default"] = function() {
    return this._detector || (this._detector = new MfExecutionContextDetector());
  };

  Mf = (function() {

    function Mf(executionContext) {
      this.executionContext = executionContext;
    }

    Mf.prototype.context = function() {
      return this.executionContext;
    };

    return Mf;

  })();

  MfCore = (function() {

    function MfCore(mf) {
      this.once = __bind(this.once, this);      this.mf = mf;
      this.klasses = {};
      this.sequencers = {};
      this.onces = {};
    }

    MfCore.prototype.shallowClone = function(obj) {
      var k, newObj, v;
      newObj = {};
      for (k in obj) {
        v = obj[k];
        newObj[k] = v;
      }
      return newObj;
    };

    MfCore.prototype.noop = function() {};

    MfCore.prototype.once = function(token, fun) {
      if (this.onces[token] == null) {
        this.onces[token] = true;
        try {
          return fun();
        } catch (e) {

        }
      }
    };

    MfCore.prototype.registerKlass = function(key, klass) {
      return this.klasses[key] = klass;
    };

    MfCore.prototype.getKlass = function(key) {
      return this.klasses[key];
    };

    MfCore.prototype.runIf = function(cond, fun) {
      if (typeof cond === "function") cond = cond();
      if (cond) return fun();
    };

    MfCore.prototype.taskManager = function(name) {
      if (name != null) {
        return new MfTaskManager(name);
      } else {
        return MfTaskManager.prototype.global();
      }
    };

    MfCore.prototype.notificationCenter = function(taskManager) {
      if (taskManager != null) {
        return new MfNotificationCenter(taskManager);
      } else {
        return MfNotificationCenter.prototype.global();
      }
    };

    MfCore.prototype.sequencer = function(name) {
      if (name != null) {
        if (this.sequencers[name] != null) {
          return this.sequencers[name];
        } else {
          this.sequencers[name] = new MfSequencer;
          return this.sequencers[name];
        }
      } else {
        return new MfSequencer();
      }
    };

    MfCore.prototype.klassId = function(note) {
      if (note == null) note = "";
      return "klass[" + note + "]-" + (this.sequencer('klass').advance());
    };

    MfCore.prototype.instanceId = function(klassId) {
      return "" + klassId + "-i-" + (this.sequencer(klassId).advance());
    };

    return MfCore;

  })();

  mf = new Mf(MfExecutionContextDetector.prototype["default"]().detect());

  mf.core = new MfCore(mf);

  require("./messages")({
    mf: mf
  });

  require("./serialization")({
    mf: mf
  });

  MfTaskManager = (function() {

    function MfTaskManager(name) {
      this.name = name;
      this.scheduledTasks = [];
      this.periodTasks = {};
      this.canTick = (typeof process !== "undefined" && process !== null) && (process.nextTick != null);
    }

    MfTaskManager.prototype.wrapWithHandler = function(task) {
      return function() {
        try {
          return task();
        } catch (error) {
          if (error.stack != null) console.log(error.stack);
          console.log(error);
          if (error.stack != null) Log.error(error.stack);
          return Log.error(error);
        }
      };
    };

    MfTaskManager.prototype.runTask = function(task, after) {
      var wrapped;
      if (!task) return;
      wrapped = this.wrapWithHandler(task);
      if (this.canTick && !(after != null)) {
        return process.nextTick(function() {
          return process.nextTick(wrapped);
        });
      } else {
        if (after == null) after = 20;
        return setTimeout(wrapped, after);
      }
    };

    MfTaskManager.prototype.runTaskFast = function(task) {
      var wrapped;
      if (!task) return;
      if (this.canTick) {
        wrapped = this.wrapWithHandler(task);
        return process.nextTick(wrapped);
      } else {
        return this.runTask(task, 4);
      }
    };

    MfTaskManager.prototype.runTaskNow = function(task) {
      return this.runTask(task, 1);
    };

    MfTaskManager.prototype.scheduleTask = function(task, every) {
      if (every == null) every = 1000;
      this.scheduledTasks.push([task, setInterval(task, every)]);
      return task;
    };

    MfTaskManager.prototype.cancelTask = function(task) {
      var id, t;
      id = (function() {
        var _i, _len, _ref, _results;
        _ref = this.scheduledTasks;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          t = _ref[_i];
          if (t[0] === task) _results.push(t[1]);
        }
        return _results;
      }).call(this);
      if ((id != null) && (id[0] != null)) clearInterval(id[0]);
      return task;
    };

    MfTaskManager.prototype.ticker = function() {
      var self;
      self = this;
      return function(fun) {
        if (fun != null) return self.runTaskFast(fun);
      };
    };

    MfTaskManager.prototype.delayer = function() {
      var tick;
      tick = this.ticker();
      return function(fun) {
        return function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return tick(function() {
            return fun.apply(null, args);
          });
        };
      };
    };

    return MfTaskManager;

  })();

  MfTaskManager.prototype.global = function() {
    return this._taskManager || (this._taskManager = new MfTaskManager("global"));
  };

  MfNotificationCenter = (function() {
    var ActionSubscription, Subject;

    ActionSubscription = (function() {

      function ActionSubscription(subject, action, fun) {
        this.subject = subject;
        this.action = action;
        this.fun = fun;
      }

      ActionSubscription.prototype.cancel = function() {
        return this.subject._internalCancel(this);
      };

      return ActionSubscription;

    })();

    Subject = (function() {

      function Subject(obj) {
        this.target = obj;
        this.potentialActions = [];
        this.subscriptions = {};
      }

      Subject.prototype.subscribe = function(action, fun) {
        var sub, _base;
        (_base = this.subscriptions)[action] || (_base[action] = []);
        sub = new ActionSubscription(this, action, fun);
        this.subscriptions[action].push(sub);
        return sub;
      };

      Subject.prototype._internalCancel = function(actionSubscription) {
        var sub;
        this.subscriptions[actionSubscription.action] = (function() {
          var _i, _len, _ref, _results;
          _ref = this.subscriptions[actionSubscription.action];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            sub = _ref[_i];
            if (sub !== actionSubscription) _results.push(sub);
          }
          return _results;
        }).call(this);
        return actionSubscription.fun;
      };

      Subject.prototype.cancel = function(action, fun) {
        var actionSub, _base, _i, _len, _ref, _results;
        (_base = this.subscriptions)[action] || (_base[action] = []);
        _ref = this.subscriptions[action];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          actionSub = _ref[_i];
          if (actionSub.fun === fun) {
            _results.push(this._internalCancel(actionSub));
          }
        }
        return _results;
      };

      Subject.prototype.notify = function(taskManager, action, additionalArgs) {
        var subscription, _i, _len, _ref, _results;
        if (this.subscriptions[action] == null) return;
        _ref = this.subscriptions[action];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          subscription = _ref[_i];
          _results.push((function(subscription) {
            return taskManager.runTaskFast((function() {
              return subscription.fun(additionalArgs);
            }));
          })(subscription));
        }
        return _results;
      };

      return Subject;

    })();

    function MfNotificationCenter(taskManager) {
      this.taskManager = taskManager;
      this.subjects = [];
    }

    MfNotificationCenter.prototype._subjectForObject = function(obj) {
      var found, sub, subject;
      found = (function() {
        var _i, _len, _ref, _results;
        _ref = this.subjects;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          sub = _ref[_i];
          if (sub.target === obj) _results.push(sub);
        }
        return _results;
      }).call(this);
      if ((found != null) && found.length > 0) return found[0];
      subject = new Subject(obj);
      this.subjects.push(subject);
      return subject;
    };

    MfNotificationCenter.prototype.subscribe = function(obj, action, fun) {
      var sub;
      sub = this._subjectForObject(obj);
      if (sub != null) return sub.subscribe(action, fun);
    };

    MfNotificationCenter.prototype.notify = function() {
      var action, additionalArgs, obj, sub;
      obj = arguments[0], action = arguments[1], additionalArgs = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      sub = this._subjectForObject(obj);
      return sub.notify(this.taskManager, action, additionalArgs);
    };

    MfNotificationCenter.prototype.cancel = function(obj, action, fun) {
      var sub;
      sub = this._subjectForObject(obj);
      if (sub != null) return sub.cancel(action, fun);
    };

    return MfNotificationCenter;

  })();

  MfNotificationCenter.prototype.global = function() {
    return this._notificationCenter || (this._notificationCenter = new MfNotificationCenter(MfTaskManager.prototype.global()));
  };

  MfSequencer = (function() {

    function MfSequencer() {
      this.val = 0;
    }

    MfSequencer.prototype.advance = function() {
      return this.val++;
    };

    return MfSequencer;

  })();

  if (mf.context().testMode()) {
    mf.core.registerKlass("MfExecutionContextDetector", MfExecutionContextDetector);
  }

  componentLoader = new ComponentLoader(require, mf);

  componentLoader.registerShortcut("commons/geometry", "geometry");

  componentLoader.registerShortcut("commons/util/configuration", "configuration");

  componentLoader.registerShortcut("commons/util/componentLoader", "componentLoader");

  componentLoader.registerShortcut("commons/util/configurationBuilder", "configurationBuilder");

  componentLoader.registerShortcut("commons/util/stateLatch", "stateLatch");

  componentLoader.registerShortcut("commons/util/countdownLatch", "countdownLatch");

  componentLoader.registerShortcut("commons/util/stateGuard", "stateGuard");

  componentLoader.registerShortcut("commons/util/uuid", "uuid");

  componentLoader.registerShortcut("commons/util/configurationSource", "configurationSource");

  componentLoader.registerShortcut("commons/util/rawConfiguration", "rawConfiguration");

  componentLoader.registerShortcut("commons/util/defaultingConfiguration", "defaultingConfiguration");

  componentLoader.registerShortcut("commons/collection/hashtable", "hashtable");

  module.exports = mf;

}).call(this);
