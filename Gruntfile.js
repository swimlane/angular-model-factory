module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-ng-annotate');

    grunt.initConfig({
        pkg: grunt.file.readJSON('bower.json'),

        meta: {
          banner: '/**\n' +
          ' * <%= pkg.description %>\n' +
          ' * @version v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
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
            banner: '<%= meta.banner %>\n(function(angular, undefined) {\n\'use strict\';\n',
            footer: '})(angular);',
            process: function(src, filepath) {
              return src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
            }
          },
          ngAnnotate: {
            app: {
              files: [
                {
                    expand: true,
                    src: ['src/*.js'],
                    rename: function (dest, src) { return src + '-annotated'; },
                }
              ]
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
            banner: '<%= meta.banner %>'
          },
          dist: {
            files: {
              'dist/<%= pkg.name %>.min.js': 'dist/<%= pkg.name %>.js',
              'dist/<%= pkg.name %>-bundle.min.js': 'dist/<%= pkg.name %>-bundle.js'
            }
          }
        }
    });

    grunt.registerTask('prebuild', ['bower', 'ngAnnotate']);
    grunt.registerTask('build', ['concat', 'uglify']);

    return grunt;
};