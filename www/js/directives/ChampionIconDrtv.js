angular.module("starter.directives.championicon", [ ])
    .directive("championIcon", function() {
        return {
            restrict: "E",
            replace: true,
            controller: function($scope, Champion, ImageCache, $timeout) {
                $scope.$watch("name", function() {
                    if ($scope.name && $scope.imagesize) {
                        if ($scope.imagesize === "sprite") {
                            Champion.getImageSprite($scope.name).then(function(sprite) {
                                $scope.sprite = sprite;
                                $scope.style = {
                                    "display": "inline-block",
                                    "background-image": "url(" + sprite.image + ")",
                                    'background-position-x': -sprite.x + "px",
                                    'background-position-y': -sprite.y + "px",
                                    "width": sprite.w + "px",
                                    "height": sprite.h + "px"
                                }
                            });
                        } else {
                            Champion.getImageThumb($scope.name).then(function(url) {
                                $scope.thumb = url;
                                $scope.style = {
                                    "display": "inline-block",
                                    "width": "120px",
                                    "height": "120px",
                                    "background-image": "url(" + url + ")"
                                };
                            });
                        }
                    }
                });
            },
            scope: {
                name: "=name",
                imagesize: "@size"
            },
            templateUrl: "templates/directives/championIcon.html"
        };
    });
