assert = harness.assert

mf            = require "mf"
KeyPair       = mf.component "commons/util/keyPair"

class FooPair extends KeyPair

suite "KeyPair", ->
  test "Test sanity", ->
    assert.ok new KeyPair()

  test "Test uniqueness of hashCodes", ->
    hsh = {}
    xAr = [0..999]
    yAr = [0..999]

    # this is probably a goofy way to do this, but I just wanted to
    # include some quick coverage
    for i in [1..10000]
      x = xAr[Math.floor(Math.random() * (xAr.length - 1))]
      y = yAr[Math.floor(Math.random() * (yAr.length - 1))]
      assert.ok kp = new KeyPair x, y

      if (v = hsh[kp.hashCode]) != undefined
        assert.equal x, v[0]
        assert.equal y, v[1]
      else
        hsh[kp.hashCode()] = [x, y]

  test "Get works", ->
    k = new KeyPair(0,0)
    assert.ok kp = KeyPair.get(0, 0)
    assert.ok fp = FooPair.get(0, 0)
    assert.equal k.hashCode(), kp.hashCode()
    assert.equal k.hashCode(), fp.hashCode()

  test "toString works", ->
    assert.ok kp = new KeyPair(0, 0)

    assert.isString kp.toString()
