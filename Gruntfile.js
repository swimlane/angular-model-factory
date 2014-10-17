module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-requirejs');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bower: {
            all:{
                rjsConfig: 'main.js'
            }
        },
        requirejs: {
            compile: {
                options: {
                    removeCombined: true,
                    findNestedDependencies: true,
                    //insertRequire: ['main'],
                    name: 'main',
                    out: 'dist/modelFactory.js',
                    separateCSS: true,
                    skipDirOptimize: true,
                    fileExclusionRegExp: /^(?:node_modules|(?:r|build)\.js)$/,

                    mainConfigFile: 'main.js',
                    preserveLicenseComments: false,
                    //include: ['bower_components/requirejs/require'],
                    //optimize: 'none',
                    optimize: 'uglify2',
                    uglify2:{
                        mangle: false
                    },
                    production: true,
                    compile: {
                        options: {
                            paths: {
                                'angular':'empty:',
                                'main':'empty:'
                            }
                        }
                    }
                }
            }
        }
    });

    grunt.registerTask('build', ['requirejs']);

    return grunt;
};