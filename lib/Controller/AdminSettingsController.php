<?php

/**
 * Nextcloud - OCR
 * This file is licensed under the Affero General Public License version 3 or
 * later.
 * See the COPYING file.
 * 
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */
namespace OCA\Ocr\Controller;

use OCP\AppFramework\Controller;
use OCP\IRequest;
use OCP\IL10N;
use OCA\Ocr\Config\AppConfig;
use OCP\AppFramework\Http\DataResponse;
use OCA\Ocr\Service\AppConfigService;
use OCA\Ocr\Service\NotFoundException;
use OCA\Ocr\Constants\OcrConstants;


class AdminSettingsController extends Controller {

    /** @var IL10N */
    private $l10n;

    /** @var AppConfigService */
    private $appConfig;
    use Errors;

    /**
     * Constructor
     * 
     * @param string $appName            
     * @param IRequest $request            
     * @param IL10N $l10n            
     * @param AppConfigService $appConfig            
     * @param string $userId            
     */
    public function __construct($appName, IRequest $request, IL10N $l10n, AppConfigService $appConfig, $userId) {
        parent::__construct($appName, $request);
        $this->l10n = $l10n;
        $this->appConfig = $appConfig;
    }

    /**
     * @NoAdminRequired
     * 
     * @return DataResponse
     */
    public function getLanguages() {
        return $this->handleNotFound(
                function () {
                    return [
                            'languages' => $this->appConfig->getAppValue(OcrConstants::LANGUAGES_CONFIG_KEY)
                    ];
                });
    }

    /**
     * @NoAdminRequired
     * 
     * @return DataResponse
     */
    public function evaluateRedisSettings() {
        return $this->handleNotFound(
                function () {
                    return [
                            'set' => $this->appConfig->evaluateRedisSettings()
                    ];
                });
    }

    /**
     * Sets the languages that are supported by the docker worker instance.
     * 
     * @param string $languages            
     * @return DataResponse
     */
    public function setLanguages($languages) {
        return $this->handleNotFound(
                function () use ($languages) {
                    $this->appConfig->setAppValue(OcrConstants::LANGUAGES_CONFIG_KEY, $languages);
                    return $this->l10n->t('Saved');
                });
    }

    /**
     * Sets the Redis settings.
     * 
     * @param string $redisHost            
     * @param string $redisPort            
     * @param string $redisDb   
     * @param string $redisPassword         
     * @return DataResponse
     */
    public function setRedis($redisHost, $redisPort, $redisDb, $redisPassword) {
        return $this->handleNotFound(
                function () use ($redisHost, $redisPort, $redisDb, $redisPassword) {
                    $this->appConfig->setAppValue(OcrConstants::REDIS_CONFIG_KEY_HOST, $redisHost);
                    $this->appConfig->setAppValue(OcrConstants::REDIS_CONFIG_KEY_PORT, $redisPort);
                    $this->appConfig->setAppValue(OcrConstants::REDIS_CONFIG_KEY_DB, $redisDb);
                    $this->appConfig->setAppValue(OcrConstants::REDIS_CONFIG_KEY_PASSWORD, $redisPassword);
                    return $this->l10n->t('Saved');
                });
    }
}