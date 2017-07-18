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
namespace OCA\Ocr\Service;

use \OCP\IConfig;
use OCP\IL10N;
use OCA\Ocr\Constants\OcrConstants;


class AppConfigService {

    /**
     *
     * @var string
     */
    private $appName = 'ocr';

    /**
     *
     * @var IConfig
     */
    private $config;

    /**
     *
     * @var IL10N
     */
    private $l10n;

    /**
     * Constructor
     * 
     * @param IConfig $config            
     * @param IL10N $l10n            
     */
    public function __construct(IConfig $config, IL10N $l10n) {
        $this->config = $config;
        $this->l10n = $l10n;
    }

    /**
     * Get a value by key
     * 
     * @param string $key            
     * @return string
     */
    public function getAppValue($key) {
        return $this->config->getAppValue($this->appName, $key);
    }

    /**
     * Evaluate if all redis related settings are set.
     * 
     * @return boolean
     */
    public function evaluateRedisSettings() {
        if ($this->config->getAppValue($this->appName, OcrConstants::REDIS_CONFIG_KEY_HOST) !== '' &&
                 $this->config->getAppValue($this->appName, OcrConstants::REDIS_CONFIG_KEY_PORT) !== '' &&
                 $this->config->getAppValue($this->appName, OcrConstants::REDIS_CONFIG_KEY_DB) !== '') {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Set a value for the given key.
     * 
     * @param string $key            
     * @param string $value            
     * @return string
     * @throws NotFoundException
     */
    public function setAppValue($key, $value) {
        if(empty($key)) {
            throw new NotFoundException($this->l10n->t('The given settings key is empty.'));
        }
        switch ($key) {
            case OcrConstants::LANGUAGES_CONFIG_KEY :
                $this->checkLanguages($value);
                break;
            case OcrConstants::REDIS_CONFIG_KEY_HOST :
                $this->checkRedisHost($value);
                break;
            case OcrConstants::REDIS_CONFIG_KEY_PORT :
                $this->checkRedisPort($value);
                break;
            case OcrConstants::REDIS_CONFIG_KEY_DB :
                $this->checkRedisDb($value);
                break;
        }
        return $this->config->setAppValue($this->appName, $key, $value);
    }

    /**
     * Checks for the right languages format.
     * 
     * @param string $value            
     * @throws NotFoundException
     */
    private function checkLanguages($value) {
        if (empty($value) || !preg_match('/^(([a-z]{3,4}|[a-z]{3,4}\-[a-z]{3,4});)*([a-z]{3,4}|[a-z]{3,4}\-[a-z]{3,4})$/', $value)) {
            throw new NotFoundException($this->l10n->t('The languages are not specified in the correct format.'));
        }
    }

    /**
     * Checks for the right Redis host format.
     * 
     * @param string $value            
     * @throws NotFoundException
     */
    private function checkRedisHost($value) {
        if (empty($value) || !preg_match(
                '/(^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$)/', 
                $value)) {
            throw new NotFoundException($this->l10n->t('The Redis host is not specified in the correct format.'));
        }
    }

    /**
     * Checks for the right Redis port format.
     * 
     * @param string $value            
     * @throws NotFoundException
     */
    private function checkRedisPort($value) {
        if (empty($value) || !($value > 0 && $value < 65535)) {
            throw new NotFoundException($this->l10n->t('The Redis port number is not specified in the correct format.'));
        }
    }

    /**
     * Checks for the right Redis DB format.
     * 
     * @param string $value            
     * @throws NotFoundException
     */
    private function checkRedisDb($value) {
        if ($value === '' || !preg_match('/^\d*$/', $value)) {
            throw new NotFoundException($this->l10n->t('The Redis DB is not specified in the correct format.'));
        }
    }
}