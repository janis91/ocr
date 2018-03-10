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

use OCA\Ocr\Db\OcrJobMapper;
use OC\Files\View;
use OCP\ILogger;
use OCP\IL10N;
use OCP\ITempManager;
use OCA\Ocr\Db\OcrJob;
use OCA\Ocr\Constants\OcrConstants;
use OCA\Ocr\Util\PHPUtil;
use Exception;
use OCP\AppFramework\Db\DoesNotExistException;
use OCA\Ocr\Util\FileUtil;


/**
 * Class JobService
 * 
 * @package OCA\Ocr\Service
 */
class JobService {

    /**
     *
     * @var ILogger
     */
    private $logger;

    /**
     *
     * @var RedisService
     */
    private $redisService;

    /**
     *
     * @var OcrJobMapper
     */
    private $jobMapper;

    /**
     *
     * @var View
     */
    private $view;

    /**
     *
     * @var String
     */
    private $userId;

    /**
     *
     * @var IL10N
     */
    private $l10n;

    /**
     *
     * @var FileService
     */
    private $fileService;

    /**
     *
     * @var ITempManager
     */
    private $tempM;

    /**
     *
     * @var AppConfigService
     */
    private $appConfigService;

    /**
     *
     * @var PHPUtil
     */
    private $phpUtil;

    /**
     *
     * @var FileUtil
     */
    private $fileUtil;

    /**
     * JobService constructor.
     * 
     * @param IL10N $l10n            
     * @param ILogger $logger            
     * @param string $userId            
     * @param View $view            
     * @param RedisService $queueService            
     * @param OcrJobMapper $mapper            
     * @param FileService $fileService            
     * @param AppConfigService $appConfigService            
     * @param PHPUtil $phpUtil            
     * @param FileUtil $fileUtil            
     */
    public function __construct(IL10N $l10n, ILogger $logger, $userId, View $view, ITempManager $tempManager, 
            RedisService $queueService, OcrJobMapper $mapper, FileService $fileService, 
            AppConfigService $appConfigService, PHPUtil $phpUtil, FileUtil $fileUtil) {
        $this->logger = $logger;
        $this->redisService = $queueService;
        $this->jobMapper = $mapper;
        $this->view = $view;
        $this->userId = $userId;
        $this->l10n = $l10n;
        $this->fileService = $fileService;
        $this->tempM = $tempManager;
        $this->appConfigService = $appConfigService;
        $this->phpUtil = $phpUtil;
        $this->fileUtil = $fileUtil;
    }

    /**
     * Processes and prepares the files for OCR.
     * Sends the stuff to the client in order to OCR async.
     * 
     * @param string[] $languages            
     * @param array $files            
     * @param boolean $replace            
     * @return string
     */
    public function process($languages, $files, $replace) {
        try {
            $this->logger->debug('Will now process files: {files} with languages: {languages} and replace: {replace}', 
                    [
                            'files' => json_encode($files),
                            'languages' => json_encode($languages),
                            'replace' => json_encode($replace),
                            'app' => 'OCR'
                    ]);
            // Check if files and language not empty
            $noLang = $this->noLanguage($languages);
            if (!empty($files) && ($this->checkForAcceptedLanguages($languages) || $noLang) && is_bool($replace)) {
                // language part:
                if ($noLang) {
                    $languages = [];
                }
                // file part:
                $fileInfo = $this->fileService->buildFileInfo($files);
                foreach ($fileInfo as $fInfo) {
                    // Check Shared
                    $shared = $this->fileService->checkSharedWithInitiator($fInfo);
                    if($shared && $replace) {
                        throw new NotFoundException($this->l10n->t('Cannot replace shared files.'));
                    }
                    $target = $this->fileService->buildTarget($fInfo, $shared, $replace);
                    $source = $this->fileService->buildSource($fInfo, $shared);
                    // set the running type
                    $fType = $this->fileService->getCorrectType($fInfo);
                    // create a temp file for ocr processing purposes
                    $tempFile = $this->getTempFile();
                    // Create job object
                    $job = new OcrJob(OcrConstants::STATUS_PENDING, $source, $target, $tempFile, $fType, $this->userId, 
                            false, $fInfo->getName(), null, $replace);
                    // Init client and send task / job
                    // Feed the worker
                    $this->redisService->sendJob($job, $languages);
                }
                return 'PROCESSING';
            } else {
                throw new NotFoundException($this->l10n->t('Empty parameters passed.'));
            }
        } catch (Exception $e) {
            $this->handleException($e);
        }
    }

