angular.module("starter.services.cache", [])

    .factory(
        "Cache",
        function($q) {

            // var cacheKey = "cache";

            var caches = {};

            function buildCache(cacheKey) {

                var _cacheKey = cacheKey;

                if (caches[_cacheKey]) {
                    return caches[_cacheKey];
                } else {

                    function getObject(cacheKey) {
                        try {
                            cacheObject = cacheObject ? cacheObject : JSON.parse(localStorage.getItem(cacheKey));
                        } catch (e) {}

                        if (!cacheObject) {
                            cacheObject = {};
                        }

                        return cacheObject;
                    }

                    function saveObject(cacheKey) {
                        localStorage.setItem(cacheKey, JSON.stringify(getObject()));
                    }

                    var Cache = {
                            get: function(key, defaultValue) {
                                var result = getObject(_cacheKey)[key];
                                return result ? result : defaultValue;
                            },
                            set: function(key, value) {
                                getObject(_cacheKey)[key] = value;
                                saveObject(_cacheKey);
                            },
                            clear: function() {
                                cacheObject = {};
                                saveObject(_cacheKey);
                            },
                            buildCache: buildCache
                        },
                        cacheObject = null;

                    caches[_cacheKey] = Cache;

                    return Cache;
                }
            }

            return buildCache("cache");
        }
    )
    ;
