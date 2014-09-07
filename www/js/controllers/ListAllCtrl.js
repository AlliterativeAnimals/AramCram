angular.module('starter.controllers.listallctrl', ['starter.services'])
    .config(function($stateProvider) {
        $stateProvider
            .state(
                'app.listall',
                {
                    url: "/all",
                    views: {
                    'menuContent' :{
                        templateUrl: "templates/list-all.html",
                        controller: 'ListAllCtrl'
                    }
                }
            });
    })
    .controller('ListAllCtrl', function($scope, Champion) {
        Champion.list().then(function(champions) {
            $scope.playlists = [];
            Object.keys(champions).forEach(function(key) {
                var entry = {
                        title: champions[key].name,
                        subtitle: champions[key].title,
                        image: null,
                        id: key
                    };
                $scope.playlists.push(entry);
                Champion.getImageThumb(key).then(function(image) {
                    entry.image = image;
                });
            })
        })

        $scope.playlists = [];
    })
    ;
