<?php
/**
 * nextCloud - ocr
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2016
 */

namespace OCA\Ocr\Controller;

use OCA\Ocr\Service\OcrService;
use OCP\AppFramework\Http\DataResponse;
use OCP\IRequest;
use OCP\AppFramework\Controller;



/**
 * Class OcrController
 *
 * @package OCA\Ocr\Controller
 */
class OcrController extends Controller {

	/**
	 * @var string
	 */
	private $userId;

	/**
	 * @var OcrService
	 */
	private $service;

	use Errors;

	/**
	 * OcrController constructor.
	 *
	 * @param string $AppName
	 * @param IRequest $request
	 * @param OcrService $service
	 * @param $UserId
	 */
	public function __construct($AppName, IRequest $request, OcrService $service, $UserId){
		parent::__construct($AppName, $request);
		$this->userId = $UserId;
		$this->service = $service;
	}

	/**
	 * Get languages supported by installed tesseract. (Version has to be at least 3.02.02)
	 * @NoAdminRequired
	 * @return DataResponse
	 */
	public function languages(){
		return $this->handleNotFound(function(){
			return $this->service->listLanguages();
		});
	}

	/**
	 * Processing the srcFile(s)
	 * @NoAdminRequired
	 * @param string $language - deu, eng...
	 * @param array $files
	 * @return DataResponse
	 */
	public function process($language, $files) {
		return $this->handleNotFound(function () use ($language, $files){
			return $this->service->process($language, $files);
		});
	}

	/**
	 * Get the current status.
	 * @NoAdminRequired
	 * @return DataResponse
	 */
	public function status(){
		return $this->handleNotFound(function () {
			return $this->service->status();
		});
	}

}