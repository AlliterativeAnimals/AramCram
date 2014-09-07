angular.module("starter.services.imagecache", [ "starter.services.cache" ])

    .factory(
        "ImageCache",
        function($q, Cache) {

            var Cache = Cache.buildCache("ImageCache");
                cacheKey = "ImageCache";

            var Cache = {
                    get: function(url) {
                        var deferred = $q.defer();

                        deferred.resolve(url); // TODO: actually cache the image

                        return deferred.promise;
                    },
                    clear: function() {
                        Cache.clear();
                    }
                },
                cacheObject = null;

            return Cache;
        }
    )
    ;
