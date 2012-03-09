Uuid = require "commons/util/uuid"

class IdGen
  generate: (token) ->
    "#{token}-#{Uuid.generate()}"

module.exports = new IdGen
