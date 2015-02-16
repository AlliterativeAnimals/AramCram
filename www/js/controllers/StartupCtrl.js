angular.module('starter.controllers.startupctrl', ['starter.services'])
    .config(function($stateProvider) {
        $stateProvider

            .state('startup', {
                url: "/startup",
                templateUrl: "templates/startup.html",
                controller: 'StartupCtrl'
            })
    })
    .controller('StartupCtrl', function($scope, Champion, $q, $state, $ionicViewService, $timeout, $ionicLoading) {

        var imagePromises = [],
            donePromises = 0;

        function updateLoadingTemplate() {
            $ionicLoading.show({
                template: '<i class="ion-loading-d"></i><br />Fetching champion details...<br />' + donePromises + '/' + imagePromises.length
            });
        }

        $ionicViewService.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });

        Champion.list().then(function(championList) {
            Object.keys(championList).forEach(function(key) {
                imagePromises.push(Champion.getImageThumb(key));
                imagePromises.push(Champion.getImageSprite(key));
            });

            imagePromises.forEach(function(imagePromise) {
                imagePromise.finally(function() {
                    donePromises += 1;
                    updateLoadingTemplate();
                });
            });

            $q.all(imagePromises).finally(function() {
                $ionicLoading.hide();
                $timeout(function() {
                    $state.go("app.listfirstletter");
                }, 0);
            });
        });
    })
    ;