    /**
     * Delete an ocr job for a given id and userId.
     * 
     * @param
     *            $jobId
     * @param string $userId            
     * @return OcrJob
     */
    public function deleteJob($jobId, $userId) {
        try {
            $job = $this->jobMapper->find($jobId);
            if ($job->getUserId() !== $userId) {
                throw new NotFoundException($this->l10n->t('Cannot delete because of wrong owner.'));
            } else {
                $job = $this->jobMapper->delete($job);
            }
            $job->setTarget(null);
            $job->setSource(null);
            $job->setStatus(null);
            $job->setTempFile(null);
            $job->setType(null);
            $job->setUserId(null);
            $job->setErrorDisplayed(null);
            $job->setErrorLog(null);
            $job->setReplace(null);
            return $job;
        } catch (Exception $e) {
            if ($e instanceof DoesNotExistException) {
                $ex = new NotFoundException($this->l10n->t('Cannot delete because of wrong ID.'));
                $this->handleException($ex);
            } else {
                $this->handleException($e);
            }
        }
    }

    /**
     * Gets all job objects for a specific user.
     * 
     * @param string $userId            
     * @return OcrJob[]
     */
    public function getAllJobsForUser($userId) {
        try {
            $jobs = $this->jobMapper->findAll($userId);
            $jobsNew = array();
            foreach ($jobs as $job) {
                $job->setTarget(null);
                $job->setSource(null);
                $job->setTempFile(null);
                $job->setType(null);
                $job->setUserId(null);
                $job->setErrorDisplayed(null);
                array_push($jobsNew, $job);
            }
            return $jobsNew;
        } catch (Exception $e) {
            $this->handleException($e);
        }
    }

    /**
     * The function checks if there are finished jobs to process finally.
     * 
     * @throws NotFoundException
     */
    public function checkForFinishedJobs() {
        try {
            $finishedJobs = $this->redisService->readingFinishedJobs();
            foreach ($finishedJobs as $finishedJob) {
                $fJob = $this->transformJob($finishedJob);
                $this->logger->debug('The following job finished: {job}', 
                        [
                                'job' => $fJob,
                                'app' => 'OCR'
                        ]);
                $this->jobFinished($fJob->id, $fJob->error, $fJob->log);
            }
        } catch (Exception $e) {
            throw new NotFoundException($this->l10n->t('Reading the finished jobs from Redis went wrong.'));
        }
    }

    /**
     * Finishes all Processed files by copying them to the right path and deleteing the temp files.
     * Returns the number of processed files.
     * 
     * @return array
     */
    public function handleProcessed() {
        try {
            $this->logger->debug('Check if files were processed by ocr and if so, put them to the right dirs.', ['app' => 'OCR']);
            $processed = $this->jobMapper->findAllProcessed($this->userId);
            foreach ($processed as $job) {
                if ($this->fileUtil->fileExists($this->tempM->getTempBaseDir().'/'.$job->getTempFile().'.pdf')) {
                    // Save the tmp file with newname
                    $this->pullResult($job);
                    $this->jobMapper->delete($job);
                    $this->fileUtil->execRemove($this->tempM->getTempBaseDir().'/'.$job->getTempFile().'.pdf');
                } else {
                    $job->setStatus(OcrConstants::STATUS_FAILED);
                    $job->setErrorLog('Temp file does not exist.');
                    $this->jobMapper->update($job);
                    throw new NotFoundException($this->l10n->t('Temp file does not exist.'));
                }
            }
            return $processed;
        } catch (Exception $e) {
            $this->handleException($e);
        }
    }

