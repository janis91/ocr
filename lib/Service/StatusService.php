<?php

/**
 * Nextcloud - OCR
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 * 
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */
namespace OCA\Ocr\Service;

use Exception;
use OCP\IL10N;
use OCP\ILogger;
use OCA\Ocr\Db\OcrJobMapper;


/**
 * Class StatusService
 * 
 * @package OCA\Ocr\Service
 */
class StatusService {

    /**
     *
     * @var ILogger
     */
    private $logger;

    /**
     *
     * @var string
     */
    private $userId;

    /**
     *
     * @var IL10N
     */
    private $l10n;

    /**
     *
     * @var OcrJobMapper
     */
    private $jobMapper;

    /**
     *
     * @var JobService
     */
    private $jobService;

    /**
     * StatusService constructor.
     * 
     * @param IL10N $l10n            
     * @param ILogger $logger            
     * @param string $userId            
     * @param OcrJobMapper $jobMapper            
     * @param JobService $jobService            
     */
    public function __construct(IL10N $l10n, ILogger $logger, $userId, OcrJobMapper $jobMapper, JobService $jobService) {
        $this->logger = $logger;
        $this->jobMapper = $jobMapper;
        $this->userId = $userId;
        $this->l10n = $l10n;
        $this->jobService = $jobService;
    }

    /**
     * A function which returns the JSONResponse for all required status checks and tasks.
     * It will check for already processed, pending and failed ocr tasks and return them as needed.
     * 
     * @return string
     */
    public function getStatus() {
        try {
            // TODO: For now this will be placed in the regular check, but in the future this could be done in another
            // way
            $this->jobService->checkForFinishedJobs();
            // returns user specific processed files
            $processed = $this->jobMapper->findAllProcessed($this->userId);
            $this->jobService->handleProcessed();
            // return user specific pending state
            $pending = $this->jobMapper->findAllPending($this->userId);
            // return user specific failed state and set up error
            $failed = $this->jobMapper->findAllFailed($this->userId);
            $this->jobService->handleFailed();
            return [
                    'processed' => count($processed),
                    'failed' => count($failed),
                    'pending' => count($pending)
            ];
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
        $this->logger->logException($e, [
                'message' => 'Exception during status service function processing'
        ]);
        throw $e;
    }
}