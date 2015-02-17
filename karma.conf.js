
module.exports = function(config) {
    "use strict";

    config.set({

        basePath: "./www/",

        preprocessors: {
            "js/**/*-{ctrl,filter,handler,directive,exception,service}.js": "coverage"
        },

        files: [
            "lib/bind-polyfill/index.js",
            "lib/angular/angular.js",
            "lib/angular-mocks/angular-mocks.js",
            "lib/angular-animate/angular-animate.js",
            "lib/angular-sanitize/angular-sanitize.min.js",
            "lib/angular-ui-router/release/angular-ui-router.js",
            "lib/ionic/js/ionic.js",
            "lib/ionic/js/ionic-angular.js",
            "js/*/**/*.js",
            "js/app.js",
            "js/env.js"
        ],

        exclude: [
            "coverage/**/*"
        ],

        autoWatch: true,

        frameworks: [ "jasmine" ],
        reporters: [ "progress", "coverage", "junit" ],
        browsers: [ "PhantomJS" ],
        logLevel: config.LOG_ERROR,

        plugins: [
            "karma-phantomjs-launcher",
            "karma-jasmine",
            "karma-jasmine-jquery",
            "karma-ng-html2js-preprocessor",
            "karma-junit-reporter",
            "karma-coverage"
        ],

        junitReporter: {
            outputFile: "../karma-coverage/karma_junit.xml"
        },

        coverageReporter: {
            dir: "../karma-coverage/",
            reporters: [
                { type: "text-summary", subdir: "." },
                { type: "html", subdir: "." },
                { type: "lcov", subdir: "../www/coverage" },
                { type: "cobertura", subdir: "../www/coverage" }
            ]
        }
    });
};
