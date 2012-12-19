# MF

MF is the Massively Fun "commons" library, for use across projects. Some things it gives you:

  1. **MfTaskManager** - an abstraction around setTimeout/process.nextTick. You may execute tasks:
     1. Soon, once
     1. Very soon, once
     1. Repeatedly

  1. **MfNotificationCenter** - simple sub/pub, loosely modeled after Cocoa's NotificationCenter

  1. **MessageChannels** (via `mf.core.channel()`) - provides a single-pub, multi-sub channel.

  1. Various utility functions useful for all MF projects, such as:
     1. A component loader, for exposing internal modules as components of the greater NPM module.
     1. A Configuration object, which can be backed by an arbitrary configuration provider.
     1. Several latches for asynchronous conditionals.

  1. Various collection classes:
     1. `Hashtable`, which provides reasonably quick lookup. Allows you to use objects as keys, provided they implement `hashCode()` and `equals()`.
     1. `OrderedHash`, modelled after after Ruby's Hash implementation, OrderedHash is basically a doubly linked list with hash table look up. This allows ordered iteration and constant time look up of elements by UUID.
     1. A priority queue.
