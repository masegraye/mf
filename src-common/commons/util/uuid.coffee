
class Uuid
  generate: ->
    ("xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace /[xy]/g, ((c)->
      random = Math.random() * 16 | 0
      hex = if c == "x" then random else random & 3 | 8
      hex.toString(16)
    )).toLowerCase()

module.exports = new Uuid
