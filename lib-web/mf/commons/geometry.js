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

  root.point.ZERO = root.point.make(0, 0);

  root.size = {};

  root.size.make = function(width, height) {
    return new Size(width, height);
  };

  root.rect = {};

  root.rect.make = function(x, y, width, height) {
    return new Rect(new Point(x, y), new Size(width, height));
  };

  root.rect.ZERO = root.rect.make(0, 0, 0, 0);

  root.rect.area = function(rect) {
    return rect.size.width * rect.size.height;
  };

  root.rect.points = function(rect) {
    return [pm(rect.point.x, rect.point.y), pm(rect.point.x + rect.size.width, rect.point.y), pm(rect.point.x + rect.size.width, rect.point.y + rect.size.height), pm(rect.point.x, rect.point.y + rect.size.height)];
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
