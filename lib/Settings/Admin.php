<?php

/**
 * Nextcloud - OCR
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 * 
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */
namespace OCA\Ocr\Settings;

use OCP\Settings\ISettings;
use OCP\IConfig;
use OCP\AppFramework\Http\TemplateResponse;
use OCA\Ocr\Constants\OcrConstants;


class Admin implements ISettings {

    /** @var IConfig */
    private $config;

    /**
     *
     * @param IConfig $config            
     */
    public function __construct(IConfig $config) {
        $this->config = $config;
    }

    /**
     *
     * @return TemplateResponse
     */
    public function getForm() {
        return new TemplateResponse('ocr', 'settings-admin', 
                [
                        OcrConstants::LANGUAGES_CONFIG_KEY => $this->config->getAppValue(OcrConstants::APP_NAME, 
                                OcrConstants::LANGUAGES_CONFIG_KEY),
                        OcrConstants::REDIS_CONFIG_KEY_HOST => $this->config->getAppValue(OcrConstants::APP_NAME, 
                                OcrConstants::REDIS_CONFIG_KEY_HOST),
                        OcrConstants::REDIS_CONFIG_KEY_PORT => $this->config->getAppValue(OcrConstants::APP_NAME, 
                                OcrConstants::REDIS_CONFIG_KEY_PORT),
                        OcrConstants::REDIS_CONFIG_KEY_DB => $this->config->getAppValue(OcrConstants::APP_NAME, 
                                OcrConstants::REDIS_CONFIG_KEY_DB),
                        OcrConstants::REDIS_CONFIG_KEY_PASSWORD => $this->config->getAppValue(OcrConstants::APP_NAME,
                                OcrConstants::REDIS_CONFIG_KEY_PASSWORD)
                ], 'blank');
    }

    /**
     *
     * @return string the section ID, e.g. 'sharing'
     */
    public function getSection() {
        return OcrConstants::APP_NAME;
    }

    /**
     *
     * @return int whether the form should be rather on the top or bottom of
     *         the admin section. The forms are arranged in ascending order of the
     *         priority values. It is required to return a value between 0 and 100.
     *         keep the server setting at the top, right after "server settings"
     */
    public function getPriority() {
        return 0;
    }
}