(function() {
  var KeyPair;

  KeyPair = (function() {

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

    return KeyPair;

  })();

  module.exports = KeyPair;

}).call(this);
