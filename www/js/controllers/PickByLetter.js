angular.module('starter.controllers.pickbyletter', ['starter.services'])
    .config(function($stateProvider) {
        $stateProvider
            .state(
                'app.pickbyletter',
                {
                    url: "/first_letter/:letter",
                    views: {
                    'menuContent' :{
                        templateUrl: "templates/pick-by-letter.html",
                        controller: 'PickByLetterCtrl'
                    }
                }
            });
    })
    .controller('PickByLetterCtrl', function($scope, $stateParams, Champion) {

        $scope.letters = [];
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(function(letter) {
            $scope.letters.push({
                letter: letter,
                champions: []
            })
        });

        $scope.theLetter = $stateParams.letter;

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

                Champion.getImageThumb(key).then(function(image) {
                    entry.image = image;
                });

            })
        })

        $scope.playlists = [];
    })
    ;
