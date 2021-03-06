// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.directives'])

.run(function($ionicPlatform, $q, Champion, $ionicLoading) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    if (navigator.splashscreen) {
        navigator.splashscreen.hide();

        // var imagePromises = [],
        //     donePromises = 0;
        //
        // function updateLoadingTemplate() {
        //     $ionicLoading.show({
        //         template: '<i class="ion-loading-d"></i><br />Fetching champion details...<br />' + donePromises + '/' + imagePromises.length
        //     });
        // }
        //
        // Champion.list().then(function(championList) {
        //     Object.keys(championList).forEach(function(key) {
        //         imagePromises.push(Champion.getImageThumb(key));
        //         imagePromises.push(Champion.getImageSprite(key));
        //     });
        //
        //     imagePromises.forEach(function(imagePromise) {
        //         imagePromise.finally(function() {
        //             donePromises += 1;
        //             updateLoadingTemplate();
        //         });
        //     });
        //
        //     $q.all(imagePromises).finally(function() {
        //         navigator.splashscreen.hide();
        //         $ionicLoading.hide();
        //     });
        // })
    }
  });
})

.config(function($urlRouterProvider) {
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/startup');
});
