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

		languages: undefined,

		initialize: function() {
			this.registerFileAction();
			$(this).click(function(event){
				if(
					(!
							($(event.target).hasClass('ui-corner-all'))
						&& $(event.target).parents().index($('.ui-menu'))==-1
					)
					&& (!
							($(event.target).hasClass('ocrUserInterface'))
						&& $(event.target).parents().index($('#ocrDropdown'))==-1
					)
				){
					$('#ocrDropdown').detach();
				}
			});
			
			this.getLanguages();

			$('#ocrForm').live('submit',this.submit);
		},

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
				altText: t('ocr', 'OCR_Alt'),
				iconClass: 'icon-play',
				actionHandler: function (filename, context) {
					var dir = context.dir || context.fileList.getCurrentDirectory();
					console.log('Current Directory:');
					console.log(dir);
					
					var ocrFileaction = $(context.$file).find('.fileactions .action-ocr');

					// don't allow a second click on the download action
					if(ocrFileaction.hasClass('disabled')) {
						return;
					}
					console.log('File:');
					console.log(filename);
					console.log('createUserInterface');
					OCA.Ocr.App.createUserInterface(filename, dir, 'pdf');
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
				altText: t('ocr', 'OCR_Alt'),
				iconClass: 'icon-play',
				actionHandler: function (filename, context) {
					var dir = context.dir || context.fileList.getCurrentDirectory();
					console.log('Current Directory:');
					console.log(dir);

					var ocrFileaction = $(context.$file).find('.fileactions .action-ocr');

					// don't allow a second click on the download action
					if(ocrFileaction.hasClass('disabled')) {
						return;
					}
					console.log('File:');
					console.log(filename);
					console.log('createUserInterface');
					OCA.Ocr.App.createUserInterface(filename, dir, 'image');
				}
			});
		},
		
		getLanguages: function(){
			var url = OC.generateUrl('/apps/ocr/languages');
			console.log('ajax call start');
			$.ajax({
				type: 'GET',
				url: url,
				dataType: 'json',
			}).done(function() {
				console.log('ajax call done');
				if (arguments[2] !== undefined) {
					if (arguments[2].responseJSON.status === "success") {
						OCA.Ocr.App.languages = arguments[2].responseJSON.languages;
					}
				}
			}).fail(function(){
				console.log('ajax fail');
			});
		},

		createUserInterface: function (file, dir, filetype){

			var html = '<div id="ocrDropdown" class="ocrUserInterface">';
			html += '<form action="#" id="ocrForm">';
			html += '<input type="hidden" id="dir" value="'+dir+'" />';
			html += '<input type="hidden" id="file" value="'+file+'" />';
			html += '<input type="hidden" id="filetype" value="'+filetype+'" />';
			html += t('ocr', 'Select') + ':' + '<select id="ocrLanguage">';

			if (this.languages !== undefined) {
				for (var i = 0; i < this.languages.length; i++) {
					html += '<option value="' + this.languages[i] + '">' + this.languages[i] + '</option>';
				}
			}
			html += '</select>';
			html += '<input type="submit" id="send" value="'+t('ocr','Process')+'" />';
			html += '</form></div>';

			$(html).appendTo($('tr').filterAttr('data-file',file).find('td.filename'));

		},

		submit: function(){
			var language = $('#ocrLanguage').val();
			var file = $('#file').val();
			var dir  = $('#dir').val();
			var url = OC.generateUrl('/apps/ocr/process');
			var data = {
				file: file,
				dir: dir,
				language: language,
			}
			$.post(url, data).success(function (response) {
				console.log(response);
			});

			$('#ocrDropdown').detach();

			return false;
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