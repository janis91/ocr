<?php
/**
 * nextCloud - ocr
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2016
 */

namespace OCA\Ocr\Service;

use Exception;
use OC\Files\View;
use OCA\Ocr\Db\OcrStatus;
use OCA\Ocr\Db\OcrStatusMapper;
use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\Entity;
use OCP\Files;
use OCP\Files\FileInfo;
use OCP\IConfig;
use OCP\IL10N;
use OCP\ILogger;
use OCP\ITempManager;


/**
 * Class OcrService
 * @package OCA\Ocr\Service
 */
class OcrService {

	/**
	 * @var ILogger
	 */
	private $logger;

	/**
	 * @var ITempManager
	 */
	private $tempM;

	/**
	 * @var IConfig
	 */
	private $config;

	/**
	 * @var QueueService
	 */
	private $queueService;

	/**
	 * @var OcrStatusMapper
	 */
	private $statusMapper;

	/**
	 * @var View
	 */
	private $view;

	/**
	 * @var
	 */
	private $userId;

	/**
	 * @var IL10N
	 */
	private $l10n;

	/**
	 * Array of allowed mimetypes for ocr processing
	 */
	const ALLOWED_MIMETYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/tiff'];

	/**
	 * the correct mimetype for a pdf file
	 */
	const MIMETYPE_PDF = 'application/pdf';

	/**
	 * the only allowed image mimetypes by tesseract
	 */
	const MIMETYPES_IMAGE = ['image/png', 'image/jpeg', 'image/tiff'];

	/**
	 * OcrService constructor.
	 *
	 * @param ITempManager $tempManager
	 * @param IConfig $config
	 * @param QueueService $queueService
	 * @param OcrStatusMapper $mapper
	 * @param View $view
	 * @param $userId
	 * @param IL10N $l10n
	 * @param ILogger $logger
	 */
	public function __construct(ITempManager $tempManager, IConfig $config, QueueService $queueService, OcrStatusMapper $mapper, View $view, $userId, IL10N $l10n, ILogger $logger) {
		$this->logger = $logger;
		$this->tempM = $tempManager;
		$this->config = $config;
		$this->queueService = $queueService;
		$this->statusMapper = $mapper;
		$this->view = $view;
		$this->userId = $userId;
		$this->l10n = $l10n;
	}

	/**
	 * Gets the list of all available tesseract-ocr languages.
	 *
	 * @return array Languages
	 */
	public function listLanguages() {
		try {
			$success = -1;
			$this->logger->debug('Fetching languages. ', ['app' => 'ocr']);
			exec('tesseract --list-langs 2>&1', $result, $success);
			if ($success === 0 && count($result) > 0) {
				if (is_array($result)) {
					$traineddata = $result;
				} else {
					throw new NotFoundException($this->l10n->t('No languages found.'));
				}
				$languages = array();
				array_shift($traineddata); // delete the first element of the array as it is a description of tesseract
				asort($traineddata); // sort the languages alphabetically
				foreach ($traineddata as $td) {
					$tdname = trim($td); // strip whitespaces
					array_push($languages, $tdname); //add to language list
				}
				$this->logger->debug('Fetched languages: ' . json_encode($languages), ['app' => 'ocr']);
				return $languages;
			} else {
				throw new NotFoundException($this->l10n->t('No languages found.'));
			}
		} catch (Exception $e) {
			$this->handleException($e);
		}
	}

