---
layout: tutorial
title: Getting Started
type: howto
---

# About Model Factory

Model Factory is a light-weight model layer that bridges the gap between AngularJS and your RESTful APIs. Its focus is to be simple to use, yet efficient and flexible enough for most of the use cases you'll encounter.

But why would you use this over other available solutions?

- Lightweight/Simple, the code simply does some basic copy/extending and prototypical instances; no magic required.
- Patterns/Practices, the model definition closely resembles Angular's ngResource meaning its easy to swap out, replace later, eases scaling/transition, and its designed for Angular; not a backbone port!
- Utilizes Angular at the core, it doesn't duplicate things Angular already does. Any action can be passed a $http configuration option, all your interceptors still work, it uses Angular's cache, etc!
- Compliant, URI Template matches the specs.
- Small - 1.45KB gzipped/minified ( excludes depedencies )
- Minimal Dependencies, only use URI template and deep-diff ( this isn't even required ) utility. NO underscore, lodash, jquery, etc!
- Its full of awesome features
- ...

# Installation

There are different possibilities. You can either simply download one of [our releases](https://github.com/Swimlane/angular-model-factory/releases) or directly get the latest version from the [repo itself](https://github.com/Swimlane/angular-model-factory). The `dist` folder should contain everything you need.

## Bower

Alternatively you can get it on [Bower](http://bower.io/search/?q=angular-model-factory).

```
$ bower install angular-model-factory --save
```


# Using it in your Angular code

<iframe src="http://embed.plnkr.co/fkbFuGynShAkw3BTrwAo/preview" width="100%" height="300px"> </iframe>


