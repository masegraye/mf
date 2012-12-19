(function() {
  var Uuid;

  Uuid = (function() {

    function Uuid() {}

    Uuid.prototype.generate = function() {
      return ("xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (function(c) {
        var hex, random;
        random = Math.random() * 16 | 0;
        hex = c === "x" ? random : random & 3 | 8;
        return hex.toString(16);
      }))).toLowerCase();
    };

    return Uuid;

  })();

  module.exports = new Uuid;

}).call(this);
