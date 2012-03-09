(function() {
  var IdGen, Uuid;

  Uuid = require("commons/util/uuid");

  IdGen = (function() {

    function IdGen() {}

    IdGen.prototype.generate = function(token) {
      return "" + token + "-" + (Uuid.generate());
    };

    return IdGen;

  })();

  module.exports = new IdGen;

}).call(this);
