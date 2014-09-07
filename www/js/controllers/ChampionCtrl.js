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
            return string.replace(new RegExp(escapeRegExp(find) + "%?", 'g'), replace);
        }

        var linkTypes = {
            "spelldamage": " Ability Power",
            "mana": " Max Mana",
            "bonusattackdamage": " Bonus Attack Damage",
            "attackdamage": " Attack Damage",
            "@stacks": " Stacks",
            "@cooldownchampion": " Seconds",
            "@dynamic.attackdamage": " Attack Damage",
            "@special.dariusr3": "",
            "@text": "",
            "@dynamic.abilitypower": " Ability Power",
            "@special.jaxrarmor": "",
            "@special.jaxrmr": "",
            "bonusarmor": " Bonus Armor",
            "@special.nautilusq": "",
            "bonushealth": " Bonus Health",
            "armor": " Armor"
        };

        var noFormatNumber = [
            "@cooldownchampion",
            "@special.dariusr3",
            "@text",
            "@stacks"
        ];

        var replacements = {
            "@Effect3Amount*-100@": "LISSANDRA16/19/22/25/28%<!--Lissandra-->",
            "@Effect2Amount*-100@": "LISSANDRA20/30/40%"
        };

        var reduceIfSameValues = function reduceIfSameValues(prev, curr) {
            return (prev && prev === curr ? prev : null);
        }

        function formatVariable(variable, spell) {
            var value = (variable.coeff + "").split(",").map(function(value) { return Math.floor(value * 100); }).join("/"),
                label = typeof linkTypes[variable.link] !== "undefined" ? linkTypes[variable.link] + "<!--" + variable.link + "-->" : variable.link;

            // Simplify from 'x/x/x/x' to 'x'
            if (value.split("/").reduce(reduceIfSameValues)) {
                value = value.split("/")[0];
            }
            if ((variable.coeff + "").split(",").reduce(reduceIfSameValues)) {
                variable.coeff = (variable.coeff + "").split(",")[0];
            }

            return (noFormatNumber.indexOf(variable.link) > -1 ? variable.coeff : value + "%") + label;
        }

        function processSpellDescription(spell) {
            var description = spell.tooltip,
                regex = /\{\{ [0-9a-z]+ \}\}/g;

            Object.keys(replacements).forEach(function(key) {
                description = replaceAll(description, key, replacements[key]);
            })

            spell.effectBurn.forEach(function(val, key) {
                var search = "{{ e" + key + " }}",
                    replace = val;
                console.log(search, replace)
                description = replaceAll(description, search, replace);
            });

            spell.vars.forEach(function(variable) {
                var search = "{{ " + variable.key + " }}",
                    rounded = Math.floor(variable.coeff * 100);
                    replace = formatVariable(variable); //(rounded ? rounded + "%" : variable.coeff) + " " + (linkTypes[variable.link] ? linkTypes[variable.link] : variable.link);
                if (variable.coeff + "" === "0") {
                    replace = "";
                }
                description = replaceAll(description, search, replace);
            });

            if (regex.test(description)) {
                description.match(regex).forEach(function(missing) {
                    console.error("Could not match variable '" + missing + "' in spell '" + spell.id + "'");

                    description = replaceAll(description, missing, "<!--" + missing + "-->");
                });
            }

            description = description.replace(/[^ ><]*~\?~[^ ><]*/g, "");

            return $sce.trustAsHtml(description);
        }

        $scope.spellImages = [];
        $scope.spellDescription = [];
    })
    ;