    /**
     * Handles all failed orders of ocr processing queue and returns the job objects.
     * 
     * @return array
     */
    public function handleFailed() {
        try {
            $failed = $this->jobMapper->findAllFailed($this->userId);
            foreach ($failed as $job) {
                // clean the tempfile
                $this->fileUtil->execRemove($this->tempM->getTempBaseDir().'/'.$job->getTempFile().'.pdf');
                // set error displayed
                $job->setErrorDisplayed(true);
                $this->jobMapper->update($job);
            }
            $this->logger->debug('Following jobs failed: {failed}', 
                    [
                            'failed' => json_encode($failed),
                            'app' => 'OCR'
                    ]);
            return $failed;
        } catch (Exception $e) {
            $this->handleException($e);
        }
    }

    /**
     * Gets the OCR result and puts it to Nextcloud.
     * 
     * @param OcrJob $job            
     */
    private function pullResult($job) {
        if ($job->getReplace()) {
            $this->view->unlink(str_replace($this->userId . '/files', '', $job->getSource()));
        }
        $result = $this->view->file_put_contents($job->getTarget(), $this->fileUtil->getFileContents($this->tempM->getTempBaseDir().'/'.$job->getTempFile().'.pdf'));
        if (!$result) {
            throw new NotFoundException($this->l10n->t('OCR could not put processed file to the right target folder. If you selected the replace option, you can restore the file by using the trash bin.'));
        }
    }

    /**
     * The function the worker will call in order to set the jobs status.
     * The worker should call it automatically after each processing step.
     * 
     * @param integer $jobId            
     * @param boolean $error            
     * @param string $log            
     */
    private function jobFinished($jobId, $error, $log) {
        try {
            $job = $this->jobMapper->find($jobId);
            if (!$error) {
                $job->setStatus(OcrConstants::STATUS_PROCESSED);
                $this->jobMapper->update($job);
            } else {
                $job->setStatus(OcrConstants::STATUS_FAILED);
                $job->setErrorLog($log);
                $this->jobMapper->update($job);
                $this->logger->error($log, ['app' => 'OCR']);
            }
        } catch (Exception $e) {
            $this->handleException($e);
        }
    }

    /**
     * Gives a temp file name back depending on the type of the OCR.
     * Later in the worker this file is used as an output.
     *         
     * @return string
     */
    private function getTempFile() {
            $fileName = $this->phpUtil->tempnamWrapper($this->tempM->getTempBaseDir(), OcrConstants::TEMPFILE_PREFIX);
            $this->phpUtil->unlinkWrapper($fileName);
            $fileNameWithPostfix = $fileName . '.pdf';
            $this->phpUtil->touchWrapper($fileNameWithPostfix);
            $this->phpUtil->chmodWrapper($fileNameWithPostfix, 0600);
            $fileName = basename($fileName);
            return $fileName;
    }

    /**
     * Takes care of transforming an incoming finished job into a php readable object.
     * 
     * @param string $job            
     * @throws NotFoundException
     * @return mixed
     */
    private function transformJob($job) {
        $decoded = json_decode($job);
        if ($decoded !== null && isset($decoded->id)) {
            return $decoded;
        } else {
            $this->logger->debug('The finished job retrieved by Redis was corrupt.', ['app' => 'OCR']);
            throw new NotFoundException('The finished job retrieved by Redis was corrupt.');
        }
    }

    /**
     * Checks if the given languages are supported or not.
     * 
     * @param string[] $languages            
     * @return boolean
     */
    private function checkForAcceptedLanguages($languages) {
        $installedLanguages = explode(';', $this->appConfigService->getAppValue('languages'));
        if (count(array_diff($languages, $installedLanguages)) === 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Checks if the process should be initiated without any language specified.
     * 
     * @param string[] $languages            
     * @return boolean
     */
    private function noLanguage($languages) {
        if (in_array('any', $languages)) {
            return true;
        } else {
            return false;
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
                        'message' => 'Exception during job service function processing',
                        'app' => 'OCR'
                ]);
        throw $e;
    }
}