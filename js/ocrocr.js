/**
 * nextCloud - ocr
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2016
 */
(function() {

	var OCR_ALLOWED_MIMETYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/tiff'];

	/**
	 * Constructor of the ocr object.
	 * This object holds all our ocr stuff.
	 * processing state, available languages, etc.
	 * @param baseUrl
	 * @constructor
	 */
	var Ocr = function (baseUrl) {
		this._baseUrl = baseUrl;
		this._languages = [];
		this._status = [];
	};

	/**
	 * Class prototype for Ocr. Following functions are available:
	 */
	Ocr.prototype = {
		getLanguages: function () {
			var self = this;
			return self._languages;
		},
		getStatus: function () {
			var self = this;
			return self._status;
		},
		/**
		 * AJAX call.
		 * Loads all available languages.
		 * @returns $.Deferred()
		 */
		loadAllLanguages: function () {
			var deferred = $.Deferred();
			var self = this;
			$.get(self._baseUrl).done(function (languages) {
				self._languages = languages;
				deferred.resolve(languages);
			}).fail(function (jqXHR) {
				deferred.reject(jqXHR.responseText);
			});
			return deferred.promise();
		},
		process: function(selectedFiles, selectedLanguage){
			var self = this;
			var deferred = $.Deferred();
			if(self.checkMimeTypes(selectedFiles)){
				var data = {language: selectedLanguage, files: selectedFiles};
				$.ajax({
					url: self._baseUrl,
					method: 'POST',
					contentType: 'application/json',
					data: JSON.stringify(data)
				}).done(function () {
					deferred.resolve();
				}).fail(function (jqXHR) {
					deferred.reject(jqXHR.responseText);
				});
			}else{
				deferred.reject('Files have wrong mimetypes.');
			}
			return deferred.promise();
		},
		checkStatus: function () {
			var deferred = $.Deferred();
			var self = this;
			/** global: OC */
			$.get(OC.generateUrl('/apps/ocr/status')).done(function (status) {
				self._status = status;
				deferred.resolve(status);
			}).fail(function (jqXHR) {
				deferred.reject(jqXHR.responseText);
			});
			return deferred.promise();
		},
		checkMimeTypes: function (selectedFiles) {
			var correct = true;
			selectedFiles.forEach(function(file){
				if(file.type != 'file' || $.inArray(file.mimetype, OCR_ALLOWED_MIMETYPES) == -1){
					correct = false;
				}
			});
			return correct;
		},
		initialize: function () {
			var self = this;
			var deferred = $.Deferred();
			self.loadAllLanguages().done(function(){
				deferred.resolve();
			}).fail(function(message){
				deferred.reject(message);
			});
			return deferred.promise();
		}
	};
	/** global: OCA */
	if (OCA.Ocr) {
		OCA.Ocr.Ocr = Ocr;
	}
})();