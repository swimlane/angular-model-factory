module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-karma');

    var ngAnnotate = require("ng-annotate");

    grunt.initConfig({
        pkg: grunt.file.readJSON('bower.json'),
        npmpkg: grunt.file.readJSON('package.json'),

        meta: {
          banner: '/**\n' +
          ' * <%= pkg.description %>\n' +
          ' * @version v<%= npmpkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
          ' * @link <%= pkg.homepage %>\n' +
          ' * @author <%= pkg.authors.join(", ") %>\n' +
          ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' +
          ' */\n'
        },
        bower: {
          install: {}
        },
        concat: {
          options: {
            //banner: '<%= meta.banner %>\n(function(angular, undefined) {\n\'use strict\';\n',
            banner: '<%= meta.banner %>\n',
            footer: '',
            process: function(src, filepath) {
              var res = ngAnnotate(src, {
                  add: true,
              });

              if (res.errors) {
                  // do something with this, res.errors is now an array of strings
                  throw new Error(res.errors.join("\n"));
              } else {
                  return res.src;
              }
            }
          },
          dist: {
            files: {
              'dist/<%= pkg.name %>.js': [
                'src/**/*.js'
              ],
              'dist/<%= pkg.name %>-bundle.js': [
                'bower_components/deep-diff/releases/deep-diff-0.2.0.min.js',
                'bower_components/uri-templates/uri-templates.js',
                'src/**/*.js'
              ]
            }
          }
        },
        uglify: {
          options: {
            mangle: true,
            banner: '<%= meta.banner %>'
          },
          dist: {
            files: {
              'dist/<%= pkg.name %>.min.js': 'dist/<%= pkg.name %>.js',
              'dist/<%= pkg.name %>-bundle.min.js': 'dist/<%= pkg.name %>-bundle.js'
            }
          }
        },
        karma: {
          dev: {
            configFile: 'test/karma.conf.js',
            singleRun: false,
            autoWatch: true,
            browsers: ['Chrome'],
            reporters: ['mocha']
          },
          ie: {
            configFile: 'test/karma.conf-ci.js',
            singleRun: true,
            autoWatch: false,
            browsers: ['IE'],
            reporters: ['mocha']
          },
          ci: {
            configFile: 'test/karma.conf-ci.js',
            singleRun: true,
            autoWatch: false,
            browsers: ['PhantomJS'],
            reporters: ['mocha']
          }
        }
    });

    grunt.registerTask('build', ['concat', 'uglify']);

    return grunt;
};