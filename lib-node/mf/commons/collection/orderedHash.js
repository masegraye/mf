(function() {
  var Node, OrderedHash;

  OrderedHash = (function() {

    function OrderedHash() {
      this._nodes = {};
      this._head = this._tail = null;
      this._arrayCache = [];
      this._dirty = true;
    }

    OrderedHash.prototype.append = function(k, v) {
      var node;
      if (this._nodes.hasOwnProperty(k)) return;
      if (this._tail) {
        node = new Node(v, this._tail);
        this._tail._next = node;
      } else {
        node = new Node(v);
      }
      if (!this._head) this._head = node;
      this._tail = node;
      this._dirty = true;
      return this._nodes[k] = node;
    };

    OrderedHash.prototype.get = function(k) {
      return this._nodes[k]._obj;
    };

    OrderedHash.prototype.remove = function(k) {
      var next, node, prev;
      if (!(node = this._nodes[k])) return;
      next = node._next;
      prev = node._prev;
      if (next) next._prev = node._prev;
      if (prev) prev._next = node._next;
      if (prev === null) this._head = next;
      delete this._nodes[k];
      this._dirty = true;
      return node._obj;
    };

    OrderedHash.prototype.toArray = function() {
      var ar, node;
      if (!this._dirty) return this._arrayCache;
      node = this._head;
      ar = [];
      while (node !== null) {
        ar.push(node._obj);
        node = node._next;
      }
      this._dirty = false;
      return this._arrayCache = ar;
    };

    return OrderedHash;

  })();

  Node = (function() {

    function Node(obj, prev, next) {
      if (prev == null) prev = null;
      if (next == null) next = null;
      this._obj = obj;
      this._prev = prev;
      this._next = next;
    }

    return Node;

  })();

  module.exports = OrderedHash;

}).call(this);
