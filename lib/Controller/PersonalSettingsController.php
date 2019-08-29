<?php
/**
 * Nextcloud - OCR
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2019
 */

namespace OCA\Ocr\Controller;

use OCP\AppFramework\ApiController;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\JSONResponse;
use OCP\IConfig;
use OCP\ILogger;
use OCP\IRequest;
use OCA\Ocr\Constants\OcrConstants;

class PersonalSettingsController extends ApiController {

	/** @var IConfig */
	private $config;
	/** @var string */
	private $userId;
	/** @var ILogger */
	private $logger;

	/**
	 * PersonalSettingsController constructor.
	 *
	 * @param string $appName
	 * @param IRequest $request
	 * @param IConfig $config
	 * @param ILogger $logger
	 * @param string $userId
	 */
	public function __construct($appName, IRequest $request, IConfig $config, ILogger $logger, $userId) {
		parent::__construct($appName, $request);
		$this->config = $config;
		$this->logger = $logger;
		$this->userId = $userId;
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 *
	 * @return JSONResponse
	 */
	public function get() {
		$response = [];
		$favoriteLanguages = $this->config->getUserValue($this->userId, OcrConstants::APP_NAME, 'favoriteLanguages');
		if (!empty($favoriteLanguages)) {
			$response = json_decode($favoriteLanguages);
		}
		$this->logger->debug('Get favorite languages for user: {user}: {languages}',
			[
				'languages' => $favoriteLanguages,
				'user' => $this->userId,
				'app' => OcrConstants::APP_NAME
			]);
		return new JSONResponse($response);
	}

	/**
	 * @NoAdminRequired
	 *
	 * @param string $favoriteLanguages
	 * @return JSONResponse
	 * @throws \OCP\PreConditionNotMetException
	 */
	public function set($favoriteLanguages) {
		if (!is_null($favoriteLanguages)) {
			$languages = json_decode($favoriteLanguages);
			if (!is_null($languages) && is_array($languages)) {
				if (empty($languages)) {
					$this->config->setUserValue($this->userId, OcrConstants::APP_NAME, 'favoriteLanguages', '');
					$this->logger->info('Set favorite languages to empty set for user: {user}',
						[
							'user' => $this->userId,
							'app' => OcrConstants::APP_NAME
						]);
					return new JSONResponse($languages);
				}
				$languages = array_unique($languages);
				$isValid = true;
				foreach ($languages as $language) {
					$isValid = in_array($language, OcrConstants::ALLOWED_LANGUAGES);
				}
				if ($isValid) {
					$this->config->setUserValue($this->userId, OcrConstants::APP_NAME, 'favoriteLanguages', json_encode($languages));
					$this->logger->info('Set favorite languages to {languages} set for user: {user}',
						[
							'languages' => $favoriteLanguages,
							'user' => $this->userId,
							'app' => OcrConstants::APP_NAME
						]);
					return new JSONResponse($languages);
				}
			}
		}
		return new JSONResponse('', Http::STATUS_BAD_REQUEST);
	}
}