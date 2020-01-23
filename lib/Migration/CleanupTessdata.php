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

namespace OCA\Ocr\Migration;


use OCA\Ocr\Constants\OcrConstants;
use OCP\Files\IAppData;
use OCP\Files\NotFoundException;
use OCP\Files\NotPermittedException;
use OCP\Migration\IOutput;
use OCP\Migration\IRepairStep;

class CleanupTessdata implements IRepairStep {

	/**
	 * @var IAppData
	 */
	private $appData;

	public function __construct(IAppData $appData) {
		$this->appData = $appData;
	}

	/**
	 * @inheritDoc
	 */
	public function getName() {
		return "Cleanup ocr app data folder.";
	}

	/**
	 * @inheritDoc
	 */
	public function run(IOutput $output) {
		$output->startProgress(1);
		try {
			$this->appData->getFolder(OcrConstants::TESSDATA_FOLDER)->delete();
			$output->advance("Deleted tessdata folder.");
		} catch (NotFoundException | NotPermittedException $e) {
			$output->warning("Tessdata folder could not be deleted.");
		}
		$output->finishProgress();
	}
}