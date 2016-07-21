/**
 * ownCloud - ocr
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2016
 */

(function ($, OC) {

	if (!OCA.Ocr) {
		/**
		 * Namespace for the Ocr app
		 * @namespace OCA.Ocr
		 */
		OCA.Ocr = {};
	}

	/**
	 * @namespace OCA.Ocr.App
	 */
	OCA.Ocr.App = {
		/**
		 * Initialize the OCR js part
		 * get all supported tesseract languages,
		 * register the file actions and register
		 * click events.
		 */
		initialize: function(){
			this.getLanguages();
			this.registerFileAction();
			$(document).click(function(event) {
				if(!$(event.target).closest('#ocrDropdown').length) {
					if($('#ocrDropdown').length) {
						$('#ocrDropdown').detach();
					}
				}
			});
			$(document).on('click', '#processOCR', function() {
				OCA.Ocr.App.submit();
			});
		},

		/**
		 * Register all the filecations for the supported mimetypes.
		 * Actually images like png, jpeg, tiff and pdf
		 * calls createUserInterface()
		 */
		registerFileAction: function(){
			/**
			 * Register FileAction for mimetype pdf
			 */
			OCA.Files.fileActions.registerAction({
				name: 'Ocr',
				displayName: t('ocr', 'OCR'),
				order: 100,
				mime: 'application/pdf',
				permissions: OC.PERMISSION_UPDATE,
				altText: t('ocr', 'OCR_ALT'),
				iconClass: 'icon-external',
				actionHandler: function (filename, context) {
					var dir = context.dir || context.fileList.getCurrentDirectory();
					OCA.Ocr.App.createUserInterface(filename, dir);
				}
			});
			/**
			 * Register FileAction for mimetype image
			 */
			OCA.Files.fileActions.registerAction({
				name: 'Ocr',
				displayName: t('ocr', 'OCR'),
				order: 100,
				mime: 'image',
				permissions: OC.PERMISSION_UPDATE,
				altText: t('ocr', 'OCR_ALT'),
				iconClass: 'icon-external',
				actionHandler: function (filename, context) {
					var dir = context.dir || context.fileList.getCurrentDirectory();
					OCA.Ocr.App.createUserInterface(filename, dir);
				}
			});
		},

		/**
		 * Gets the installed lagnuages for tesseract
		 */
		getLanguages: function(){
			var url = OC.generateUrl('/apps/ocr/languages');
			$.ajax({
				url: url,
				method: 'GET',
				dataType: "json"
			}).done(function( data ) {
				OCA.Ocr.languages = data.languages;
			}).fail(function(){
				OCA.Ocr.languages = undefined;
			});
		},

		/**
		 * Creates the UI for each file.
		 * A dropdown for language selection
		 * and the submit button to process.
		 * @param file - the name of te file
		 * @param dir - the name of the directory
		 * @param filetype - the filetype (image or pdf)
		 */
		createUserInterface: function (file, dir){
			if ($('#ocrDropdown').length){
				$('#ocrDropdown').detach();
			}else{
				var html = '<div id="ocrDropdown" class="ocrUserInterface">';
				if (OCA.Ocr.languages !== undefined) {
					html += '<input type="hidden" id="ocrdir" value="' + dir + '" />';
					html += '<input type="hidden" id="ocrfile" value="' + file + '" />';
					html += t('ocr', 'SELECT') + ':' + '<select id="ocrLanguage">';
					var languages = OCA.Ocr.languages;
					for (var i = 0; i < languages.length; i++) {
						html += '<option value="' + languages[i] + '">' + languages[i] + '</option>';
					}
					html += '</select>';
					html += '<input type="button" id="processOCR" value="' + t('ocr', 'PROCESS') + '" />';
				}else {
					html += t('ocr', 'TESSERACT_NO_LANGUAGE');
					html += '</div>';
				}
				$(html).appendTo($('tr').filterAttr('data-file',file).find('td.filename'));
			}
		},

		/**
		 * Submit the form over GET in order
		 * to process the file with tesseract
		 * or ocrmypdf.
		 */
		submit: function(){
			var language = $('#ocrLanguage').val();
			var file = $('#ocrfile').val();
			var dir  = $('#ocrdir').val();
			var url = OC.generateUrl('/apps/ocr/process');
			var data = {
				srcFile: file,
				srcDir: dir,
				language: language
			}
			$.ajax({
				url: url,
				method: 'GET',
				dataType: "json",
				data: data,
				beforeSend: OCA.Ocr.App.processing(true), //show WIP status and disable fileactions
			}).done(function( json ) {
				if(json.success){
					OCA.Ocr.App.processing(false);
					OC.Notification.showTemporary(t('ocr', json.success.toString()) + t('ocr', 'OCR_FOR') + json.file + t('ocr', json.message), {
						timeout: 10,
						isHTML: false
					});
				}else{
					OCA.Ocr.App.processing(false);
					OC.Notification.showTemporary(t('ocr', json.success.toString()) + t('ocr', 'OCR_FOR') + json.file + t('ocr', json.message), {
						timeout: 10,
						isHTML: false
					});
				}
				// TODO: is there an alternative method which is lighter?
				OC.reload();
			}).fail(function(){
				OCA.Ocr.App.processing(false);
				$('.fileactions').show();
				OC.Notification.showTemporary(t('ocr','false') + t('ocr', 'AJAX_FAIL'));
			});
			$('#ocrDropdown').detach();
		},
		/**
		 * Processing animation and disabling other fileactions
		 * as long as the ocr process is running.
		 */
		processing: function(go){
			if (go){
				OC.Notification.showTemporary('<div id="notification-progress-fix" class="loading-small">'+t('ocr','PROCESSING')+'</div>',{timeout: 0, isHTML: true});
				$('.fileactions').hide();
			}else{
				OC.Notification.hide();
			}
		},
	}
	
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

		/**
		 * Init Ocr
		 */
		OCA.Ocr.App.initialize();
		
	});

})(jQuery, OC);