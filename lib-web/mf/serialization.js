(function() {
  var init;

  init = function(mf) {
    var MfSerializationCenter, SerializationCore;
    SerializationCore = (function() {

      function SerializationCore() {}

      SerializationCore.prototype.serializationCenter = function() {
        return new MfSerializationCenter();
      };

      return SerializationCore;

    })();
    MfSerializationCenter = (function() {

      function MfSerializationCenter() {
        this.knownTypes = {};
      }

      MfSerializationCenter.prototype.unregisterAll = function() {
        return this.knownTypes = {};
      };

      MfSerializationCenter.prototype.registerHandler = function(type, handler, format) {
        var _base;
        if (format == null) format = "json";
        if ((_base = this.knownTypes)[type] == null) _base[type] = {};
        return this.knownTypes[type][format] = handler;
      };

      MfSerializationCenter.prototype.serialize = function(obj, format) {
        var handler, type, _base;
        if (format == null) format = "json";
        type = obj.serializeAs;
        if (typeof type !== "string") {
          throw "Requested serialization of object, but object did not provide a serialization type as attribute `serializeAs'";
        }
        if ((_base = this.knownTypes)[type] == null) _base[type] = {};
        handler = this.knownTypes[type][format];
        if (handler == null) {
          throw "Requested serialization of type `" + type + "' to format `" + format + "', but no handler was registered";
        }
        return handler.serialize(obj);
      };

      MfSerializationCenter.prototype.deserialize = function(objData, type, format) {
        var handler, _base;
        if (format == null) format = "json";
        if ((_base = this.knownTypes)[type] == null) _base[type] = {};
        handler = this.knownTypes[type][format];
        if (handler == null) {
          throw "Requested deserialization of type `" + type + "' from format `" + format + "', but no handler was registerd";
        }
        return handler.deserialize(objData);
      };

      return MfSerializationCenter;

    })();
    return mf.serialization = new SerializationCore();
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
