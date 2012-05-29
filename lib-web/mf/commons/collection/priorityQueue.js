(function() {
  var PriorityQueue;

  PriorityQueue = (function() {

    function PriorityQueue(comparator) {
      this._store = [null];
      this._comparator = comparator != null ? comparator : function(x, y) {
        return x > y;
      };
    }

    PriorityQueue.prototype.enqueue = function(val) {
      var idx, store;
      store = this._store;
      store[idx = store.length] = val;
      this.moveUp(idx);
      return val;
    };

    PriorityQueue.prototype.dequeue = function() {
      var idx, store, val;
      store = this._store;
      val = store[1];
      store[1] = store[idx = store.length - 1];
      store.splice(-1);
      this.moveDown(1);
      return val;
    };

    PriorityQueue.prototype.moveUp = function(idx) {
      var par, store, val;
      store = this._store;
      if (this._comparator(val = store[idx], store[par = this.parentIdx(idx)])) {
        store[idx] = store[par];
        store[par] = val;
        this.moveUp(par);
        return par;
      } else {
        return val;
      }
    };

    PriorityQueue.prototype.moveDown = function(idx) {
      var child, childIdx, lci, rci, store, val;
      store = this._store;
      lci = this.leftChildIdx(idx);
      rci = this.rightChildIdx(idx);
      if ((store[rci] != null) && !this._comparator(store[lci], store[rci])) {
        child = store[rci];
        childIdx = rci;
      } else {
        child = store[lci];
        childIdx = lci;
      }
      if ((child != null) && !this._comparator(val = store[idx], child)) {
        store[idx] = child;
        store[childIdx] = val;
        this.moveDown(childIdx);
        return childIdx;
      } else {
        return idx;
      }
    };

    PriorityQueue.prototype.parentIdx = function(idx) {
      if (idx <= 1) return null;
      return Math.floor(idx / 2);
    };

    PriorityQueue.prototype.leftChildIdx = function(idx) {
      return 2 * idx;
    };

    PriorityQueue.prototype.rightChildIdx = function(idx) {
      return 2 * idx + 1;
    };

    return PriorityQueue;

  })();

  module.exports = PriorityQueue;

}).call(this);
