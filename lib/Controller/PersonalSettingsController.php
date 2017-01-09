<?php
/**
 * nextCloud - ocr
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */

namespace OCA\Ocr\Controller;

use OCA\Ocr\Db\OcrStatusMapper;
use OCA\Ocr\Service\OcrService;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\IRequest;

class PersonalSettingsController extends Controller {

	/**
	 * @var string
	 */
	private $userId;

	/**
	 * @var OcrService
	 */
	private $service;

	/**
	 * @var OcrStatusMapper
	 */
	private $statusMapper;

	use Errors;

	/**
	 * PersonalSettingsController constructor.
	 *
	 * @param string $AppName
	 * @param IRequest $request
	 * @param OcrService $service
	 * @param $UserId
	 */
	public function __construct($AppName, IRequest $request, OcrService $service, OcrStatusMapper $statusMapper, $UserId) {
		parent::__construct($AppName, $request);
		$this->userId = $UserId;
		$this->service = $service;
		$this->statusMapper = $statusMapper;
	}

	/**
	 * @NoAdminRequired
	 *
	 * @return TemplateResponse
	 */
	public function displayPanel() {
		return new TemplateResponse('ocr', 'settings-personal');
	}

	/**
	 * @NoAdminRequired
	 *
	 * @return \OCP\AppFramework\Http\DataResponse
	 */
	public function getFailed() {
		return $this->handleNotFound(function () {
			return $this->statusMapper->findAllFailed($this->userId);
		});
	}

	/**
	 * @NoAdminRequired
	 *
	 * @return \OCP\AppFramework\Http\DataResponse
	 */
	public function deleteFailed($id) {
		return $this->handleNotFound(function () use ($id) {
			return $this->service->deleteFailed($id, $this->userId);
		});
	}
}