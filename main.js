require.config({
    paths: {
        angular: 'bower_components/angular/angular',
        requirejs: 'bower_components/requirejs/require',
        'uri-templates': 'bower_components/uri-templates/uri-templates',
        'deep-diff': 'bower_components/deep-diff/index'
    },
    shim: {
        jquery: {
            exports: '$'
        },
        angular: {
            exports: 'angular'
        },
        'deep-diff': {
            exports: 'DeepDiff'
        }
    },
    env: 'development',
    packages: []
});

require(['src/modelFactory']);