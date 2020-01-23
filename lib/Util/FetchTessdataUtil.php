<?php

/**
 * Nextcloud - OCR
 * This file is licensed under the Affero General Public License version 3 or
 * later.
 * See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2020
 */

namespace OCA\Ocr\Util;


use Exception;
use OC\Archive\TAR;
use OCA\Ocr\Constants\OcrConstants;

/**
 * Class FetchTessdataUtil
 *
 * @package OCA\Ocr\Util
 */
class FetchTessdataUtil {

	/**
	 * Extracts given TAR into given extract dir.
	 *
	 * @param TAR $archive
	 * @param string $extractDir
	 * @throws Exception
	 */
	public function extract(TAR $archive, string $extractDir) {
		if (!$archive || !$archive->extract($extractDir)) {
			throw new Exception(
				sprintf(
					'Could not extract tessdata to %s',
					$extractDir
				)
			);
		}
	}

	/**
	 * Verifies, that tessdata has been correctly extracted and returns the traineddata files.
	 *
	 * @param string $extractDir
	 * @return array
	 * @throws Exception
	 */
	public function verify(string $extractDir) {
		$allFiles = scandir($extractDir);
		$folders = array_diff($allFiles, ['.', '..']);
		$folders = array_values($folders);

		if (count($folders) > 1) {
			throw new Exception('Extracted archive has more than 1 folder');
		}
		$tessdata = array_diff(scandir($extractDir . OcrConstants::TESSDATA_FOLDER), ['.', '..']);
		if (empty($tessdata)) {
			throw new Exception('No traineddata files found in the extracted archive folder.');
		}
		return $tessdata;
	}
}