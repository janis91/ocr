/**
 * nextCloud - ocr
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */

(function (OC) {
    'use strict';

    OC.Settings = OC.Settings || {};
    OC.Settings.Ocr = OC.Settings.Ocr || {};

    $(function () {
        var view = new OC.Settings.Ocr.View({
            el: $('#ocr-settings')
        });
        view.render();
    });
})(OC);