(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("underscore"), require("handlebars/runtime"), require("jQuery"));
	else if(typeof define === 'function' && define.amd)
		define(["underscore", "handlebars/runtime", "jQuery"], factory);
	else if(typeof exports === 'object')
		exports["Ocr"] = factory(require("underscore"), require("handlebars/runtime"), require("jQuery"));
	else
		root["OCA"] = root["OCA"] || {}, root["OCA"]["Ocr"] = factory(root["_"], root["Handlebars"], root["$"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_10__, __WEBPACK_EXTERNAL_MODULE_11__) {
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
	var view_1 = __webpack_require__(12);
	var controller_1 = __webpack_require__(13);
	var configuration_1 = __webpack_require__(14);
	var http_service_1 = __webpack_require__(15);
	var handlebarsTableTemplate = __webpack_require__(16);
	var underscore_1 = __webpack_require__(5);
	var jquery_1 = __webpack_require__(11);
	var Personal = (function () {
	    function Personal() {
	        var _this = this;
	        _.delay(function () {
	            _this.config = new configuration_1.Configuration();
	            _this.view = new view_1.View(OC.Notification, handlebarsTableTemplate, t, $, document);
	            _this.httpService = new http_service_1.HttpService(_this.config, $);
	            _this.controller = new controller_1.Controller(_this.view, _this.httpService, document, $, t);
	            try {
	                _this.controller.init();
	            }
	            catch (e) {
	                console.error(e);
	                _this.view.displayMessage(e.message, true);
	            }
	        }, 1000);
	    }
	    return Personal;
	}());
	exports.Personal = Personal;
	exports.$personal = new Personal();


/***/ }),
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ }),
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_10__;

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_11__;

