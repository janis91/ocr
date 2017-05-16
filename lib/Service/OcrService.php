<?php
/**
 * nextCloud - OCR
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */

namespace OCA\Ocr\Service;

use Exception;
use OC\Files\View;
use OCA\Ocr\Db\FileMapper;
use OCA\Ocr\Db\File;
use OCA\Ocr\Db\OcrStatus;
use OCA\Ocr\Db\OcrStatusMapper;
use OCA\Ocr\Db\ShareMapper;
use OCP\AppFramework\Db\DoesNotExistException;
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
	 * @var QueueService
	 */
	private $queueService;

	/**
	 * @var OcrStatusMapper
	 */
	private $statusMapper;

	/**
	 * @var FileMapper
	 */
	private $fileMapper;

	/**
	 * @var ShareMapper
	 */
	private $shareMapper;

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
	 * Array of allowed MIME types for OCR processing
	 */
	const ALLOWED_MIMETYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/tiff', 'image/jp2', 'image/jpm', 'image/jpx', 'image/webp', 'image/gif'];

	/**
	 * The correct MIME type for a PDF file
	 */
	const MIMETYPE_PDF = 'application/pdf';

	/**
	 * The only allowed image MIME types by tesseract
	 */
	const MIMETYPES_IMAGE = ['image/png', 'image/jpeg', 'image/tiff', 'image/jp2', 'image/jpm', 'image/jpx', 'image/webp', 'image/gif'];

	/**
	 * OcrService constructor.
	 *
	 * @param ITempManager $tempManager
	 * @param QueueService $queueService
	 * @param OcrStatusMapper $mapper
	 * @param View $view
	 * @param $userId
	 * @param IL10N $l10n
	 * @param ILogger $logger
	 */
	public function __construct(ITempManager $tempManager, QueueService $queueService, OcrStatusMapper $mapper, FileMapper $fileMapper, ShareMapper $shareMapper, View $view, $userId, IL10N $l10n, ILogger $logger) {
		$this->logger = $logger;
		$this->tempM = $tempManager;
		$this->queueService = $queueService;
		$this->statusMapper = $mapper;
		$this->view = $view;
		$this->userId = $userId;
		$this->l10n = $l10n;
		$this->fileMapper = $fileMapper;
		$this->shareMapper = $shareMapper;
	}

	/**
	 * Gets the list of all available tesseract-ocr languages.
	 *
	 * @return string[] Languages
	 */
	public function listLanguages() {
		try {
			$success = -1;
			$this->logger->debug('Fetching languages. ', ['app' => 'ocr']);
			exec('tesseract --list-langs 2>&1', $result, $success);
			$this->logger->debug('Result for list-language command: ' . json_encode($result), ['app' => 'ocr']);
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
	 * Processes and prepares the files for OCR.
	 * Sends the stuff to the client in order to OCR async.
	 *
	 * @param string[] $languages
	 * @param array $files
	 * @return string
	 */
	public function process($languages, $files) {
		try {
			$this->logger->debug('Will now process files: ' . json_encode($files) . ' with languages: ' . json_encode($languages), ['app' => 'ocr']);
			// Check if files and language not empty
			if (!empty($files) && !empty($languages) && count(array_diff($languages, $this->listLanguages())) === 0) {

				$fileInfo = $this->buildFileInfo($files);

				foreach ($fileInfo as $fInfo) {
					// Check if filelock existing
					// TODO: FileLock maybe \OC\Files\View::lockFile()
					// Check Shared
					$source = $fInfo->getPath();
					if ($this->checkSharedWithInitiator($fInfo)) {
						// Shared Item
						$source = str_replace('home::', '', $fInfo->getStoragename()) . '/' . $source;
						$target = $this->buildTargetForShared($fInfo);
					} else {
						// Not Shared
						$source = $this->userId . '/' . $source;
						$target = $this->buildTarget($fInfo);
					}

					// create a temp file for ocr processing purposes
					$tempFile = $this->tempM->getTemporaryFile();

					// set the running type
					if ($fInfo->getMimetype() === $this::MIMETYPE_PDF) {
						$ftype = 'mypdf';
					} else {
						$ftype = 'tess';
					}
					// Create status object
					$status = new OcrStatus('PENDING', $source, $target, $tempFile, $ftype, $this->userId, false);
					// Init client and send task / job
					// Feed the worker
					$this->queueService->clientSend($status, $languages, \OC::$SERVERROOT);
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
	 * @param integer $statusId
	 * @param boolean $failed
	 * @param string $errorMessage
	 */
	public function complete($statusId, $failed, $errorMessage) {
		try {
			$status = $this->statusMapper->find($statusId);
			if (!$failed) {
				$status->setStatus('PROCESSED');
				$this->statusMapper->update($status);
			} else {
				$status->setStatus('FAILED');
				$this->statusMapper->update($status);
				$this->logger->error($errorMessage, ['app' => 'ocr']);
			}
		} catch (Exception $e) {
			$this->handleException($e);
		}
	}

	/**
	 * The PersonalSettingsController will have the opportunity to delete ocr status objects.
	 *
	 * @param $statusId
	 * @param string $userId
	 * @return OcrStatus
	 */
	public function deleteStatus($statusId, $userId) {
		try {
			$status = $this->statusMapper->find($statusId);
			if ($status->getUserId() !== $userId) {
				throw new NotFoundException($this->l10n->t('Cannot delete. Wrong owner.'));
			} else {
				$status = $this->statusMapper->delete($status);
			}
			$status->setTarget($this->removeFileExtension($status));
			$status->setSource(null);
			$status->setTempFile(null);
			$status->setType(null);
			$status->setErrorDisplayed(null);
			return $status;
		} catch (Exception $e) {
			if ($e instanceof DoesNotExistException) {
				$ex = new NotFoundException($this->l10n->t('Cannot delete. Wrong ID.'));
				$this->handleException($ex);
			} else {
				$this->handleException($e);
			}
		}
	}

	/**
	 * Gets all status objects for a specific user in order to list them on the personal settings page.
	 *
	 * @param string $userId
	 * @return array
	 */
	public function getAllForPersonal($userId) {
		try {
			$status = $this->statusMapper->findAll($userId);
			$statusNew = array();
			for ($x = 0; $x < count($status); $x++) {
				$newName = $this->removeFileExtension($status[$x]);
				$status[$x]->setTarget($newName);
				$status[$x]->setSource(null);
				$status[$x]->setTempFile(null);
				$status[$x]->setType(null);
				$status[$x]->setErrorDisplayed(null);
				array_push($statusNew, $status[$x]);
			}
			return $statusNew;
		} catch (Exception $e) {
			$this->handleException($e);
		}
	}

	/**
	 * Returns a not existing file name for pdf or image processing
	 * protected as of testing issues with static methods. (Actually
	 * it will be mocked partially) FIXME: Change this behaviour as soon as the buidlNotExistingFileName function is not static anymore
	 * @codeCoverageIgnore
	 *
	 * @param File $fileInfo
	 * @return string
	 */
	protected function buildTargetForShared(File $fileInfo) {
		try {
			$share = $this->shareMapper->find($fileInfo->getFileid(), $this->userId, str_replace('home::', '', $fileInfo->getStoragename()));

			// get rid of the .png or .pdf and so on
			$fileName = substr($share->getFileTarget(), 0 , (strrpos($share->getFileTarget(), '.'))); // '/thedom.png' => '/thedom' || '/Test/thedom.png' => '/Test/thedom'

			// remove everything in front of and including of the first appearance of a slash from behind
			$fileName = substr(strrchr($fileName, "/"), 1); // '/thedom' => 'thedom' || '/Test/thedom' => 'thedom'

			// eliminate the file name from the path
			$filePath = dirname($share->getFileTarget()); // '/thedom.png' => '/' || '/Test/thedom.png' => '/Test'

			// replace the first slash
			$pos = strpos($filePath, '/');
			if ($pos !== false) {
				$filePath = substr_replace($filePath, '', $pos, strlen('/')); // '/' => '' || '/Test/' => 'Test'
			}

			if ($fileInfo->getMimetype() === $this::MIMETYPE_PDF) {
				// PDFs:
				return \OCP\Files::buildNotExistingFileName($filePath, $fileName . '_OCR.pdf');
			} else {
				// IMAGES:
				return \OCP\Files::buildNotExistingFileName($filePath, $fileName . '_OCR.txt');
			}
		} catch (Exception $e) {
			$this->handleException($e);
		}
	}

	/**
	 * Returns a not existing file name for PDF or image processing
	 * protected as of testing issues with static methods. (Actually
	 * it will be mocked partially) FIXME: Change this behaviour as soon as the buidlNotExistingFileName function is not static anymore
	 * @codeCoverageIgnore
	 *
	 * @param File $fileInfo
	 * @return string
	 */
	protected function buildTarget(File $fileInfo) {
		try {
			// get rid of the .png or .pdf and so on
			$fileName = substr($fileInfo->getName(), 0 , (strrpos($fileInfo->getName(), '.'))); // 'thedom.png' => 'thedom'

			// eliminate the file name from the path
			$filePath = str_replace($fileInfo->getName(), '', $fileInfo->getPath()); // 'files/Test/thedom.png' => 'files/Test/' || 'files/thedom.png' => 'files/'

			// and get the path on top of the files/ dir
			$filePath = str_replace('files', '', $filePath); // 'files/Test/' => '/Test/' || 'files/' => '/'

			// remove the last slash
			$filePath = substr_replace($filePath, '', strrpos($filePath, '/'), strlen('/')); // '/Test/' => '/Test' || '/' => ''

			// replace the first slash
			$pos = strpos($filePath, '/');
			if ($pos !== false) {
				$filePath = substr_replace($filePath, '', $pos, strlen('/')); // '/Test' => '// 'Test' || '/' => ''
			}

			if ($fileInfo->getMimetype() === $this::MIMETYPE_PDF) {
				// PDFs:
				return \OCP\Files::buildNotExistingFileName($filePath, $fileName . '_OCR.pdf');
			} else {
				// IMAGES:
				return \OCP\Files::buildNotExistingFileName($filePath, $fileName . '_OCR.txt');
			}
		} catch (Exception $e) {
			$this->handleException($e);
		}
	}


	/**
	 * Returns the fileInfo for each file in files and checks
	 * if it has a allowed MIME type and some other conditions.
	 *
	 * @param array $files
	 * @return File[]
	 * @throws NotFoundException
	 */
	private function buildFileInfo($files) {
		try {
			$fileArray = array();
			foreach ($files as $file) {
				// Check if anything is missing and file type is correct
				if (!empty($file['id'])) {

					$fileInfo = $this->fileMapper->find($file['id']);
					$this->checkMimeType($fileInfo);

					array_push($fileArray, $fileInfo);
				} else {
					throw new NotFoundException($this->l10n->t('Wrong parameter.'));
				}
			}
			return $fileArray;
		} catch (Exception $e) {
			$this->handleException($e);
		}
	}

	/**
	 * Checks a MIME type for a specifically given FileInfo.
	 * @param File $fileInfo
	 */
	private function checkMimeType(File $fileInfo) {
		try {
			if (!$fileInfo || !in_array($fileInfo->getMimetype(), $this::ALLOWED_MIMETYPES)) {
				$this->logger->debug('Getting FileInfo did not work or not included in the ALLOWED_MIMETYPES array.', ['app' => 'ocr']);
				throw new NotFoundException($this->l10n->t('Wrong MIME type.'));
			}
		} catch (Exception $e) {
			$this->handleException($e);
		}
	}

	/**
	 * @param File $fileInfo
	 * @return boolean|null
	 */
	private function checkSharedWithInitiator($fileInfo) {
		try {
			$owner = str_replace('home::', '', $fileInfo->getStoragename());
			if ($this->userId === $owner) {
				// user is owner (no shared file)
				return false;
			} else {
				// user is not owner (shared file)
				return true;
			}
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
					$this->view->file_put_contents($status->getTarget(), file_get_contents($status->getTempFile() . '.txt')); // need .txt because tesseract saves it like this
					// Cleaning temp files
					$this->statusMapper->delete($status);
					exec('rm ' . $status->getTempFile() . '.txt');
				} elseif ($status->getType() === 'mypdf' && file_exists($status->getTempFile())) {
					//Save the tmp file with newname
					$this->view->file_put_contents($status->getTarget(), file_get_contents($status->getTempFile())); // don't need to extend with .pdf / it uses the tmp file to save
					$this->statusMapper->delete($status);
					exec('rm ' . $status->getTempFile());
				} else {
					$status->setStatus('FAILED');
					$this->statusMapper->update($status);
					throw new NotFoundException($this->l10n->t('Temp file does not exist.'));
				}
			}
			return $processed;
		} catch (Exception $e) {
			$this->handleException($e);
		}
	}

	/**
	 * Removes ".txt" from the newName of a OCR status
	 *
	 * @param $status OcrStatus
	 * @return string
	 */
	private function removeFileExtension($status) {
		try {
			return substr($status->getTarget(), 0, strrpos($status->getTarget(), '_OCR'));
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
