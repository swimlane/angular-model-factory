# modelFactory [![Build Status](https://travis-ci.org/phxdatasec/model-factory.svg?branch=master)](https://travis-ci.org/phxdatasec/model-factory)

A light-weight model layer that bridges the gap between JavaScript and RESTful API's in Angular.

Why would you use this over other available solutions?

- Lightweight/Simple, the code simply does some basic copy/extending and prototypical instances; no magic required.
- Patterns/Practices, the model definition closely resembles Angular's ngResource meaning its easy to swap out, replace later (if ngResource gets awesome suddenly), eases scaling new devs / organizations, and its designed for Angular; not a backbone port!
- Utilizes Angular at the core, it doesn't duplicate things Angular already does.  Any action can be passed a `$http` configuration option, all your interceptors still work, it uses Angular's cache, etc!
- Compliant, URI Template matches the specs.
- 1.45KB gzipped/minified ( excludes depedencies )
- Minimal Dependencies, only use URI template and deep-diff ( this isn't even required ) utility.  NO underscore, lodash, jquery, etc!
- Its full of awesome features


See [wiki](https://github.com/phxdatasec/model-factory/wiki) for documentation.


## Features

- URI Templates (RFC6570)
- Object Deep Diff / Reversion
- Model instances
- Collections
- Single Datastore
- Caching
- Default value population
- Pending / Completed Status
- Relationships
- Track active promises to prevent duplicate sends


## Dependencies

- Angular >= 1.3
- [deep-diff](https://github.com/flitbit/diff)
- [uri-templates](https://github.com/geraintluff/uri-templates)


## Development

### Prepare your environment
* Install [Node.js](http://nodejs.org/) and NPM (should come with)
* Install global dev dependencies: `npm install -g bower grunt-cli`
* Install local dev dependencies: `npm install && bower install` in repository directory

### Development Commands

* `grunt build` to concat and build
* `grunt karma` for one-time test with karma

## Contributing

- Run the tests
- Create a feature branch
- When issuing a pull request, please exclude changes from the "dist" folder to avoid merge conflicts.
