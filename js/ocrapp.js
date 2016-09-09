/**
 * nextCloud - ocr
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2016
 */
(function (OC, window, $, undefined) {
	'use strict';
	/** global: OCA */
	if (!OCA.Ocr) {
		/**
		 * @namespace
		 * global: OCA
		 */
		OCA.Ocr = {};
	}
	/**
	 * OCA.Ocr.App
	 * Integrates all necessary objects to build the app.
	 * @type {{initialize: OCA.Ocr.App.initialize}}
	 * global: OCA
	 */
	OCA.Ocr.App = {
		/**
		 * Initialize function. Gets all things together.
		 */
		initialize: function () {
			var self = this;
			//Create the OCR object
			/** global: OC, OCA */
			this._ocr = new OCA.Ocr.Ocr(OC.generateUrl('/apps/ocr'));
			// Create the View Object
			/** global: OCA */
			this._view = new OCA.Ocr.View(this._ocr);
			self._ocr.initialize().done(function(){
				self._view.initialize();
			}).fail(function (message) {
				self._view.notifyError('OCR App could not be initialized: ' + message);
			});
		},
		/**
		 * Destroy function. Deregisters everthing and destroys the Ocr app.
		 */
		destroy: function () {
			var self = this;
			this._view.destroy();
		}
	};
/**
 * Init the App
 */
$(document).ready(function () {
	/**
	 *  We have to be in the Files App!
	 */
	if(!OCA.Files){ // we don't have the files app, so ignore anything
		return;
	}
	if(/(public)\.php/i.exec(window.location.href)!=null){
		return; // escape when the requested file is public.php
	}
	/** global: OCA */
	OCA.Ocr.App.initialize();
});
/** global: OC */
})(OC, window, jQuery);