/***/ }),
/* 12 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var View = (function () {
	    function View(notification, handlebarsTableTemplateFunction, t, jquery, document) {
	        this.notification = notification;
	        this.handlebarsTableTemplateFunction = handlebarsTableTemplateFunction;
	        this.t = t;
	        this.jquery = jquery;
	        this.document = document;
	        this.el = this.document.getElementById('ocr-settings');
	    }
	    View.prototype.displayMessage = function (message, error) {
	        if (error) {
	            this.notification.showHtml("<div>" + message + "</div>", { timeout: 10, type: 'error' });
	        }
	        else {
	            this.notification.showHtml("<div>" + message + "</div>", { timeout: 10 });
	        }
	    };
	    View.prototype.render = function (status) {
	        var html = this.renderTable(status);
	        this.appendHtmlToElement(html, this.el);
	    };
	    View.prototype.destroy = function () {
	        this.el.innerHTML = '';
	    };
	    View.prototype.renderTable = function (status) {
	        var template = this.handlebarsTableTemplateFunction;
	        var enabled = status && status.length > 0 ? true : false;
	        return template({
	            deleteText: t('ocr', 'Delete'),
	            enabled: enabled,
	            noPendingOrFailedText: t('ocr', 'No pending or failed OCR items found.'),
	            refreshButtonText: t('ocr', 'Refresh'),
	            status: status,
	            tableHeadDeleteFromQueueText: t('ocr', 'Delete from queue'),
	            tableHeadNameText: t('ocr', 'Name'),
	            tableHeadStatusText: t('ocr', 'Status'),
	        });
	    };
	    View.prototype.appendHtmlToElement = function (html, el) {
	        this.jquery(html).appendTo(el);
	    };
	    Object.defineProperty(View.prototype, "el", {
	        get: function () {
	            return this._el;
	        },
	        set: function (value) {
	            this._el = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return View;
	}());
	exports.View = View;


/***/ }),
/* 13 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Controller = (function () {
	    function Controller(view, httpService, document, jquery, t) {
	        this.view = view;
	        this.httpService = httpService;
	        this.document = document;
	        this.jquery = jquery;
	        this.t = t;
	        this._status = [];
	    }
	    Controller.prototype.init = function () {
	        this.loadAndRender();
	        this.registerEvents();
	    };
	    Controller.prototype.destroy = function () {
	        this.view.destroy();
	    };
	    Controller.prototype.loadAndRender = function () {
	        var _this = this;
	        this.httpService.getAllStatus().always(function () {
	            _this.view.destroy();
	        }).done(function (status) {
	            _this.status = status;
	            _this.view.render(_this.status);
	        }).fail(function (jqXHR) {
	            _this.view.displayMessage(t('ocr', 'OCR status could not be retrieved:') + " " + jqXHR.responseText, true);
	            _this.status = [];
	            _this.view.render(_this.status);
	        });
	    };
	    Controller.prototype.delete = function (id) {
	        var _this = this;
	        this.httpService.deleteStatus(id).done(function () {
	            _this.view.destroy();
	            var status = _this.status.filter(function (s) { return s.id === id; });
	            _this.status = _this.status.filter(function (s) {
	                return s.id !== id;
	            });
	            _this.view.displayMessage(t('ocr', 'Following status object has been successfully deleted:') + " " + status[0].target, false);
	            _this.view.render(_this.status);
	        }).fail(function (jqXHR) {
	            _this.view.displayMessage(t('ocr', 'Error during deletion:') + " " + jqXHR.responseText, true);
	            _this.loadAndRender();
	        });
	    };
	    Controller.prototype.registerEvents = function () {
	        var _this = this;
	        this.document.addEventListener('click', function (event) {
	            if (event.target.id === 'ocr-search') {
	                _this.loadAndRender();
	            }
	        });
	        this.document.addEventListener('click', function (event) {
	            if (event.target.id === 'ocr-delete' || event.target.parentNode.id === 'ocr-delete') {
	                _this.delete(event.target.closest('tr').dataset.id - 0);
	            }
	        });
	    };
	    Object.defineProperty(Controller.prototype, "status", {
	        get: function () {
	            return this._status;
	        },
	        set: function (value) {
	            this._status = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return Controller;
	}());
	exports.Controller = Controller;


/***/ }),
/* 14 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Configuration = (function () {
	    function Configuration() {
	        this._personalSettingsEndpoint = OC.generateUrl('/apps/ocr/settings/personal');
	    }
	    Object.defineProperty(Configuration.prototype, "personalSettingsEndpoint", {
	        get: function () {
	            return this._personalSettingsEndpoint;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return Configuration;
	}());
	exports.Configuration = Configuration;


/***/ }),
/* 15 */
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
	    HttpService.prototype.getAllStatus = function () {
	        var options = {
	            method: 'GET',
	            url: this.config.personalSettingsEndpoint,
	        };
	        return this.makeRequest(options);
	    };
	    HttpService.prototype.deleteStatus = function (id) {
	        var options = {
	            data: {
	                id: id,
	            },
	            method: 'DELETE',
	            url: this.config.personalSettingsEndpoint,
	        };
	        return this.makeRequest(options);
	    };
	    return HttpService;
	}());
	exports.HttpService = HttpService;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(10);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
	    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

	  return "<table class=\"grid ocrsettings\">\n    <thead>\n        <tr>\n            <th>"
	    + alias4(((helper = (helper = helpers.tableHeadNameText || (depth0 != null ? depth0.tableHeadNameText : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"tableHeadNameText","hash":{},"data":data}) : helper)))
	    + "</th>\n            <th>"
	    + alias4(((helper = (helper = helpers.tableHeadStatusText || (depth0 != null ? depth0.tableHeadStatusText : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"tableHeadStatusText","hash":{},"data":data}) : helper)))
	    + "</th>\n            <th>"
	    + alias4(((helper = (helper = helpers.tableHeadDeleteFromQueueText || (depth0 != null ? depth0.tableHeadDeleteFromQueueText : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"tableHeadDeleteFromQueueText","hash":{},"data":data}) : helper)))
	    + "</th>\n        </tr>\n    </thead>\n    <tbody>\n"
	    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.status : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
	    + "    </tbody>\n</table>\n";
	},"2":function(container,depth0,helpers,partials,data,blockParams,depths) {
	    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

	  return "        <tr data-id=\""
	    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
	    + "\">\n            <td>"
	    + alias4(((helper = (helper = helpers.target || (depth0 != null ? depth0.target : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"target","hash":{},"data":data}) : helper)))
	    + "</td>\n            <td>"
	    + alias4(((helper = (helper = helpers.status || (depth0 != null ? depth0.status : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"status","hash":{},"data":data}) : helper)))
	    + "</td>\n            <td class=\"ocr-action-delete\">\n                <div id=\"ocr-delete\"><span>"
	    + alias4(container.lambda((depths[1] != null ? depths[1].deleteText : depths[1]), depth0))
	    + "</span><span class=\"icon icon-delete\"></span></div>\n            </td>\n        </tr>\n";
	},"4":function(container,depth0,helpers,partials,data) {
	    var helper;

	  return "<p>"
	    + container.escapeExpression(((helper = (helper = helpers.noPendingOrFailedText || (depth0 != null ? depth0.noPendingOrFailedText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"noPendingOrFailedText","hash":{},"data":data}) : helper)))
	    + "</p>\n";
	},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
	    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

	  return ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.enabled : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.program(4, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
	    + "<button id=\"ocr-search\">"
	    + container.escapeExpression(((helper = (helper = helpers.refreshButtonText || (depth0 != null ? depth0.refreshButtonText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"refreshButtonText","hash":{},"data":data}) : helper)))
	    + "</button>";
	},"useData":true,"useDepths":true});

/***/ })
/******/ ])
});
;