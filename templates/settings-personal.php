<?php
/**
 * Nextcloud - OCR
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 * 
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */
style('ocr', [
        'ocrpersonal'
]);
script('ocr', [
        'dist/ocrpersonal'
]);
?>

<div id="ocrPersonalSettings" class="section">
	<h2 class="icon-ocr" data-anchor-name="ocr"><?php p($l->t('OCR')); ?></h2>
	<div id="ocr-settings"></div>
</div>
