angular.module('starter.controllers.championctrl', ['starter.services'])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app.champion', {
                url: "/champion/:id",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/champion.html",
                        controller: 'ChampionCtrl'
                    }
                }
            })
    })
    .controller('ChampionCtrl', function($scope, $stateParams, $sce, Champion) {
        window.stateParps = $stateParams;
        Champion.get($stateParams.id).then(function(champion) {
            $scope.champion = champion;
            champion.spells.forEach(function(spell) {
                Champion.getImageSpell($stateParams.id, spell.id).then(function (path) {
                    $scope.spellImages[spell.id] = path;
                })
                $scope.spellDescription[spell.id] = processSpellDescription(spell);
            });
        });

        function escapeRegExp(string) {
            return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        }

        function replaceAll(string, find, replace) {
            return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
        }

        function processSpellDescription(spell) {
            var description = spell.tooltip,
                regex = /\{\{ [0-9a-z]+ \}\}/g;

            spell.effectBurn.forEach(function(val, key) {
                var search = "{{ e" + key + " }}",
                    replace = val;
                console.log(search, replace)
                description = replaceAll(description, search, replace);
            });

            spell.vars.forEach(function(variable) {
                description = replaceAll(description, "{{ " + variable.key + " }}", variable.coeff);
            });

            if (regex.test(description)) {
                description.match(regex).forEach(function(missing) {
                    console.error("Could not match variable '" + missing + "' in spell '" + spell.id + "'");

                    description = replaceAll(description, missing, "~?~");
                });
            }

            description = description.replace(/[^ ><]*~\?~[^ ><]*/g, "?");

            return $sce.trustAsHtml(description);
        }

        $scope.spellImages = [];
        $scope.spellDescription = [];
    })
    ;
