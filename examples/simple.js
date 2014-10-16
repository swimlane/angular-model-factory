define(['angular', 'modelFactory'], function (angular) {

    var module = angular.module('services.apps', ['modelFactory']);

    module.factory('AppsModel', function($modelFactory){
    
        var model = $modelFactory('api/apps', {
            defaults: {
                createWorkspace: true
            },
            actions: {
                query: {
                    cache: true
                },
                $copy: {
                    method: 'POST',
                    url: 'copy'
                },
                $download: {
                    method: 'POST',
                    url: 'export'
                }
            }
        });

        return model;
    });

    return module;
});