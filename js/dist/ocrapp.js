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
	var util_1 = __webpack_require__(1);
	var http_service_1 = __webpack_require__(2);
	var oca_service_1 = __webpack_require__(3);
	var controller_1 = __webpack_require__(6);
	var view_1 = __webpack_require__(7);
	var configuration_1 = __webpack_require__(8);
	var handlebarsDropdownTemplate = __webpack_require__(9);
	var underscore_1 = __webpack_require__(5);
	var jquery_1 = __webpack_require__(11);
	var App = (function () {
	    function App() {
	        var _this = this;
	        _.delay(function () {
	            _this.config = new configuration_1.Configuration();
	            _this.util = new util_1.Util(_this.config);
	            _this.view = new view_1.View(OC.Notification, handlebarsDropdownTemplate, t, n, $, document);
	            _this.httpService = new http_service_1.HttpService(_this.util, _this.config, $);
	            _this.ocaService = new oca_service_1.OcaService(t, n, OC);
	            _this.controller = new controller_1.Controller(_this.util, _this.view, _this.httpService, _this.ocaService, t, n, document, $);
	            try {
	                _this.controller.init();
	            }
	            catch (e) {
	                console.error(e);
	                _this.view.displayError(e.message);
	            }
	        }, 1000);
	    }
	    return App;
	}());
	exports.App = App;
	exports.$app = new App();


