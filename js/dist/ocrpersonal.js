(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("underscore"), require("jQuery"), require("handlebars/runtime"));
	else if(typeof define === 'function' && define.amd)
		define(["underscore", "jQuery", "handlebars/runtime"], factory);
	else if(typeof exports === 'object')
		exports["Ocr"] = factory(require("underscore"), require("jQuery"), require("handlebars/runtime"));
	else
		root["OCA"] = root["OCA"] || {}, root["OCA"]["Ocr"] = factory(root["_"], root["$"], root["Handlebars"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_14__) {
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
	var view_1 = __webpack_require__(15);
	var controller_1 = __webpack_require__(16);
	var configuration_1 = __webpack_require__(17);
	var http_service_1 = __webpack_require__(18);
	var handlebarsTableTemplate = __webpack_require__(19);
	var underscore_1 = __webpack_require__(4);
	var jquery_1 = __webpack_require__(5);
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
/* 4 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ }),
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_14__;

/***/ }),
/* 15 */
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
	            this.notification.showHtml("<div>" + t('ocr', 'OCR') + ": " + message + "</div>", { timeout: 10, type: 'error' });
	        }
	        else {
	            this.notification.showHtml("<div>" + t('ocr', 'OCR') + ": " + message + "</div>", { timeout: 10 });
	        }
	    };
	    View.prototype.render = function (jobs) {
	        var html = this.renderTable(jobs);
	        this.appendHtmlToElement(html, this.el);
	    };
	    View.prototype.destroy = function () {
	        this.el.innerHTML = '';
	    };
	    View.prototype.renderTable = function (jobs) {
	        var template = this.handlebarsTableTemplateFunction;
	        var enabled = jobs && jobs.length > 0 ? true : false;
	        jobs.forEach(function (job) {
	            job.replace = job.replace === '1' ? true : false;
	        });
	        return template({
	            deleteText: t('ocr', 'Delete'),
	            enabled: enabled,
	            jobs: jobs,
	            noPendingOrFailedText: t('ocr', 'No pending or failed OCR items found.'),
	            refreshButtonText: t('ocr', 'Refresh'),
	            tableHeadDeleteFromQueueText: t('ocr', 'Delete from queue'),
	            tableHeadFileText: t('ocr', 'File'),
	            tableHeadJobText: t('ocr', 'Status'),
	            tableHeadLogText: t('ocr', 'Log'),
	            tableHeadReplaceText: t('ocr', 'Replace by result'),
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
/* 16 */
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
	        this._jobs = [];
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
	        this.httpService.getAllJobs().always(function () {
	            _this.view.destroy();
	        }).done(function (jobs) {
	            _this.jobs = jobs;
	            _this.view.render(_this.jobs);
	        }).fail(function (jqXHR) {
	            _this.view.displayMessage(t('ocr', 'OCR jobs could not be retrieved:') + " " + jqXHR.responseText, true);
	            _this.jobs = [];
	            _this.view.render(_this.jobs);
	        });
	    };
	    Controller.prototype.delete = function (id) {
	        var _this = this;
	        this.httpService.deleteJob(id).done(function () {
	            _this.view.destroy();
	            var jobs = _this.jobs.filter(function (s) { return s.id === id; });
	            _this.jobs = _this.jobs.filter(function (s) {
	                return s.id !== id;
	            });
	            _this.view.displayMessage(t('ocr', 'The job for the following file object has been successfully deleted:') + " " + jobs[0].originalFilename, false);
	            _this.view.render(_this.jobs);
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
	    Object.defineProperty(Controller.prototype, "jobs", {
	        get: function () {
	            return this._jobs;
	        },
	        set: function (value) {
	            this._jobs = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return Controller;
	}());
	exports.Controller = Controller;


/***/ }),
/* 17 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Configuration = (function () {
	    function Configuration() {
	        this._jobEndpoint = OC.generateUrl('/apps/ocr');
	    }
	    Object.defineProperty(Configuration.prototype, "jobEndpoint", {
	        get: function () {
	            return this._jobEndpoint;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return Configuration;
	}());
	exports.Configuration = Configuration;


/***/ }),
/* 18 */
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
	    HttpService.prototype.getAllJobs = function () {
	        var options = {
	            method: 'GET',
	            url: this.config.jobEndpoint,
	        };
	        return this.makeRequest(options);
	    };
	    HttpService.prototype.deleteJob = function (id) {
	        var options = {
	            data: {
	                id: id,
	            },
	            method: 'DELETE',
	            url: this.config.jobEndpoint,
	        };
	        return this.makeRequest(options);
	    };
	    return HttpService;
	}());
	exports.HttpService = HttpService;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(14);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
	    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

	  return "<table class=\"grid ocrsettings\">\n    <thead>\n        <tr>\n            <th>"
	    + alias4(((helper = (helper = helpers.tableHeadFileText || (depth0 != null ? depth0.tableHeadFileText : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"tableHeadFileText","hash":{},"data":data}) : helper)))
	    + "</th>\n            <th>"
	    + alias4(((helper = (helper = helpers.tableHeadJobText || (depth0 != null ? depth0.tableHeadJobText : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"tableHeadJobText","hash":{},"data":data}) : helper)))
	    + "</th>\n            <th>"
	    + alias4(((helper = (helper = helpers.tableHeadLogText || (depth0 != null ? depth0.tableHeadLogText : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"tableHeadLogText","hash":{},"data":data}) : helper)))
	    + "</th>\n            <th>"
	    + alias4(((helper = (helper = helpers.tableHeadReplaceText || (depth0 != null ? depth0.tableHeadReplaceText : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"tableHeadReplaceText","hash":{},"data":data}) : helper)))
	    + "</th>\n            <th>"
	    + alias4(((helper = (helper = helpers.tableHeadDeleteFromQueueText || (depth0 != null ? depth0.tableHeadDeleteFromQueueText : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"tableHeadDeleteFromQueueText","hash":{},"data":data}) : helper)))
	    + "</th>\n        </tr>\n    </thead>\n    <tbody>\n"
	    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.jobs : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
	    + "    </tbody>\n</table>\n";
	},"2":function(container,depth0,helpers,partials,data,blockParams,depths) {
	    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

	  return "        <tr data-id=\""
	    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
	    + "\">\n            <td>"
	    + alias4(((helper = (helper = helpers.originalFilename || (depth0 != null ? depth0.originalFilename : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"originalFilename","hash":{},"data":data}) : helper)))
	    + "</td>\n            <td>"
	    + alias4(((helper = (helper = helpers.status || (depth0 != null ? depth0.status : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"status","hash":{},"data":data}) : helper)))
	    + "</td>\n            <td>"
	    + alias4(((helper = (helper = helpers.errorLog || (depth0 != null ? depth0.errorLog : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"errorLog","hash":{},"data":data}) : helper)))
	    + "</td>\n            <td><span class=\"icon icon-"
	    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.replace : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.program(5, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
	    + "\"></span></td>\n            <td class=\"ocr-action-delete\">\n                <div id=\"ocr-delete\"><span>"
	    + alias4(container.lambda((depths[1] != null ? depths[1].deleteText : depths[1]), depth0))
	    + "</span><span class=\"icon icon-delete\"></span></div>\n            </td>\n        </tr>\n";
	},"3":function(container,depth0,helpers,partials,data) {
	    return "checkmark";
	},"5":function(container,depth0,helpers,partials,data) {
	    return "close";
	},"7":function(container,depth0,helpers,partials,data) {
	    var helper;

	  return "<p>"
	    + container.escapeExpression(((helper = (helper = helpers.noPendingOrFailedText || (depth0 != null ? depth0.noPendingOrFailedText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"noPendingOrFailedText","hash":{},"data":data}) : helper)))
	    + "</p>\n";
	},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
	    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

	  return ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.enabled : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.program(7, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
	    + "<button id=\"ocr-search\">"
	    + container.escapeExpression(((helper = (helper = helpers.refreshButtonText || (depth0 != null ? depth0.refreshButtonText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"refreshButtonText","hash":{},"data":data}) : helper)))
	    + "</button>";
	},"useData":true,"useDepths":true});

/***/ })
/******/ ])
});
;