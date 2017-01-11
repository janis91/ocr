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

    var TEMPLATE = '<button id="ocr-search">' + t('ocr', 'Refresh') + '</button>'
        + '     {{#if enabled}}'
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
        + '                         <td>{{ newName }}</td>'
        + '                         <td>{{ status }}</td>'
        + '                         <td><div id="ocr-delete" class="ocr-action-delete"><span>' + t('ocr', 'Delete') + '</span><span class="icon icon-delete"></span></div></td>'
        + '                     </tr>'
        + '                 {{/each}}'
        + '             </tbody>'
        + '         </table>'
        + '     {{else}}'
        + '         <p>' + t('ocr' , 'No pending or failed OCR items found...') +'</p>'
        + '     {{/if}}';

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
            this._loading = true;

            var url = OC.generateUrl('/apps/ocr/settings/personal');
            var loading = $.ajax(url, {
                method: 'GET',
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
        _delete: function() {
            if (this._loading) {
                //ignore when loading
                return;
            }
            var _this = this;
            console.log('delete');
            _this._load();
        },
        _showTable: function(data) {
            var _this = this;
            this.render({
                enabled: _this._enabled,
                status: data
            });
        }
    });

    OC.Settings.Ocr.View = View;

})(OC, Backbone, Handlebars, $);