/***/ }),
/* 1 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Util = (function () {
	    function Util(config) {
	        this.config = config;
	    }
	    Util.prototype.filterFilesWithMimeTypes = function (files) {
	        var _this = this;
	        if (files === undefined) {
	            return [];
	        }
	        return files.filter(function (file) {
	            return _this.config.allowedMimetypes.indexOf(file.mimetype) === -1 ? false : true;
	        });
	    };
	    Util.prototype.shrinkFilesToReducedFiles = function (files) {
	        return files.map(function (file) {
	            return { id: file.id };
	        });
	    };
	    return Util;
	}());
	exports.Util = Util;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var HttpService = (function () {
	    function HttpService(util, config, jquery) {
	        this.util = util;
	        this.config = config;
	        this.jquery = jquery;
	    }
	    HttpService.prototype.makeRequest = function (opts) {
	        return this.jquery.ajax(opts);
	    };
	    HttpService.prototype.process = function (files, languages) {
	        var reducedFiles = this.util.shrinkFilesToReducedFiles(files);
	        var options = {
	            data: {
	                files: reducedFiles,
	                languages: languages,
	            },
	            method: 'POST',
	            url: this.config.processingEndpoint,
	        };
	        return this.makeRequest(options);
	    };
	    HttpService.prototype.checkStatus = function () {
	        var options = {
	            method: 'GET',
	            url: this.config.statusEndpoint,
	        };
	        return this.makeRequest(options);
	    };
	    HttpService.prototype.loadAvailableLanguages = function () {
	        var options = {
	            method: 'GET',
	            url: this.config.processingEndpoint,
	        };
	        return this.makeRequest(options);
	    };
	    return HttpService;
	}());
	exports.HttpService = HttpService;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var file_poto_1 = __webpack_require__(4);
	var underscore_1 = __webpack_require__(5);
	var OcaService = (function () {
	    function OcaService(t, n, OC) {
	        this.t = t;
	        this.n = n;
	        this.OC = OC;
	    }
	    OcaService.prototype.destroy = function () {
	        OCA.Files.fileActions.clear();
	        OCA.Files.fileActions.registerDefaultActions();
	    };
	    OcaService.prototype.registerCheckBoxEvents = function (instance) {
	        OCA.Files.App.fileList.$fileList.on('change', 'td.filename>.selectCheckBox', _.bind(instance.toggleSelectedFilesActionButton, instance));
	        OCA.Files.App.fileList.$el.find('.select-all').click(_.bind(instance.toggleSelectedFilesActionButton, instance));
	        OCA.Files.App.fileList.$el.find('.delete-selected').click(_.bind(instance.hideSelectedFilesActionButton, instance));
	    };
	    OcaService.prototype.getSelectedFiles = function () {
	        return OCA.Files.App.fileList.getSelectedFiles();
	    };
	    OcaService.prototype.reloadFilelist = function () {
	        OCA.Files.App.fileList.reload();
	    };
	    OcaService.prototype.registerFileActions = function () {
	        OCA.Files.fileActions.registerAction({
	            actionHandler: this.fileActionHandler,
	            altText: t('ocr', 'OCR'),
	            displayName: t('ocr', 'OCR'),
	            iconClass: 'icon-ocr',
	            mime: 'application/pdf',
	            name: 'Ocr',
	            order: 100,
	            permissions: this.OC.PERMISSION_UPDATE,
	        });
	        OCA.Files.fileActions.registerAction({
	            actionHandler: this.fileActionHandler,
	            altText: t('ocr', 'OCR'),
	            displayName: t('ocr', 'OCR'),
	            iconClass: 'icon-ocr',
	            mime: 'image',
	            name: 'Ocr',
	            order: 100,
	            permissions: this.OC.PERMISSION_UPDATE,
	        });
	    };
	    OcaService.prototype.fileActionHandler = function (ocaFilesFileName, context) {
	        var file = new file_poto_1.File();
	        file.id = context.$file.attr('data-id');
	        file.mimetype = context.fileActions.getCurrentMimeType();
	        var files = new Array();
	        files.push(file);
	        OCA.Ocr.$app.controller.selectedFiles = files;
	        OCA.Ocr.$app.view.renderFileAction(ocaFilesFileName, OCA.Ocr.$app.controller.availableLanguages);
	    };
	    return OcaService;
	}());
	exports.OcaService = OcaService;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var File = (function () {
	    function File() {
	    }
	    Object.defineProperty(File.prototype, "id", {
	        get: function () {
	            return this._id;
	        },
	        set: function (value) {
	            this._id = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(File.prototype, "mimetype", {
	        get: function () {
	            return this._mimetype;
	        },
	        set: function (value) {
	            this._mimetype = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return File;
	}());
	exports.File = File;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Controller = (function () {
	    function Controller(util, view, httpService, ocaService, t, n, document, jquery) {
	        this.util = util;
	        this.view = view;
	        this.httpService = httpService;
	        this.ocaService = ocaService;
	        this.t = t;
	        this.n = n;
	        this.document = document;
	        this.jquery = jquery;
	    }
	    Controller.prototype.init = function () {
	        this.loadLanguages();
	        this.registerEvents();
	        this.view.renderSelectedFilesActionButton();
	        this.loopForStatus();
	    };
	    Controller.prototype.destroy = function () {
	        this.view.destroy();
	        this.ocaService.destroy();
	    };
	    Controller.prototype.registerEvents = function () {
	        var _this = this;
	        this.document.addEventListener('click', function (event) {
	            _this.clickOnOtherEvent(event);
	        });
	        this.document.addEventListener('click', function (event) {
	            if (event.target.id === 'processOCR') {
	                _this.clickOnProcessButtonEvent();
	                event.preventDefault();
	                event.stopImmediatePropagation();
	            }
	        });
	        this.document.addEventListener('click', function (event) {
	            if (event.target.id === 'selectedFilesOCR' || event.target.parentNode.id === 'selectedFilesOCR') {
	                _this.clickOnTopBarSelectedFilesActionButton();
	                event.preventDefault();
	                event.stopImmediatePropagation();
	            }
	        });
	        this.ocaService.registerFileActions();
	        this.ocaService.registerCheckBoxEvents(this);
	    };
	    Controller.prototype.clickOnOtherEvent = function (event) {
	        if (this.view.checkClickOther(event)) {
	            this.selectedFiles = [];
	        }
	    };
	    Controller.prototype.clickOnProcessButtonEvent = function () {
	        var _this = this;
	        if (this.selectedFiles.length === 0) {
	            this.view.displayError(t('ocr', 'OCR processing failed:') + " " + t('ocr', 'No file(s) selected.'));
	            this.view.destroyDropdown();
	            return;
	        }
	        var filteredFiles = this.util.filterFilesWithMimeTypes(this.selectedFiles);
	        if (filteredFiles.length === 0) {
	            this.view.displayError(t('ocr', 'OCR processing failed:') + " " + t('ocr', 'MIME type(s) not supported.'));
	            this.view.destroyDropdown();
	            return;
	        }
	        else {
	            var selectedLanguages = this.view.getSelectTwoValues();
	            this.httpService.process(filteredFiles, selectedLanguages).done(function () {
	                _this.togglePendingState(true, filteredFiles.length);
	                _this.selectedFiles = [];
	                setTimeout(_this.jquery.proxy(_this.loopForStatus, _this), 4500);
	            }).fail(function (jqXHR) {
	                _this.view.displayError(t('ocr', 'OCR processing failed:') + " " + jqXHR.responseText);
	            }).always(function () {
	                _this.view.destroyDropdown();
	            });
	        }
	    };
	    Controller.prototype.clickOnTopBarSelectedFilesActionButton = function () {
	        this.view.renderFileAction(undefined, this.availableLanguages);
	        this.selectedFiles = this.ocaService.getSelectedFiles();
	    };
	    Controller.prototype.toggleSelectedFilesActionButton = function () {
	        var selFiles = this.util.filterFilesWithMimeTypes(this.ocaService.getSelectedFiles());
	        if (selFiles.length > 0) {
	            this.view.toggleSelectedFilesActionButton(true);
	            this.selectedFiles = selFiles;
	        }
	        else {
	            this.view.toggleSelectedFilesActionButton(false);
	            this.selectedFiles = [];
	        }
	    };
	    Controller.prototype.loopForStatus = function () {
	        var _this = this;
	        this.jquery.when(this.checkStatus()).done(function () {
	            if (_this.status.failed > 0) {
	                _this.view.displayError(n('ocr', 'OCR processing for %n file failed. For details please go to your personal settings.', 'OCR processing for %n files failed. For details please go to your personal settings.', _this.status.failed));
	            }
	            if (_this.status.pending > 0) {
	                if (_this.status.processed > 0) {
	                    _this.updateFileList();
	                }
	                _this.togglePendingState(false);
	                setTimeout(_this.jquery.proxy(_this.loopForStatus, _this), 4500);
	            }
	            else {
	                if (_this.status.processed > 0) {
	                    _this.updateFileList();
	                }
	                _this.togglePendingState(false);
	            }
	        }).fail(function (message) {
	            _this.view.displayError(t('ocr', 'OCR status could not be retrieved:') + " " + message);
	            setTimeout(_this.jquery.proxy(_this.loopForStatus, self), 4500);
	        });
	    };
	    Controller.prototype.updateFileList = function () {
	        this.ocaService.reloadFilelist();
	        this.toggleSelectedFilesActionButton();
	    };
	    Controller.prototype.togglePendingState = function (force, initialcount) {
	        this.view.togglePendingNotification(force, initialcount !== undefined ? initialcount : this.status.pending);
	    };
	    Controller.prototype.hideSelectedFilesActionButton = function () {
	        this.view.toggleSelectedFilesActionButton(false);
	        this.selectedFiles = [];
	    };
	    Controller.prototype.checkStatus = function () {
	        var _this = this;
	        var deferred = this.jquery.Deferred();
	        this.httpService.checkStatus().done(function (status) {
	            _this.status = status;
	            deferred.resolve(status);
	        }).fail(function (jqXHR) {
	            deferred.reject(jqXHR.responseText);
	        });
	        return deferred.promise();
	    };
	    Controller.prototype.loadLanguages = function () {
	        var _this = this;
	        this.httpService.loadAvailableLanguages().done(function (languages) {
	            if (languages.length === 0) {
	                throw new Error(t('ocr', 'No languages available for OCR processing. Please make sure to setup tesseract and OCRmyPDF correctly.'));
	            }
	            _this.availableLanguages = languages;
	        }).fail(function (jqXHR) {
	            _this.view.displayError(t('ocr', 'Available languages could not be retrieved:') + " " + jqXHR.responseText);
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
	    Object.defineProperty(Controller.prototype, "availableLanguages", {
	        get: function () {
	            return this._availableLanguages;
	        },
	        set: function (value) {
	            this._availableLanguages = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Controller.prototype, "selectedFiles", {
	        get: function () {
	            return this._selectedFiles;
	        },
	        set: function (value) {
	            this._selectedFiles = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return Controller;
	}());
	exports.Controller = Controller;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var View = (function () {
	    function View(notification, ocrDropdownTemplateFunction, t, n, jquery, document) {
	        this.notification = notification;
	        this.ocrDropdownTemplateFunction = ocrDropdownTemplateFunction;
	        this.t = t;
	        this.n = n;
	        this.jquery = jquery;
	        this.document = document;
	        this._templateOCRSelectedFileAction = "\n    <span id=\"selectedActionsOCRId\" class=\"selectedActionsOCR hidden\">\n        <a id=\"selectedFilesOCR\" href=\"\" class=\"ocr\">\n            <span class=\"icon icon-ocr\"></span>\n            <span class=\"pad-for-icon\">" + t('ocr', 'OCR') + "</span>\n        </a>\n    </span>";
	        this._notificationRow = undefined;
	    }
	    View.prototype.displayError = function (message) {
	        this.notification.showHtml("<div>" + message + "</div>", { timeout: 10, type: 'error' });
	    };
	    View.prototype.renderDropdown = function (languages) {
	        this.destroyDropdown();
	        var template = this.ocrDropdownTemplateFunction;
	        return template({ languages: languages, buttonText: t('ocr', 'Process') });
	    };
	    View.prototype.destroyDropdown = function () {
	        var dropdown = this.document.getElementById('ocrDropdown');
	        if (dropdown) {
	            this.removeElement(dropdown);
	        }
	    };
	    View.prototype.togglePendingNotification = function (force, count) {
	        var html;
	        if (force) {
	            html = "<span class=\"icon icon-loading-small ocr-row-adjustment\"></span>&nbsp;<span> " + n('ocr', 'OCR started: %n new file in queue.', 'OCR started: %n new files in queue.', count) + "</span>";
	        }
	        else {
	            html = "<span class=\"icon icon-loading-small ocr-row-adjustment\"></span>&nbsp;<span> " + n('ocr', 'OCR: %n currently pending file in queue.', 'OCR: %n currently pending files in queue.', count) + "</span>";
	        }
	        if (count > 0 || force) {
	            if (this.notificationRow !== undefined) {
	                this.notification.hide(this.notificationRow);
	            }
	            this.notificationRow = this.notification.showHtml(html);
	        }
	        else {
	            if (this.notificationRow !== undefined) {
	                this.notification.hide(this.notificationRow);
	                this.notificationRow = undefined;
	            }
	        }
	    };
	    View.prototype.toggleSelectedFilesActionButton = function (show) {
	        var selectedActionsOCR = this.document.getElementById('selectedActionsOCRId');
	        if (show) {
	            this.removeClass(selectedActionsOCR, 'hidden');
	        }
	        else {
	            this.addClass(selectedActionsOCR, 'hidden');
	        }
	    };
	    View.prototype.renderFileAction = function (fileName, languages) {
	        var html = this.renderDropdown(languages);
	        if (fileName !== undefined) {
	            var trs = [].slice.call(this.document.querySelectorAll('tr'));
	            var tr = trs.filter(function (element) {
	                return element.getAttribute('data-file') === fileName;
	            });
	            var tds = tr[0].querySelectorAll('td.filename');
	            this.appendHtmlToElement(html, tds);
	        }
	        else {
	            this.appendHtmlToElement(html, this.document.querySelectorAll('tr th.column-name'));
	        }
	        this.renderSelectTwo();
	    };
	    View.prototype.checkClickOther = function (event) {
	        if (!event.target.closest('#ocrDropdown')) {
	            this.destroyDropdown();
	            return true;
	        }
	        else {
	            return false;
	        }
	    };
	    View.prototype.renderSelectedFilesActionButton = function () {
	        this.appendHtmlToElement(this.templateOCRSelectedFileAction, this.document.getElementById('headerName-container'));
	    };
	    View.prototype.destroy = function () {
	        this.destroySelectedFilesActionButton();
	        this.destroyDropdown();
	    };
	    View.prototype.destroySelectedFilesActionButton = function () {
	        this.removeElement(this.document.getElementById('selectedActionsOCRId'));
	    };
	    View.prototype.getSelectTwoValues = function () {
	        return this.jquery('#ocrLanguage').select2('val');
	    };
	    View.prototype.renderSelectTwo = function () {
	        var _this = this;
	        this.jquery('#ocrLanguage').select2({
	            formatNoMatches: function () {
	                return t('ocr', 'No matches found.');
	            },
	            placeholder: t('ocr', 'Select language'),
	            width: 'element',
	        });
	    };
	    View.prototype.appendHtmlToElement = function (html, el) {
	        this.jquery(html).appendTo(el);
	    };
	    View.prototype.removeClass = function (el, className) {
	        if (el.classList) {
	            el.classList.remove(className);
	        }
	        else {
	            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
	        }
	    };
	    View.prototype.addClass = function (el, className) {
	        if (el.classList) {
	            el.classList.add(className);
	        }
	        else {
	            el.className += ' ' + className;
	        }
	    };
	    View.prototype.removeElement = function (el) {
	        el.parentNode.removeChild(el);
	    };
	    Object.defineProperty(View.prototype, "notificationRow", {
	        get: function () {
	            return this._notificationRow;
	        },
	        set: function (value) {
	            this._notificationRow = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(View.prototype, "templateOCRSelectedFileAction", {
	        get: function () {
	            return this._templateOCRSelectedFileAction;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return View;
	}());
	exports.View = View;


/***/ }),
/* 8 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Configuration = (function () {
	    function Configuration() {
	        this._statusEndpoint = OC.generateUrl('/apps/ocr/status');
	        this._processingEndpoint = OC.generateUrl('/apps/ocr');
	        this._allowedMimetypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/tiff', 'image/jp2', 'image/jpm', 'image/jpx', 'image/webp', 'image/gif'];
	    }
	    Object.defineProperty(Configuration.prototype, "statusEndpoint", {
	        get: function () {
	            return this._statusEndpoint;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Configuration.prototype, "processingEndpoint", {
	        get: function () {
	            return this._processingEndpoint;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Configuration.prototype, "allowedMimetypes", {
	        get: function () {
	            return this._allowedMimetypes;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return Configuration;
	}());
	exports.Configuration = Configuration;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(10);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"1":function(container,depth0,helpers,partials,data) {
	    var alias1=container.lambda, alias2=container.escapeExpression;

	  return "                <option value=\""
	    + alias2(alias1(depth0, depth0))
	    + "\">"
	    + alias2(alias1(depth0, depth0))
	    + "</option>\n";
	},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
	    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

	  return "<div id=\"ocrDropdown\" class=\"ocrUserInterface\">\n    <select id=\"ocrLanguage\" class=\"multiselect\" multiple=\"multiple\">\n"
	    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.languages : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
	    + "        </select>\n    <input type=\"button\" id=\"processOCR\" class=\"processOCRButton\" value=\""
	    + container.escapeExpression(((helper = (helper = helpers.buttonText || (depth0 != null ? depth0.buttonText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"buttonText","hash":{},"data":data}) : helper)))
	    + "\" />\n</div>";
	},"useData":true});

/***/ }),
/* 10 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_10__;

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_11__;

/***/ })
/******/ ])
});
;
