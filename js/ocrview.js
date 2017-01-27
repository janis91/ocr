/**
 * nextCloud - ocr
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */
(function() {


	// Handlebarsjs template
	var TEMPLATE_OCR_DROPDOWN = '<div id="ocrDropdown" class="ocrUserInterface">'+
		'{{#if noMatches}}'+
		t('ocr', 'No languages for tesseract available')+
		'{{else}}'+
		'<select id="ocrLanguage" class="multiselect" multiple="multiple">'+
		'{{#each languages}}'+
		'<option value="{{this}}">{{this}}</option>'+
		'{{/each}}'+
		'</select>'+
		'<input type="button" id="processOCR" value="'+
		t('ocr', 'Process')+
		'" />'+
		'{{/if}}'+
		'</div>';

	var TEMPLATE_OCR_SELECTED_FILE_ACTION = '<span class="selectedActionsOCR hidden">'+
		'<a id="selectedFilesOCR" href="" class="ocr">'+
		'<span class="icon icon-external"></span>'+
		'<span>'+t('ocr', 'OCR')+'</span>'+
		'</a>'+
		'</span>';

	/**
	 * Constructor of the View object.
	 * This will update the different parts of the html.
	 * @param ocr
	 * @constructor
	 */
	var View = function (ocr) {
		this._ocr = ocr;
		this._selectedFiles = [];
		this._row = undefined;
	};

	/**
	 * Class prototype for the View. Following functions are available:
	 *
	 */
	View.prototype = {
		initialize: function () {
			this.renderSelectedActionButton();
			this.registerFileActions();
			this.registerEvents();
			this.loopForStatus();
		},
		destroy: function () {
			var self = this;
			self.destroyDropdown();
			self.destroySelectedActionButton();
			OCA.Files.fileActions.clear();
			OCA.Files.fileActions.registerDefaultActions();
		},
		registerFileActions: function () {
			var self = this;
			/**
			 * Register FileAction for mimetype pdf
			 */
			OCA.Files.fileActions.registerAction({
				name: 'Ocr',
				displayName: t('ocr', 'OCR'),
				order: 100,
				mime: 'application/pdf',
				permissions: OC.PERMISSION_UPDATE,
				altText: t('ocr', 'OCR'),
				iconClass: 'icon-external',
				actionHandler: function (filename, context) {
					var id = context.$file.attr('data-id');
					var mimetype = context.fileActions.getCurrentMimeType();
					self.renderFileAction(id, filename, mimetype);
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
				altText: t('ocr', 'OCR'),
				iconClass: 'icon-external',
				actionHandler: function (filename, context) {
					var id = context.$file.attr('data-id');
					var mimetype = context.fileActions.getCurrentMimeType();
					self.renderFileAction(id, filename, mimetype);
				}
			});
		},
		setSelectedFiles: function (selectedFiles) {
			var self = this;
			self._selectedFiles = selectedFiles;
		},
		getSelectedFiles: function () {
			var self = this;
			return self._selectedFiles;
		},
		destroySelectedActionButton: function () {
			// remove the Template
			$('.selectedActionsOCR').remove();
		},
		renderSelectedActionButton: function () {
			// append the TEMPLATE to correct position
			$(TEMPLATE_OCR_SELECTED_FILE_ACTION).appendTo($('#headerName-container'));
		},
		destroyDropdown: function () {
			if ($('#ocrDropdown').length){
				$('#ocrDropdown').detach();
			}
		},
		renderDropdown: function(){
			var self = this;
			self.destroyDropdown();
			/** global: Handlebars */
			var template = Handlebars.compile(TEMPLATE_OCR_DROPDOWN);
			var noMatches = true;
			var languages = self._ocr.getLanguages();
			if(languages.length > 0 && typeof languages !== undefined){ noMatches = false; }
			return template({languages: languages, noMatches: noMatches});
		},
		renderFileAction: function (id, file, mimetype) {
			var self = this;
			var html = self.renderDropdown();
			$(html).appendTo($('tr').filterAttr('data-file',file).find('td.filename'));
			$("#ocrLanguage").select2({
				width: 'element',
				placeholder: t('ocr', 'Select language'),
				formatNoMatches: function(){
					return t('ocr', 'No matches found.');
				}
			});
			var files = [{id: id, mimetype: mimetype}];
			self.setSelectedFiles(files);
		},
		toggleSelectedActionButton: function () {
			var self = this;
			var selectedActionButton = $('.selectedActionsOCR');
			var selFiles = OCA.Files.App.fileList.getSelectedFiles();
			if(selFiles.length > 0 && typeof selFiles !== undefined){
				//show if all have correct mimetype and type = file
				if(self._ocr.checkMimeTypes(selFiles)){
					// show if not already shown
					selectedActionButton.removeClass('hidden');
				}else{
					selectedActionButton.addClass('hidden');
				}
			}else{
				// hide if not already hidden
				selectedActionButton.addClass('hidden');
				self.setSelectedFiles([]);
			}
		},
		hideSelectedActionButton: function () {
			var self = this;
			var selectedActionButton = $('.selectedActionsOCR');
			selectedActionButton.addClass('hidden');
			self.setSelectedFiles([]);
		},
		togglePendingState: function (force, initialcount) {
			var self = this;
			var html = '';
			var pendingcount = self._ocr.getStatus().pending;
			if(force){
				html = '<span class="icon icon-loading-small ocr-row-adjustment"></span>&nbsp;<span>' + n('ocr','OCR started: %n new file in queue.', 'OCR started: %n new files in queue.', initialcount) + '</span>';
			}else{
				html = '<span class="icon icon-loading-small ocr-row-adjustment"></span>&nbsp;<span>' + ' ' + n('ocr','OCR: %n currently pending file in queue.', 'OCR: %n currently pending files in queue.', pendingcount) + '</span>';
			}
			if(pendingcount > 0 || force){
				if (self._row !== undefined) { OC.Notification.hide(self._row); }
				self._row = OC.Notification.showHtml(html);
			}else{
				if (self._row !== undefined){
					OC.Notification.hide(self._row);
					self._row = undefined;
				}
			}
		},
		updateFileList: function () {
			var self = this;
			OCA.Files.App.fileList.reload();
			self.toggleSelectedActionButton();
		},
		/**
		 * Loops as long as there are pending objects
		 */
		loopForStatus: function () {
			var self = this;
			$.when(self._ocr.checkStatus()).done(function(){
				if(self._ocr.getStatus().failed > 0) { self.notifyError(n('ocr', 'OCR processing for %n file failed. For details please go to your personal settings.', 'OCR processing for %n files failed. For details please go to your personal settings.', self._ocr.getStatus().failed)); }
				if(self._ocr.getStatus().pending > 0){
					if(self._ocr.getStatus().processed > 0) { self.updateFileList(); }
					self.togglePendingState(false);
					setTimeout($.proxy(self.loopForStatus,self), 4500);
				}else{
					if(self._ocr.getStatus().processed > 0) { self.updateFileList(); }
					self.togglePendingState(false);
				}
			}).fail(function(message){
				self.notifyError(message);
				setTimeout($.proxy(self.loopForStatus,self), 4500);
			});
		},
		notifyError: function (message) {
			/** global: OC */
			OC.Notification.showHtml('<div>'+message+'</div>', {timeout: 10, type: 'error'});
		},
		registerEvents: function(){
			var self = this;
			// Close on click on other element
			$(document).click(function(event) {
				if(!$(event.target).closest('#ocrDropdown').length) {
					self.destroyDropdown();
					self.setSelectedFiles([]);
				}
			});
			// Register submit action
			$(document).on('click', '#processOCR', function(){
				var selectedLanguages = $('#ocrLanguage').select2('val');
				$.when(self._ocr.process(self.getSelectedFiles(), selectedLanguages)).done(function(){
					self.destroyDropdown();

					// status monitoring init
					self.togglePendingState(true, self.getSelectedFiles().length);
					self.setSelectedFiles([]);
					setTimeout($.proxy(self.loopForStatus,self), 4500);
				}).fail(function(message){
					self.notifyError(t('ocr', 'OCR processing failed:')+ ' ' + message);
					self.destroyDropdown();
				});
			});
			// Register click selectedFilesAction
			$(document).on('click', '#selectedFilesOCR', function(){
				var html = self.renderDropdown();
				$(html).appendTo($('tr').find('th.column-name'));
				$("#ocrLanguage").select2({
					width: 'element',
					placeholder: t('ocr', 'Select language'),
					formatNoMatches: function(){
						return t('ocr', 'No matches found.');
					}
				});
				self.setSelectedFiles(OCA.Files.App.fileList.getSelectedFiles());
				return false;
			});
			// Register checkbox events
			/** global: _ */
			OCA.Files.App.fileList.$fileList.on('change', 'td.filename>.selectCheckBox', _.bind(self.toggleSelectedActionButton, this));
			OCA.Files.App.fileList.$el.find('.select-all').click(_.bind(self.toggleSelectedActionButton, this));
			OCA.Files.App.fileList.$el.find('.delete-selected').click(_.bind(self.hideSelectedActionButton, this));
		}
	};
	/** global: OCA */
	if (OCA.Ocr) {
		OCA.Ocr.View = View;
	}
})();