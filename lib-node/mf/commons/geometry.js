(function() {
  var Point, Rect, Size, pm, root;

  Point = (function() {

    function Point(x, y) {
      this.x = x;
      this.y = y;
    }

    return Point;

  })();

  Size = (function() {

    function Size(width, height) {
      this.width = width;
      this.height = height;
    }

    return Size;

  })();

  Rect = (function() {

    function Rect(point, size) {
      this.point = point;
      this.size = size;
    }

    return Rect;

  })();

  root = {};

  root.point = {};

  root.point.make = pm = function(x, y) {
    return new Point(x, y);
  };

  root.point.distance = function(pt1, pt2) {
    return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));
  };

  root.point.ZERO = root.point.make(0, 0);

  root.size = {};

  root.size.make = function(width, height) {
    return new Size(width, height);
  };

  root.rect = {};

  root.rect.make = function(x, y, width, height) {
    return new Rect(new Point(x, y), new Size(width, height));
  };

  root.rect.makeFromGridBounds = function(ulBound, lrBound) {
    var height, width, x, y;
    x = ulBound.gridX, y = ulBound.gridY;
    width = lrBound.gridX - x;
    height = lrBound.gridY - y;
    return root.rect.make(x, y, width, height);
  };

  root.rect.ZERO = root.rect.make(0, 0, 0, 0);

  root.rect.area = function(rect) {
    return rect.size.width * rect.size.height;
  };

  root.rect.points = function(rect) {
    return [pm(rect.point.x, rect.point.y), pm(rect.point.x + rect.size.width, rect.point.y), pm(rect.point.x + rect.size.width, rect.point.y + rect.size.height), pm(rect.point.x, rect.point.y + rect.size.height)];
  };

  root.rect.surfacePoints = function(rect) {
    var pts, x, y, _fn, _ref, _ref2;
    pts = [];
    for (y = 0, _ref = Math.floor(rect.size.width); 0 <= _ref ? y <= _ref : y >= _ref; 0 <= _ref ? y++ : y--) {
      _fn = function(x, y) {
        return pts.push(root.point.make(rect.point.x + x, rect.point.y + y));
      };
      for (x = 0, _ref2 = Math.floor(rect.size.height); 0 <= _ref2 ? x <= _ref2 : x >= _ref2; 0 <= _ref2 ? x++ : x--) {
        _fn(x, y);
      }
    }
    return pts;
  };

  root.rect.intersects = function(rect1, rect2) {
    var pt, _i, _len, _ref;
    _ref = root.rect.points(rect2);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      pt = _ref[_i];
      if (root.rect.contains(rect1, pt)) return true;
    }
    return false;
  };

  root.rect.contains = function(rect, pt) {
    var bl, br, tl, tr, _ref;
    _ref = root.rect.points(rect), tl = _ref[0], tr = _ref[1], br = _ref[2], bl = _ref[3];
    return pt.x >= tl.x && pt.x <= br.x && pt.y >= tl.y && pt.y <= br.y;
  };

  module.exports = root;

}).call(this);
