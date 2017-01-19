/**
 * nextCloud - ocr
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */

/* global Backbone, Handlebars */
(function (OC, Backbone, Handlebars, $) {
    'use strict';

    OC.Settings = OC.Settings || {};
    OC.Settings.Ocr = OC.Settings.Ocr || {};

    var TEMPLATE = '{{#if enabled}}'
        + '         <table class="grid ocrsettings">'
        + '             <thead>'
        + '                 <tr>'
        + '                     <th>' + t('ocr', 'Name') + '</th>'
        + '                     <th>' + t('ocr', 'Status') + '</th>'
        + '                     <th>' + t('ocr', 'Delete from queue') + '</th>'
        + '                 </tr>'
        + '             </thead>'
        + '             <tbody>'
        + '                 {{#each status}}'
        + '                     <tr data-id="{{ id }}">'
        + '                         <td>{{ target }}</td>'
        + '                         <td>{{ status }}</td>'
        + '                         <td class="ocr-action-delete"><div id="ocr-delete"><span>' + t('ocr', 'Delete') + '</span><span class="icon icon-delete"></span></div></td>'
        + '                     </tr>'
        + '                 {{/each}}'
        + '             </tbody>'
        + '         </table>'
        + '     {{else}}'
        + '         <p>' + t('ocr' , 'No pending or failed OCR items found.') +'</p>'
        + '     {{/if}}'
        + '<button id="ocr-search">' + t('ocr', 'Refresh') + '</button>';

    var View;
    View = Backbone.View.extend({
        template: Handlebars.compile(TEMPLATE),
        _loading: undefined,
        _enabled: undefined,
        events: {
            'click #ocr-search': '_load',
            'click #ocr-delete': '_delete'
        },
        initialize: function () {
            this._load();
        },
        render: function (data) {
            this.$el.html(this.template(data));
        },
        _load: function () {
            if (this._loading) {
                //ignore when loading
                return;
            }
            this._loading = true;

            var url = OC.generateUrl('/apps/ocr/settings/personal');
            var loading = $.ajax(url, {
                method: 'GET'
            });

            var _this = this;
            $.when(loading).done(function (status) {
                if (status.length > 0) {
                    _this._enabled = true;
                    _this._showTable(status);
                } else {
                    _this._enabled = false;
                    _this._showTable();
                }
            });
            $.when(loading).always(function () {
                _this._loading = false;
            });
        },
        _delete: function(e) {
            if (this._loading) {
                //ignore when loading
                return;
            }
            this._loading = true;
            var _this = this;
            var url = OC.generateUrl('/apps/ocr/settings/personal');
            var deleting = $.ajax(url, {
                method: 'DELETE',
                data: {
                    id: $(e.target).closest('tr').data('id')
                }
            });

            $.when(deleting).done(function(data) {
                _this._showMsg(t('ocr', 'Following file has been successfully deleted from the queue:') + ' "' + data.target + '"');
                _this._loading = false;
                _this._load();
            });

            $.when(deleting).fail(function(jqXHR) {
                _this._showMsg(t('ocr', 'Error during deletion: ') + jqXHR.responseText);
                _this._loading = false;
            });

        },
        _showTable: function(data) {
            var _this = this;
            this.render({
                enabled: _this._enabled,
                status: data
            });
        },
        _showMsg: function (msg) {
            $('#ocr-msg').text(msg);
            setTimeout(function() { $('#ocr-msg').text(''); }, 5000);
        }
    });

    OC.Settings.Ocr.View = View;

})(OC, Backbone, Handlebars, $);