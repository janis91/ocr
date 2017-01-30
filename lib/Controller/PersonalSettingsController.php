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
use OCP\Template;

class PersonalSettingsController extends Controller {

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
	 * PersonalSettingsController constructor.
	 *
	 * @param string $AppName
	 * @param IRequest $request
	 * @param OcrService $service
	 * @param $UserId
	 */
	public function __construct($AppName, IRequest $request, OcrService $service, $UserId) {
		parent::__construct($AppName, $request);
		$this->userId = $UserId;
		$this->service = $service;
	}

	/**
	 * @NoAdminRequired
	 *
	 * @return Template
	 */
	public function displayPanel() {
		$tmpl = new Template('ocr', 'settings-personal');
		return $tmpl;
	}

	/**
	 * @NoAdminRequired
	 *
	 * @return \OCP\AppFramework\Http\DataResponse
	 */
	public function getAll() {
		return $this->handleNotFound(function() {
			return $this->service->getAllForPersonal($this->userId);
		});
	}

	/**
	 * @NoAdminRequired
	 *
	 * @return \OCP\AppFramework\Http\DataResponse
	 */
	public function deleteStatus($id) {
		return $this->handleNotFound(function() use ($id) {
			return $this->service->deleteStatus($id, $this->userId);
		});
	}
}