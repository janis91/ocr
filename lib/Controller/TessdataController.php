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
namespace OCA\Ocr\Controller;


use OCA\Ocr\Service\TessdataService;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\FileDisplayResponse;
use OCP\AppFramework\Http\NotFoundResponse;
use OCP\AppFramework\Http\Response;
use OCP\Files\NotFoundException;
use OCP\IRequest;

/**
 * Class TessdataController
 *
 * @package OCA\Ocr\Controller
 */
class TessdataController extends Controller {

	/** @var TessdataService */
	private $tessdataService;

	public function __construct($appName, IRequest $request, TessdataService $tessdataService) {
		parent::__construct($appName, $request);
		$this->tessdataService = $tessdataService;
	}

	/**
	 * @NoCSRFRequired
	 *
	 * Sends the requested tessdata from the app data dir.
	 *
	 * @param string $file
	 * @return Response
	 */
	public function getFile(string $file): Response {
		try {
			$appFile = $this->tessdataService->getAppFile($file);
			$response = new FileDisplayResponse($appFile, Http::STATUS_OK, ["Content-Type" => "application/gzip"]);
			$response->cacheFor(172800);
			return $response;
		} catch (NotFoundException $e) {
			return new NotFoundResponse();
		}
	}
}
