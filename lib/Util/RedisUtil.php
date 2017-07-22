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
namespace OCA\Ocr\Util;

use OCP\ILogger;
use OCP\IL10N;
use OCA\Ocr\Service\NotFoundException;
use OCA\Ocr\Constants\OcrConstants;
use OCP\IConfig;


/**
 * Class RedisUtil
 * 
 * @package OCA\Ocr\Util
 */
class RedisUtil {

    /**
     *
     * @var IL10N
     */
    private $l10n;

    /**
     *
     * @var ILogger
     */
    private $logger;

    /**
     *
     * @var IConfig
     */
    private $config;

    /**
     *
     * @var string
     */
    private $appName = 'ocr';

    /**
     *
     * @param IL10N $l10n            
     * @param ILogger $logger            
     * @param IConfig $config            
     */
    public function __construct(IL10N $l10n, ILogger $logger, IConfig $config) {
        $this->l10n = $l10n;
        $this->logger = $logger;
        $this->config = $config;
    }

    /**
     * Setup the Redis instance and return to whom ever it needs.
     * @codeCoverageIgnore
     * 
     * @throws NotFoundException
     * @return \Redis
     */
    public function setupRedisInstance() {
        try {
        if (!extension_loaded('redis')) {
            $this->logger->debug(
                    'It seems that the message queueing capabilities are not available in your local php installation. Please install php-redis.');
            throw new NotFoundException($this->l10n->t('Message queueing capabilities are missing on the server (package php-redis).'));
        }
        $redis = new \Redis();
        if (!$redis->connect($this->config->getAppValue($this->appName, 'redisHost'), 
                intval($this->config->getAppValue($this->appName, 'redisPort')), 2.5, null, 100)) {
            $this->logger->debug('Cannot connect to Redis.');
            throw new NotFoundException($this->l10n->t('Cannot connect to Redis.'));
        }
        $password = $this->config->getAppValue($this->appName, 'redisPassword', '');
        if($password !== '') {
            $authenticated = $redis->auth($password);
        }
        if ($password !== '' && !$authenticated) {
            $this->logger->debug('Redis authentication error.');
            throw new NotFoundException($this->l10n->t('Redis authentication error.'));
        }
        if (!$redis->select(intval($this->config->getAppValue($this->appName, 'redisDb')))) {
            $this->logger->debug('Cannot connect to the right Redis database.');
            throw new NotFoundException($this->l10n->t('Cannot connect to the right Redis database.'));
        }
        $redis->setOption(\Redis::OPT_PREFIX, OcrConstants::REDIS_KEY_PREFIX);
        return $redis;
        } catch (\RedisException $e) {
            if($e->getMessage() === 'Failed to AUTH connection') {
                throw new NotFoundException($this->l10n->t('Redis authentication error.'));
            }
        }
    }
}