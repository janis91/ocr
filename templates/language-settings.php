<?php

use OCA\Ocr\Constants\OcrConstants;

/**
 * Nextcloud - OCR
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 * 
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2019
 */
vendor_script(OcrConstants::APP_NAME, 'choices.js/choices.min');
vendor_style(OcrConstants::APP_NAME, 'choices.js/choices.min');
script(OcrConstants::APP_NAME, "settings");
style(OcrConstants::APP_NAME, "settings");
?>
<div id="language-settings" class="section">
    <h2><?php p($l->t('Favorite languages')) ?></h2>
    <div id="ocrProgressWrapper" class="ocr-progress-wrapper">
        <div class="icon-loading ocr-loading"></div>
    </div>
</div>