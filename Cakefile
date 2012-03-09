process.env["PATH"] = "node_modules/.bin:#{process.env["PATH"]}"

path = require "path"
{TestBuilder:TestBuilder, SourceBuilder:Builder} = require "mf-tools"
baseDir = __dirname
relativeToBase = (path) ->
  "#{baseDir}/#{path}"

builds =
  "lib-node": ["src-common", "src-node"]
  "lib-web" : ["src-common", "src-web"]

task "build", "Convert CoffeeScript sources into JS files", ->
  for build, dirs of builds
    new Builder(baseDir)
      .libraryName("mf")
      .buildName(build)
      .outputDir(build)
      .inputDirs((dir for dir in dirs)...)
      .build()

testBuilder = new TestBuilder()
  .includePaths("lib-node")
  .tests({
    mf: "test/mf/*.coffee"
  })
  .task(task)
  .build()
