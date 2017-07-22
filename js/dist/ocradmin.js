(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("underscore"), require("jQuery"));
	else if(typeof define === 'function' && define.amd)
		define(["underscore", "jQuery"], factory);
	else if(typeof exports === 'object')
		exports["Ocr"] = factory(require("underscore"), require("jQuery"));
	else
		root["OCA"] = root["OCA"] || {}, root["OCA"]["Ocr"] = factory(root["_"], root["$"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var http_service_1 = __webpack_require__(1);
	var controller_1 = __webpack_require__(2);
	var configuration_1 = __webpack_require__(3);
	var underscore_1 = __webpack_require__(4);
	var jquery_1 = __webpack_require__(5);
	var Admin = (function () {
	    function Admin() {
	        var _this = this;
	        _.delay(function () {
	            _this.config = new configuration_1.Configuration();
	            _this.httpService = new http_service_1.HttpService(_this.config, $);
	            _this.controller = new controller_1.Controller(_this.httpService, OC.Notification, $, document, t);
	            try {
	                _this.controller.init();
	            }
	            catch (e) {
	                console.error(e);
	                _this.controller.displayMessage(e.message, true);
	            }
	        }, 1000);
	    }
	    return Admin;
	}());
	exports.Admin = Admin;
	exports.$admin = new Admin();


/***/ }),
/* 1 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var HttpService = (function () {
	    function HttpService(config, jquery) {
	        this.config = config;
	        this.jquery = jquery;
	    }
	    HttpService.prototype.makeRequest = function (opts) {
	        return this.jquery.ajax(opts);
	    };
	    HttpService.prototype.sendLanguages = function (languages) {
	        var options = {
	            data: {
	                languages: languages,
	            },
	            method: 'POST',
	            url: this.config.languagesSettingsEndpoint,
	        };
	        return this.makeRequest(options);
	    };
	    HttpService.prototype.sendRedis = function (redisHost, redisPort, redisDb, redisPassword) {
	        var options = {
	            data: {
	                redisDb: redisDb,
	                redisHost: redisHost,
	                redisPassword: redisPassword,
	                redisPort: redisPort,
	            },
	            method: 'POST',
	            url: this.config.redisSettingsEndpoint,
	        };
	        return this.makeRequest(options);
	    };
	    return HttpService;
	}());
	exports.HttpService = HttpService;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Controller = (function () {
	    function Controller(httpService, notification, jquery, document, t) {
	        this.httpService = httpService;
	        this.notification = notification;
	        this.jquery = jquery;
	        this.document = document;
	        this.t = t;
	    }
	    Controller.prototype.init = function () {
	        this.registerEvents();
	        this.applyLanguagesButton = this.document.getElementById('languages_apply');
	        this.applyRedisButton = this.document.getElementById('redis_apply');
	    };
	    Controller.prototype.registerEvents = function () {
	        var _this = this;
	        this.document.addEventListener('click', function (event) {
	            if (event.target.id === 'languages_apply') {
	                _this.saveLanguages();
	            }
	            if (event.target.id === 'redis_apply') {
	                _this.saveRedis();
	            }
	        });
	    };
	    Controller.prototype.saveLanguages = function () {
	        var _this = this;
	        this.applyLanguagesButton.disabled = true;
	        var languages = this.getLanguages();
	        if (this.checkLanguagesValidity(languages)) {
	            this.sendLanguages(languages).done(function () {
	                _this.displayMessage(t('ocr', 'Saved.'), false);
	            }).fail(function (message) {
	                _this.displayMessage(t('ocr', 'Saving languages failed:') + " " + message, true);
	            });
	        }
	        else {
	            this.displayMessage(t('ocr', 'The languages are not specified in the correct format.'), true);
	        }
	        this.applyLanguagesButton.disabled = false;
	    };
	    Controller.prototype.saveRedis = function () {
	        var _this = this;
	        this.applyRedisButton.disabled = true;
	        var redisHost = this.getRedisHost();
	        var redisPort = this.getRedisPort();
	        var redisDb = this.getRedisDb();
	        var redisPassword = this.getRedisPassword();
	        if (this.checkRedisHostValidity(redisHost) && this.checkRedisPortValidity(redisPort) && this.checkRedisDbValidity(redisDb)) {
	            this.sendRedis(redisHost, "" + redisPort, "" + redisDb, "" + redisPassword).done(function () {
	                _this.displayMessage(t('ocr', 'Saved.'), false);
	            }).fail(function (message) {
	                _this.displayMessage(t('ocr', 'Saving Redis settings failed:') + " " + message, true);
	            });
	        }
	        else {
	            this.displayMessage(t('ocr', 'The Redis settings are not specified in the right format.'), true);
	        }
	        this.applyRedisButton.disabled = false;
	    };
	    Controller.prototype.displayMessage = function (message, error) {
	        if (error) {
	            this.notification.showHtml("<div>" + message + "</div>", { timeout: 10, type: 'error' });
	        }
	        else {
	            this.notification.showHtml("<div>" + message + "</div>", { timeout: 5 });
	        }
	    };
	    Controller.prototype.getLanguages = function () {
	        return this.document.getElementById('languages').value;
	    };
	    Controller.prototype.getRedisHost = function () {
	        return this.document.getElementById('redisHost').value;
	    };
	    Controller.prototype.getRedisPort = function () {
	        return parseInt(this.document.getElementById('redisPort').value, 10);
	    };
	    Controller.prototype.getRedisDb = function () {
	        return parseInt(this.document.getElementById('redisDb').value, 10);
	    };
	    Controller.prototype.getRedisPassword = function () {
	        return this.document.getElementById('redisPassword').value;
	    };
	    Controller.prototype.checkLanguagesValidity = function (languages) {
	        return /^(([a-z]{3,4}|[a-z]{3,4}\-[a-z]{3,4});)*([a-z]{3,4}|[a-z]{3,4}\-[a-z]{3,4})$/.test(languages);
	    };
	    Controller.prototype.checkRedisHostValidity = function (redisHost) {
	        return /(^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$)/.test(redisHost);
	    };
	    Controller.prototype.checkRedisPortValidity = function (redisPort) {
	        return redisPort > 0 && redisPort < 65535;
	    };
	    Controller.prototype.checkRedisDbValidity = function (redisDb) {
	        return redisDb >= 0;
	    };
	    Controller.prototype.sendLanguages = function (languages) {
	        var deferred = this.jquery.Deferred();
	        this.httpService.sendLanguages(languages).done(function () {
	            deferred.resolve();
	        }).fail(function (jqXHR) {
	            deferred.reject(jqXHR.responseText);
	        });
	        return deferred.promise();
	    };
	    Controller.prototype.sendRedis = function (redisHost, redisPort, redisDb, redisPassword) {
	        var deferred = this.jquery.Deferred();
	        this.httpService.sendRedis(redisHost, redisPort, redisDb, redisPassword).done(function () {
	            deferred.resolve();
	        }).fail(function (jqXHR) {
	            deferred.reject(jqXHR.responseText);
	        });
	        return deferred.promise();
	    };
	    Object.defineProperty(Controller.prototype, "applyLanguagesButton", {
	        get: function () {
	            return this._applyLanguagesButton;
	        },
	        set: function (value) {
	            this._applyLanguagesButton = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Controller.prototype, "applyRedisButton", {
	        get: function () {
	            return this._applyRedisButton;
	        },
	        set: function (value) {
	            this._applyRedisButton = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return Controller;
	}());
	exports.Controller = Controller;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Configuration = (function () {
	    function Configuration() {
	        this._languagesSettingsEndpoint = OC.generateUrl('/apps/ocr/admin/languages');
	        this._redisSettingsEndpoint = OC.generateUrl('/apps/ocr/admin/redis');
	    }
	    Object.defineProperty(Configuration.prototype, "languagesSettingsEndpoint", {
	        get: function () {
	            return this._languagesSettingsEndpoint;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Configuration.prototype, "redisSettingsEndpoint", {
	        get: function () {
	            return this._redisSettingsEndpoint;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return Configuration;
	}());
	exports.Configuration = Configuration;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ })
/******/ ])
});
;