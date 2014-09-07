angular.module('starter.controllers.listfirstletterctrl', ['starter.services'])
    .config(function($stateProvider) {
        $stateProvider
            .state(
                'app.listfirstletter',
                {
                    url: "/first_letter",
                    views: {
                    'menuContent' :{
                        templateUrl: "templates/list-first-letter.html",
                        controller: 'ListFirstLetterCtrl'
                    }
                }
            });
    })
    .controller('ListFirstLetterCtrl', function($scope, Champion) {

        $scope.letters = [];
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(function(letter) {
            $scope.letters.push({
                letter: letter,
                champions: []
            })
        });

        Champion.list().then(function(champions) {
            $scope.playlists = [];
            Object.keys(champions).forEach(function(key) {
                var entry = {
                        title: champions[key].name,
                        subtitle: champions[key].title,
                        image: null,
                        id: key
                    },
                    index = entry.title.toUpperCase().charCodeAt(0) -65;

                $scope.letters[index].champions.push(entry);
            })
        })

        $scope.playlists = [];
    })
    ;
