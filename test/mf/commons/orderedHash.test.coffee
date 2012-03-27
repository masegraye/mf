assert = harness.assert

mf             = require "mf"
_              = require "underscore"
OrderedHash    = mf.component "commons/collection/orderedHash"

suite "Ordered Hash", () ->
  test "Sanity", () ->
    assert.ok o = new OrderedHash

  test "Append", () ->
    assert.ok o = new OrderedHash
    assert.equal 0, o.toArray().length
    assert.ok o.append 'foo', obj = {bar: 'baz'}
    assert.ok o.get('foo') == obj
    assert.equal 1, o.toArray().length
    assert.equal obj, o.toArray()[0]

  test "Order in appends", () ->
    assert.ok o = new OrderedHash
    assert.ok o.append 'foo', obj1 = {bar: 'baz'}
    assert.ok o.append 'bar', obj2 = {foo: 'baz'}
    assert.ok o.append 'baz', obj3 = {balh: 'baz'}
    assert.equal o._head._obj, obj1
    assert.equal o._tail._obj, obj3

    for [x, y], k in _.zip(o.toArray(), [obj1, obj2, obj3])
      assert.equal x, y

  test "Remove middle", () ->
    assert.ok o = new OrderedHash
    assert.ok o.append 'foo', obj1 = {bar: 'baz'}
    assert.ok o.append 'bar', obj2 = {foo: 'baz'}
    assert.ok o.append 'baz', obj3 = {blah: 'baz'}

    for [x, y], k in _.zip(o.toArray(), [obj1, obj2, obj3])
      assert.equal x, y

    assert.equal o.remove('bar'), obj2

    for [x, y], k in _.zip(o.toArray(), [obj1, obj3])
      assert.equal x, y

  test "Remove end", () ->
    assert.ok o = new OrderedHash
    assert.ok o.append 'foo', obj1 = {bar: 'baz'}
    assert.ok o.append 'bar', obj2 = {foo: 'baz'}
    assert.ok o.append 'baz', obj3 = {blah: 'baz'}

    for [x, y], k in _.zip(o.toArray(), [obj1, obj2, obj3])
      assert.equal x, y

    assert.equal o.remove('baz'), obj3

    for [x, y], k in _.zip(o.toArray(), [obj1, obj2])
      assert.equal x, y

  test "Remove beginning", () ->
    assert.ok o = new OrderedHash
    assert.ok o.append 'foo', obj1 = {foo: 'baz'}
    assert.ok o.append 'bar', obj2 = {bar: 'baz'}
    assert.ok o.append 'baz', obj3 = {baz: 'baz'}

    for [x, y], k in _.zip(o.toArray(), [obj1, obj2, obj3])
      assert.equal x, y

    assert.ok o.remove('foo')

    for [x, y], k in _.zip(o.toArray(), [obj2, obj3])
      assert.equal x, y

  test "Iterator", () ->
    assert.ok o = new OrderedHash
    assert.ok o.append 'foo', obj1 = {foo: 'baz'}
    assert.ok o.append 'bar', obj2 = {bar: 'baz'}
    assert.ok o.append 'baz', obj3 = {baz: 'baz'}

    assert.ok iter = o.getIterator()

    assert.equal iter(), obj1
    assert.equal iter(), obj2
    assert.equal iter(), obj3
    assert.equal iter(), null

  test "Iterator by key", () ->
    assert.ok o = new OrderedHash
    assert.ok o.append 'foo', obj1 = {foo: 'baz'}
    assert.ok o.append 'bar', obj2 = {bar: 'baz'}
    assert.ok o.append 'baz', obj3 = {baz: 'baz'}

    assert.ok iter = o.getIteratorById('bar')

    assert.equal iter(), obj2
    assert.equal iter(), obj3
    assert.equal iter(), null

  test "Reverse Iterator", () ->
    assert.ok o = new OrderedHash
    assert.ok o.append 'foo', obj1 = {foo: 'baz'}
    assert.ok o.append 'bar', obj2 = {bar: 'baz'}
    assert.ok o.append 'baz', obj3 = {baz: 'baz'}

    assert.ok iter = o.getReverseIterator()

    assert.equal iter(), obj3
    assert.equal iter(), obj2
    assert.equal iter(), obj1
    assert.equal iter(), null

  test "Reverse Iterator by key", () ->
    assert.ok o = new OrderedHash
    assert.ok o.append 'foo', obj1 = {foo: 'baz'}
    assert.ok o.append 'bar', obj2 = {bar: 'baz'}
    assert.ok o.append 'baz', obj3 = {baz: 'baz'}

    assert.ok iter = o.getReverseIteratorById('bar')

    assert.equal iter(), obj2
    assert.equal iter(), obj1
    assert.equal iter(), null
