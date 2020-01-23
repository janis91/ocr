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


use Exception;
use GuzzleHttp\RequestOptions;
use OC\Archive\TAR;
use OC\IntegrityCheck\Helpers\FileAccessHelper;
use OCA\Ocr\Constants\OcrConstants;
use OCA\Ocr\Util\FetchTessdataUtil;
use OCP\Files\IAppData;
use OCP\Files\NotFoundException;
use OCP\Files\SimpleFS\ISimpleFile;
use OCP\Files\SimpleFS\ISimpleFolder;
use OCP\Http\Client\IClientService;
use OCP\ITempManager;
use OCP\Migration\IOutput;
use OCP\Migration\IRepairStep;

class FetchTessdata implements IRepairStep {

	/** @var IAppData */
	private $appData;
	/** @var ITempManager */
	private $tempManager;
	/** @var IClientService */
	private $clientService;
	/** @var FileAccessHelper */
	private $fileAccessHelper;
	/** @var FetchTessdataUtil */
	private $fetchTessdataUtil;

	public function __construct(IAppData $appData, ITempManager $tempManager, IClientService $clientService, FileAccessHelper $fileAccessHelper, FetchTessdataUtil $fetchTessdataUtil) {
		$this->appData = $appData;
		$this->tempManager = $tempManager;
		$this->clientService = $clientService;
		$this->fileAccessHelper = $fileAccessHelper;
		$this->fetchTessdataUtil = $fetchTessdataUtil;
	}

	/**
	 * @inheritDoc
	 */
	public function getName() {
		return 'Fetch tessdata for ocr.';
	}

	/**
	 * @inheritDoc
	 */
	public function run(IOutput $output) {
		$output->startProgress(5);
		$tessdataFolder = $this->getTessdataFolder();
		$traineddataFiles = array_filter($tessdataFolder->getDirectoryListing(), function (ISimpleFile $file) {
			return (strpos($file->getName(), '.traineddata') !== false);
		});
		if (!empty($traineddataFiles)) {
			$output->info("Folder tessdata already exists and at least one traineddata file already exists.");
			$output->info("Nothing to do. If tessdata is missing, delete tessdata folder in app data directory and trigger repair step or put the file there manually and trigger rescan.");
			$output->finishProgress();
			return;
		}
		try {
			$output->advance(1, 'Checked if tessdata already exists.');
			// Download
			$tempFile = $this->tempManager->getTemporaryFile('.tar.gz');
			$client = $this->clientService->newClient();
			$client->get(OcrConstants::TESSDATA_DOWNLOAD_URL, ['save_to' => $tempFile, RequestOptions::TIMEOUT => 600, RequestOptions::CONNECT_TIMEOUT => 10]);
			$output->advance(1, 'Downloaded tessdata archive.');
			// Extract and Verify
			$extractDir = $this->extract($tempFile);
			$tessdata = $this->fetchTessdataUtil->verify($extractDir);
			$output->advance(1, 'Extracted archive and verified tessdata.');
			// Moving traineddata in app data directory "tessdata"
			foreach ($tessdata as $traineddata) {
				if (!$tessdataFolder->fileExists($traineddata)) {
					$target = $tessdataFolder->newFile($traineddata);
					$traineddata = $extractDir . OcrConstants::TESSDATA_FOLDER . '/' . $traineddata;
					$target->putContent($this->fileAccessHelper->file_get_contents($traineddata));
				}
			}
			$output->advance(1, 'Moved tessdata in place.');
			$this->tempManager->clean();
			$output->finishProgress();
		} catch (Exception $e) {
			$this->tempManager->clean();
			$output->warning("Installation cannot not be completed, because an Exception was thrown.");
			throw $e;
		}
	}

	private function extract(string $tempFile): string {
		$extractDir = $this->tempManager->getTemporaryFolder();
		$archive = new TAR($tempFile);
		$this->fetchTessdataUtil->extract($archive, $extractDir);
		return $extractDir;
	}

	private function getTessdataFolder(): ISimpleFolder {
		try {
			return $this->appData->getFolder(OcrConstants::TESSDATA_FOLDER);
		} catch (NotFoundException $e) {
			return $this->appData->newFolder(OcrConstants::TESSDATA_FOLDER);
		}
	}
}
