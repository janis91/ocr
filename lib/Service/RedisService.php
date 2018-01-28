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

use Exception;
use OCA\Ocr\Db\OcrJob;
use OCA\Ocr\Db\OcrJobMapper;
use OCP\IL10N;
use OCP\ITempManager;
use OCP\ILogger;
use OCA\Ocr\Constants\OcrConstants;
use OCA\Ocr\Util\FileUtil;
use OCA\Ocr\Util\RedisUtil;


/**
 * Class RedisService
 * 
 * @package OCA\Ocr\Service
 */
class RedisService {

    /**
     *
     * @var RedisUtil
     */
    private $redisUtil;

    /**
     *
     * @var OcrJobMapper
     */
    private $mapper;

    /**
     *
     * @var FileUtil
     */
    private $fileUtil;

    /**
     *
     * @var ILogger
     */
    private $logger;

    /**
     *
     * @var IL10N
     */
    private $l10n;
    
    /**
     *
     * @var ITempManager
     */
    private $tempM;

    /**
     * QueueService constructor.
     * 
     * @param OcrJobMapper $mapper            
     * @param FileUtil $fileUtil            
     * @param RedisUtil $redisUtil            
     * @param IL10N $l10n            
     * @param ILogger $logger            
     */
    public function __construct(OcrJobMapper $mapper, FileUtil $fileUtil, RedisUtil $redisUtil, IL10N $l10n, 
            ILogger $logger, ITempManager $tempManager) {
        $this->mapper = $mapper;
        $this->fileUtil = $fileUtil;
        $this->logger = $logger;
        $this->l10n = $l10n;
        $this->redisUtil = $redisUtil;
        $this->tempM = $tempManager;
    }

    /**
     * Inits the client and sends the task to the background worker (async)
     * 
     * @param OcrJob $job            
     * @param string[] $languages            
     */
    public function sendJob($job, $languages) {
        try {
            // check for messaging and put everything together
            $redis = $this->redisUtil->setupRedisInstance();
            $job = $this->mapper->insert($job);
            $msg = json_encode(
                    [
                            'id' => $job->getId(),
                            'type' => $job->getType(),
                            'source' => $job->getSource(),
                            'tempFile' => $job->getTempFile(),
                            'languages' => $languages
                    ]);
            if (!$redis->lPush(OcrConstants::REDIS_NEW_JOBS_QUEUE, $msg)) {
                throw new NotFoundException($this->l10n->t('Could not add files to the Redis OCR processing queue.'));
            }
        } catch (Exception $e) {
            $this->fileUtil->execRemove($this->tempM->getTempBaseDir().'/'.$job->getTempFile().'.pdf');
            $job->setStatus(OcrConstants::STATUS_FAILED);
            $job->setErrorLog($e->getMessage());
            $this->mapper->update($job);
            $this->handleException($e);
        }
    }

    /**
     * Retrieves all finished jobs from redis and returns them.
     * 
     * @return string[]
     */
    public function readingFinishedJobs() {
        try {
            $redis = $this->redisUtil->setupRedisInstance();
            $result = $redis->multi()
                ->lRange(OcrConstants::REDIS_FINISHED_JOBS_QUEUE, 0, -1)
                ->delete(OcrConstants::REDIS_FINISHED_JOBS_QUEUE)
                ->exec();
            $this->logger->debug('Retrieved the following array from Redis: {result}', 
                    [
                            'result' => $result[0]
                    ]);
            return $result[0];
        } catch (Exception $e) {
            $this->handleException($e);
        }
    }

    /**
     * Handle the possible thrown Exceptions from all methods of this class.
     * 
     * @param Exception $e            
     * @throws Exception
     * @throws NotFoundException
     */
    private function handleException($e) {
        $this->logger->logException($e, 
                [
                        'message' => 'Exception during message queue processing'
                ]);
        throw $e;
    }
}