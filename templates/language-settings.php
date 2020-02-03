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
script(OcrConstants::APP_NAME, "chunk-common");
script(OcrConstants::APP_NAME, "chunk-settings-vendors");
script(OcrConstants::APP_NAME, "settings");
style(OcrConstants::APP_NAME, "chunk-common");
style(OcrConstants::APP_NAME, "chunk-settings-vendors");
style(OcrConstants::APP_NAME, "settings");
?>
<div id="language-settings" class="section">
	<h2><?php p($l->t('Favorite languages')) ?></h2>
	<div id="ocr-view"></div>
</div>
