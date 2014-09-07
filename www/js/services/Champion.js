angular.module("starter.services.champion", [])

    .factory(
        "Champion",
        function($http, $q, Cache, DDragon) {

            var Champion = { // K5
                list: function() {
                    var cacheKey = "Champion.list",
                        cached = Cache.get(cacheKey),
                        deferred = $q.defer();

                    if (cached) {
                        deferred.resolve(cached);
                    } else {
                        $q.all([
                            DDragon.getCDN(),
                            DDragon.getVersion("champion")
                        ]).then(function(results) {
                            var cdn = results[0],
                                version = results[1];

                            $http
                                .get(cdn + "/" + version + "/data/en_US/champion.json")
                                .success(function(result) {
                                    deferred.resolve(result.data);
                                })
                                .error(deferred.reject);

                        }, deferred.reject);
                    }

                    deferred.promise.then(function(result) {
                        Cache.set(cacheKey, result);
                    });

                    return deferred.promise;
                },
                get: function(id) {
                    var cacheKey = "Champion.get[" + id + "]",
                        ourCache = Cache.buildCache(cacheKey),
                        cached = ourCache.get(cacheKey),
                        deferred = $q.defer();

                    if (cached) {
                        deferred.resolve(cached);
                    } else {
                        $q.all([
                            DDragon.getCDN(),
                            DDragon.getVersion("champion")
                        ]).then(function(results) {
                            var cdn = results[0],
                                version = results[1];

                            $http
                                .get(cdn + "/" + version + "/data/en_US/champion/" + id + ".json")
                                .success(function(result) {
                                    deferred.resolve(result.data[id]);
                                })
                                .error(deferred.reject);

                        }, deferred.reject);
                    }

                    deferred.promise.then(function(result) {
                        ourCache.set(cacheKey, result);
                    });

                    return deferred.promise;
                },
                getImageThumb: function(name) {
                    var deferred = $q.defer();

                    $q.all([
                        DDragon.getVersion("champion"),
                        DDragon.getCDN(),
                        Champion.get(name)
                    ]).then(function(result) {
                        var version = result[0],
                            cdn = result[1],
                            champion = result[2];

                        deferred.resolve(cdn + "/" + version + "/img/champion/" + champion.image.full);

                    }, deferred.reject);

                    return deferred.promise;
                },
                getImageSprite: function(name) {
                    var deferred = $q.defer();

                    $q.all([
                        DDragon.getVersion("champion"),
                        DDragon.getCDN(),
                        Champion.get(name)
                    ]).then(function(result) {
                        var version = result[0],
                            cdn = result[1],
                            champion = result[2];

                        deferred.resolve({
                            image: cdn + "/" + version + "/img/sprite/" + champion.image.sprite,
                            w: champion.image.w,
                            h: champion.image.h,
                            x: champion.image.x,
                            y: champion.image.y
                        });

                    }, deferred.reject);

                    return deferred.promise;
                },
                getImageSplash: function(name, number) {
                    var deferred = $q.defer();

                    DDragon.getCDN().then(function(cdn) {
                        deferred.resolve(cdn + "/img/champion/splash/" + name + "_" + number + ".jpg");
                    }, deferred.reject);

                    return deferred.promse;
                },
                getImageCard: function (name, number) {
                    var deferred = $q.defer();

                    deferred.resolve("http://www.leagueoflegendsskins.com/images/champions/small/" + name + "_" + number + ".jpg");

                    return deferred.promise;
                },
                getImageSpell: function(championId, spellId) {
                    var deferred = $q.defer();

                    $q.all([
                        Champion.get(championId),
                        DDragon.getVersion("champion"),
                        DDragon.getCDN()
                    ]).then(function(result) {
                        var champion = result[0],
                            version = result[1],
                            cdn = result[2],
                            imageName = null;

                        champion.spells.forEach(function(spell) {
                            if (spell.id === spellId) {
                                imageName = spell.image.full
                            }
                        });

                        console.info("Got image: " + cdn + "/" + version + "/img/spell/" + imageName);

                        deferred.resolve(cdn + "/" + version + "/img/spell/" + imageName);

                    }, function(reason) {
                        console.error(reason);
                        deferred.reject(reason);
                    });

                    return deferred.promise;
                }
            };

            return Champion;
        }
    )
    ;
