(function() {
  var KeyPair;

  KeyPair = (function() {

    KeyPair.get = function(x, y) {
      return new this(x, y);
    };

    function KeyPair(x, y) {
      this.x = x;
      this.y = y;
    }

    KeyPair.prototype.hashCode = function() {
      var prime, result;
      prime = 31;
      result = prime + this.x;
      result = prime * result + this.y;
      return result;
    };

    KeyPair.prototype.equals = function(other) {
      return other.x === this.x && other.y === this.y;
    };

    KeyPair.prototype.toString = function() {
      return "[" + this.x + "," + this.y + "]";
    };

    return KeyPair;

  })();

  module.exports = KeyPair;

}).call(this);
