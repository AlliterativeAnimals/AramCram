angular.module("starter.services.preferences", [])

    .factory(
        "Preferences",
        function(Cache) {

            function getObject() {
                try {
                    preferencesObject = preferencesObject ? preferencesObject : Cache.get("preferences");
                } catch (e) {}

                if (!preferencesObject) {
                    preferencesObject = {};
                }

                return preferencesObject;
            }

            function saveObject() {
                Cache.set("preferences", getObject());
            }

            var Preferences = {
                    get: function(key, fallback) {
                        var value = getObject()[key];
                        if (!value) {
                            value = fallback;
                            Preferences.set(key, fallback);
                        }
                        return value ? value : fallback;
                    },
                    set: function(key, value) {
                        getObject()[key] = value;
                        saveObject();
                    },
                    clear: function() {
                        preferencesObject = {};
                        saveObject();
                    }
                },
                preferencesObject;

            return Preferences;
        }
    )
