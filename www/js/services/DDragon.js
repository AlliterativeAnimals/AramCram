angular.module("starter.services.ddragon", [])

    .factory(
        "DDragon",
        function($http, $q, Cache, Preferences) {

            var ttl = 60*60*1; // 1 hour

            function now() {
                return +new Date / 1000 | 0;
            }

            function getFromCache(key, callback) {
                var result = null;

                if (Cache.get("ddragon_" + key + "_last") + ttl > now()) {
                    result = Cache.get("ddragon_" + key);
                }

                return result;
            }

            function saveToCache(key, value) {
                Cache.set("ddragon_" + key, value);
                Cache.set("ddragon_" + key + "_last", now());
            }

            var DDragon = {
                    getInfo: function() {
                        if (getInfoPromise) {
                            return getInfoPromise;
                        }

                        var realm = Preferences.get("realm", "euw"),
                            cacheKey = "DDragon.getInfo[" + realm + "]",
                            deferred = $q.defer();

                        if (getFromCache(cacheKey)) {
                            deferred.resolve(getFromCache(cacheKey));
                        } else {
                            $http.get(
                                "http://ddragon.leagueoflegends.com/realms/" +
                                    realm + ".json"
                            ).success(function(data) {
                                console.debug("got response from " + realm + ".json");
                                deferred.resolve(data);
                            }).error(function(reason) {
                                console.error("couldn't get response from " + realm + ".json");
                                deferred.reject(reason);
                            });
                        }

                        deferred.promise.then(function (input) {
                            saveToCache(cacheKey, input);
                            return input;
                        })

                        deferred.promise.finally(function() {
                            getInfoPromise = null;
                        });

                        return getInfoPromise = deferred.promise;
                    },
                    getVersion: function(type) {
                        var deferred = $q.defer();

                        DDragon.getInfo().then(function(result) {
                            deferred.resolve(result.n[type]);
                        }, deferred.reject);

                        return deferred.promise;
                    },
                    getCDN: function () {
                        var deferred = $q.defer();

                        DDragon.getInfo().then(function(result) {
                            deferred.resolve(result.cdn);
                        }, deferred.reject);

                        return deferred.promise;
                    },
                    getChampionThumb: function(name) {
                        var deferred = $q.defer();

                        $q.all([
                            DDragon.getVersion("champion"),
                            DDragon.getCDN()
                        ]).then(function(result) {
                            var version = result[0],
                                cdn = result[1];

                            deferred.resolve(cdn + "/" + version + "/img/champion/" + name + ".png");

                        }, deferred.reject);

                        return deferred.promise;
                    },
                    getChampionSplash: function(name, number) {
                        // http://ddragon.leagueoflegends.com/cdn/img/champion/splash/Teemo_0.jpg

                    }
                },
                getInfoPromise = null;

            return DDragon;
        }
    )
    ;
