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

namespace OCA\Ocr\Service;


use OCA\Ocr\Constants\OcrConstants;
use OCP\Files\IAppData;
use OCP\Files\NotFoundException;
use OCP\Files\SimpleFS\ISimpleFile;
use OCP\ILogger;

/**
 * Class TessdataService
 *
 * @package OCA\Ocr\Service
 */
class TessdataService {
	/** @var IAppData */
	private $appData;
	/** @var ILogger */
	private $logger;

	public function __construct(IAppData $appData, ILogger $logger) {
		$this->appData = $appData;
		$this->logger = $logger;
	}

	/**
	 * Retrieves the tessdata for the given file name.
	 *
	 * @param string $file
	 * @return ISimpleFile
	 * @throws NotFoundException
	 */
	public function getAppFile(string $file): ISimpleFile {
		$folder = $this->appData->getFolder(OcrConstants::TESSDATA_FOLDER);
		if (!$folder->fileExists($file)) {
			$this->logger->warning("File with name '" . $file . "' does not exist in tessdata appdata directory.", ['app' => 'ocr']);
			throw new NotFoundException();
		}
		return $folder->getFile($file);
	}


}