	/**
	 * Processes and prepares the files for ocr.
	 * Sends the stuff to the client in order to ocr async.
	 *
	 * @param string $language
	 * @param array $files
	 * @return string
	 */
	public function process($language, $files) {
		try {
			$this->logger->debug('Will now process files: ' . json_encode($files) . ' with language: ' . json_encode($language), ['app' => 'ocr']);
			// Check if files and language not empty
			if (!empty($files) && !empty($language) && in_array($language, $this->listLanguages())) {
				// get the array with full fileinfo
				$fileInfo = $this->buildFileInfo($files);
				foreach ($fileInfo as $fInfo) {
					// Check if filelock existing
					// TODO: FileLock maybe \OC\Files\View::lockFile()
					// get new name for saving purpose
					$newName = $this->buildNewName($fInfo);

					// create a temp file for ocr processing purposes
					$tempFile = $this->tempM->getTemporaryFile();

					// set the running type
					if ($fInfo->getMimetype() === $this::MIMETYPE_PDF) {
						$ftype = 'mypdf';
					} else {
						$ftype = 'tess';
					}

					// Create status object
					$status = new OcrStatus('PENDING', $fInfo->getId(), $newName, $tempFile, $ftype, $this->userId, false);

					// Init client and send task / job
					// Feed the worker
					$this->queueService->clientSend($status, $this->config->getSystemValue('datadirectory'), $fInfo->getPath(), $language, \OC::$SERVERROOT);
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
	 * A function which returns the JSONResponse for all required status checks and tasks.
	 * It will check for already processed, pending and failed ocr tasks and return them as needed.
	 *
	 * @codeCoverageIgnore
	 * @return string
	 */
	public function status() {
		try {
			// TODO: release lock

            // returns user specific processed files
			$processed = $this->handleProcessed();

			$pending = $this->statusMapper->findAllPending($this->userId);

			// return user specific failed state and set up error
			$failed = $this->handleFailed();

			return ['processed' => count($processed), 'failed' => count($failed), 'pending' => count($pending)];
		} catch (Exception $e) {
			$this->handleException($e);
		}
	}

	/**
	 * The command ocr:complete for occ will call this function in order to set the status.
	 * the worker should call it automatically after each processing step.
	 *
	 * @param $statusId
	 * @param boolean $failed
	 */
	public function complete($statusId, $failed) {
		try {
			$status = $this->statusMapper->find($statusId);
			if (!$failed) {
				$status->setStatus('PROCESSED');
				$this->statusMapper->update($status);
			} else {
				$status->setStatus('FAILED');
				$this->statusMapper->update($status);
			}
		} catch (Exception $e) {
			$this->handleException($e);
		}
	}

	/**
	 * The PersonalSettingsController will have the opportunity to delete ocr status objects.
	 *
	 * @param $statusId
	 * @return Entity
	 */
	public function deleteStatus($statusId, $userId) {
		try {
			$status = $this->statusMapper->find($statusId);
			if ($status->getUserId() !== $userId) {
				throw new NotFoundException($this->l10n->t('Cannot delete. Wrong owner.'));
			} else {
				$status = $this->statusMapper->delete($status);
			}
            $status->setFileId(null);
            $status->setTempFile(null);
            $status->setType(null);
            $status->setErrorDisplayed(null);
			return $status;
		} catch (Exception $e) {
		    if ($e instanceof DoesNotExistException) {
		        $ex = new NotFoundException($this->l10n->t('Cannot delete. Wrong id.'));
                $this->handleException($ex);
            } else {
		        $this->handleException($e);
		    }
		}
	}

	public function getAllForPersonal($userId) {
	    try {
            $status = $this->statusMapper->findAll($userId);
            $statusNew = array();
            foreach ($status as $s) {
                if ($s->getType() === 'tess') {
                    $newName = str_replace('_OCR.txt', '', $s->getNewName());
                } elseif ($s->getType() === 'mypdf') {
                    $newName = str_replace('_OCR.pdf', '', $s->getNewName());
                }
                $s->setNewName($newName);
                $s->setFileId(null);
                $s->setTempFile(null);
                $s->setType(null);
                $s->setErrorDisplayed(null);
                array_push($statusNew, $s);
            }
            return $statusNew;
        } catch (Exception $e) {
	        $this->handleException($e);
        }
    }

	/**
	 * Finishes all Processed files by copying them to the right path and deleteing the temp files.
	 * Returns the number of processed files.
	 *
	 * @codeCoverageIgnore
	 * @return array
	 */
	private function handleProcessed() {
		try {
			$this->logger->debug('Check if files were processed by ocr and if so, put them to the right dirs.', ['app' => 'ocr']);
			$processed = $this->statusMapper->findAllProcessed($this->userId);
			foreach ($processed as $status) {
				if ($status->getType() === 'tess' && file_exists($status->getTempFile() . '.txt')) {
					//Save the tmp file with newname
					$this->view->file_put_contents($status->getNewName(), file_get_contents($status->getTempFile() . '.txt')); // need .txt because tesseract saves it like this
					// Cleaning temp files
					$this->statusMapper->delete($status);
					exec('rm ' . $status->getTempFile() . '.txt');
				} elseif ($status->getType() === 'mypdf' && file_exists($status->getTempFile())) {
					//Save the tmp file with newname
					$this->view->file_put_contents($status->getNewName(), file_get_contents($status->getTempFile())); // don't need to extend with .pdf / it uses the tmp file to save
					$this->statusMapper->delete($status);
					exec('rm ' . $status->getTempFile());
				} else {
					throw new NotFoundException($this->l10n->t('Temp file does not exist.'));
				}
			}
			return $processed;
		} catch (Exception $e) {
			$this->handleException($e);
		}
	}

	/**
	 * Handles all failed orders of ocr processing queue and returns the status objects.
	 *
	 * @codeCoverageIgnore
	 * @return array
	 */
	private function handleFailed() {
		try {
			$failed = $this->statusMapper->findAllFailed($this->userId);
			foreach ($failed as $status) {
				// clean the tempfile
				exec('rm ' . $status->getTempFile());
				// set error displayed
				$status->setErrorDisplayed(true);
				$this->statusMapper->update($status);
			}
			$this->logger->debug('Following status objects failed: ' . json_encode($failed), ['app' => 'ocr']);
			return $failed;
		} catch (Exception $e) {
			$this->handleException($e);
		}
	}


	/**
	 * Returns a not existing file name for pdf or image processing
	 * protected as of testing issues with static methods. (Actually
	 * it will be mocked partially) FIXME: Change this behaviour as soon as the buidlNotExistingFileName function is not static anymore
	 *
	 * @param FileInfo $fileInfo
	 * @return string
	 */
	protected function buildNewName(FileInfo $fileInfo) {
		// get rid of the .png or .pdf and so on
		$fileName = substr($fileInfo->getName(), 0, -4);
		// eliminate the file name from the path
		$filePath = str_replace($fileInfo->getName(), '', $fileInfo->getPath());
		// and get the path on top of the user/files/ dir
		$filePath = str_replace('/' . $this->userId . '/files', '', $filePath);
		if ($fileInfo->getMimetype() === $this::MIMETYPE_PDF) {
			// PDFs:
			return Files::buildNotExistingFileName($filePath, $fileName . '_OCR.pdf');
		} else {
			// IMAGES:
			return Files::buildNotExistingFileName($filePath, $fileName . '_OCR.txt');
		}
	}

	/**
	 * Returns the fileInfo for each file in files and checks
	 * if it has a allowed mimetype and some other conditions.
	 *
	 * @param array $files
	 * @return array of Files\FileInfo
	 * @throws NotFoundException
	 */
	private function buildFileInfo(array $files) {
		try {
			$fileArray = array();
			foreach ($files as $file) {
				// Check if anything is missing and file type is correct
				if ((!empty($file['path']) || !empty($file['directory'])) && $file['type'] === 'file') {
					// get correct path
					$path = $this->getCorrectPath($file);
					$fileInfo = $this->view->getFileInfo($path);
					$this->checkMimeType($fileInfo);
					array_push($fileArray, $fileInfo);
				} else {
					throw new NotFoundException($this->l10n->t('Wrong path parameter.'));
				}
			}
			return $fileArray;
		} catch (Exception $e) {
			$this->handleException($e);
		}
	}

	/**
	 * Checks a Mimetype for a specific given FileInfo.
	 * @param Files\FileInfo $fileInfo
	 */
	private function checkMimeType(FileInfo $fileInfo) {
		try {
			if (!$fileInfo || !in_array($fileInfo->getMimetype(), $this::ALLOWED_MIMETYPES)) {
				$this->logger->debug('Getting FileInfo did not work or not included in the ALLOWED_MIMETYPES array.', ['app' => 'ocr']);
				throw new NotFoundException($this->l10n->t('Wrong parameters or wrong mimetype.'));
			}
		} catch (Exception $e) {
			$this->handleException($e);
		}
	}

	/**
	 * Returns the correct path based on delivered file variable
	 * @param $file
	 * @return string
	 */
	private function getCorrectPath($file) {
		if (empty($file['path'])) {
			//Because new updated files have the property directory instead of path
			$file['path'] = $file['directory'];
		}
		if ($file['path'] === '/') {
			$path = $file['path'] . $file['name'];
		} else {
			$path = $file['path'] . '/' . $file['name'];
		}
		return $path;
	}

	/**
	 * Handle the possible thrown Exceptions from all methods of this class.
	 *
	 * @param Exception $e
	 * @throws Exception
	 * @throws NotFoundException
	 */
	private function handleException($e) {
		$this->logger->logException($e, ['app' => 'ocr', 'message' => 'Exception during ocr service function processing']);
		if ($e instanceof NotFoundException) {
			throw new NotFoundException($e->getMessage());
		} else {
			throw $e;
		}
	}
}
