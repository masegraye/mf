# # ComponentLoader

# Allows us to require a component as though we were "within" the package by specifying
# a relative path. The "current directory" is the directory where the ComponentLoader
# was constructed (implicitly - since they pass in their require function, which is bound
# to their current directory).
class ComponentLoader
  # Root should be the location where you wish requires to be relative to.
  # In node, this isn't necessary, but it is for stitch.

  # If a target object is passed in, this method's `component()` method
  # will be bound to that object using the same name.
  constructor: (@_requireFun, target) ->
    @_shortCuts = {}
    if target?
      target.component = @component
  registerShortcut: (componentName, shortName) ->
    @_shortCuts[shortName] = componentName
  component: (pathString) =>
    # If someone has registered a "short name", use it instead.
    if @_shortCuts[pathString]?
      pathString = @_shortCuts[pathString]

    relativePath = "./#{pathString}"
    @_requireFun(relativePath)
module.exports = ComponentLoader
