# modelFactory 

[![Build Status](https://travis-ci.org/Swimlane/angular-model-factory.svg?branch=master)](https://travis-ci.org/Swimlane/model-factory) [![npm version](https://badge.fury.io/js/angular-model-factory.svg)](http://badge.fury.io/js/angular-model-factory) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) [![Bower version](https://badge.fury.io/bo/angular-model-factory.svg)](http://badge.fury.io/bo/angular-model-factory) [![Codacy Badge](https://www.codacy.com/project/badge/d6659f50bd234f099738358a2a17bf9c)](https://www.codacy.com/public/amcdaniel2/model-factory) [![Join the chat at https://gitter.im/Swimlane/angular-model-factory](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Swimlane/angular-model-factory?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

A light-weight model layer that bridges the gap between AngularJS and your RESTful APIs.

Why would you use this over other available solutions?

- Lightweight/Simple, the code simply does some basic copy/extending and prototypical instances; no magic required.
- Patterns/Practices, the model definition closely resembles Angular's ngResource meaning its easy to swap out, replace later, eases scaling/transition, and its designed for Angular; not a backbone port!
- Utilizes Angular at the core, it doesn't duplicate things Angular already does.  Any action can be passed a `$http` configuration option, all your interceptors still work, it uses Angular's cache, etc!
- Compliant, URI Template matches the specs.
- Small - 1.45KB gzipped/minified ( excludes depedencies )
- Minimal Dependencies, only use URI template and deep-diff ( this isn't even required ) utility.  NO underscore, lodash, jquery, etc!
- Its full of awesome features


See [wiki](https://github.com/Swimlane/model-factory/wiki) for documentation.


## Features

- URI Templates (RFC6570)
- Model instances
- Collections
- Single Datastore
- Caching / Cache invalidation
- Default value population
- Pending / Completed Status
- Relationships
- Object Deep Diff / Reversion
- Track active promises to prevent duplicate sends


## Other Solutions

After doing quite a bit of research before writing this, I took a look at other solutions.  Here is what I found and why I wrote my own.

- [Restmod](https://github.com/platanus/angular-restmod)
Very nice solution but very opinionated and hyper-active. 22kb min

- [Modelizer](https://github.com/VasilioRuzanni/angular-modelizer)
Good but requires Lodash. 23kb min

- [ModelCore](https://github.com/klederson/ModelCore/)
Good but not very well tested and not active.

- [angular-watch-resource](https://github.com/marmorkuchen-net/angular-watch-resource) - Really only handles collections

- [angular-restful](http://esdrasedu.github.io/angular-restful/#/) - Very basic but nice

- [ngResource](https://docs.angularjs.org/api/ngResource/service/$resource)
Out of the box model layer, very limited.

- [angularjs-rails-resource](https://github.com/FineLinePrototyping/angularjs-rails-resource)
Too rails-ish.

- [angular-nested-resource](https://github.com/roypeled/angular-nested-resource) - Okay API, not loving the nested architecture.

- [Aar.js](http://aarjs.com/)
Very light, not sure what value this adds.

- [Angular Activerecord](https://github.com/bfanger/angular-activerecord)
A copy of BackboneModel but doesn't really work with Angular patterns.

- [Angular-Data](http://angular-data.pseudobry.com/)
Not really a model layer but a data store.  Very very heavy ( 67kb min )

- [ngActiveResource](https://github.com/FacultyCreative/ngActiveResource)
Very ruby-ish api.  Requires lodash.  Has validation but thats not needed in angular if you do it right.

- [restangular](https://github.com/mgonto/restangular) 
I don't consider this a model layer; it feels moore like a fancy http layer that returns promises because everyone complains about ngResource not doing it.  It requires underscore.

- [BreezeJS](http://www.breezejs.com/) 
This is a very full featured model/cache/validation etc.  Its framework agnostic, which means it follows its own patterns and not angulars.  Its very heavy, requires server data massaging, and the API looks like Microsoft Entity Framework.

- [ng-backbone](https://github.com/adrianlee44/ng-backbone)
Another backbone model clone.  This one actually requires backbone and lodash.

## Install

Install via bower:

```
$ bower install angular-model-factory --save
```

Install via npm:

```
$ npm install angular-model-factory --save
```

Alternatively you can download/clone the repo and link the files in `dist/`. 

### Dependencies

- Angular >= 1.3
- [deep-diff](https://github.com/flitbit/diff)
- [uri-templates](https://github.com/geraintluff/uri-templates)


## Contribute

Libraries like this live and get better with an active community. Have something to contribute? We'd love to see it. Just head over to our [contribution guidelines](CONTRIBUTING.md).

## Credits

`angular-model-factory` is a [Swimlane](http://swimlane.com) open-source project; we believe in giving back to the open-source community by sharing some of the projects we build for our application. Swimlane is an automated cyber security operations and incident response platform that enables cyber security teams to leverage threat intelligence, speed up incident response and automate security operations.
