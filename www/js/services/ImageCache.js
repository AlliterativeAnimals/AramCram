angular.module("starter.services.imagecache", [ "starter.services.cache" ])

    .factory(
        "ImageCache",
        function($q, Cache, $timeout) {

            var Cache = Cache.buildCache("ImageCache");
                cacheKey = "ImageCache";

            function guid() {
                return +new Date() + "" + (Math.random() * 1000000000000000000 + "");
            }

            var ImageCache = {
                    get: function(url) {
                        var deferred = $q.defer(),
                            fileTransfer = null;

                        if (Cache.get(url)) {
                            deferred.resolve(Cache.get(url));
                        } else if (window.FileTransfer) {
                            fileTransfer = new FileTransfer();
                            fileTransfer.download(
                                encodeURI(url),
                                cordova.file.dataDirectory + guid(),
                                function(entry) {
                                    deferred.resolve(entry.toURL());
                                },
                                function(error) {
                                    console.error("Cannot download '" + url + "'");
                                    deferred.resolve(url);
                                }
                            );

                            deferred.promise.then(function(newurl) {
                                if (newurl !== url) {
                                    Cache.set(url, newurl);
                                }
                            });

                        } else {
                            deferred.resolve(url);
                        }

                        return deferred.promise;
                    },
                    clear: function() {
                        Cache.clear();
                    }
                },
                cacheObject = null;

            return ImageCache;
        }
    )
    ;
