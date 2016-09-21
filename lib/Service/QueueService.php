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
use OCA\Ocr\Db\OcrStatus;
use OCA\Ocr\Db\OcrStatusMapper;
use OCP\IL10N;
use OCP\ILogger;

class QueueService {

	private $mapper;

	private $logger;

	private $l10n;

	public function __construct(OcrStatusMapper $mapper, IL10N $l10n, ILogger $logger) {
		$this->mapper = $mapper;
		$this->logger = $logger;
		$this->l10n = $l10n;
	}

	/**
	 * Checks if a worker is active and registered the message queue.
	 * returns false if not.
	 * @return boolean|null
	 */
	public function workerExists() {
		try {
			return msg_queue_exists(21671);
		} catch (Exception $e) {
			$this->handleException($e);
		}
	}

	/**
	 * Inits the client and sends the task to the background worker (async)
	 *
	 * @param OcrStatus $status
	 * @param string $datadirectory
	 * @param string $path
	 * @param string $language
	 * @param string $occDir
	 */
	public function clientSend($status, $datadirectory, $path, $language, $occDir) {
		try {
			if($this->workerExists()) {
				$this->mapper->insert($status);
				$queue = msg_get_queue(21671);
				$msg = json_encode(array(
					'type' => $status->getType(),
					'datadirectory' => $datadirectory,
					'path' => $path,
					'tempfile' => $status->getTempFile(),
					'language' => $language,
					'statusid' => $status->getId(),
					'occdir' => $occDir
				));
				if (msg_send($queue, 1, $msg)) {
					$this->logger->debug('Client message: ' . json_encode($msg), ['app' => 'ocr']);
				} else {
					$this->mapper->delete($status);
					throw new NotFoundException($this->l10n->t('Could not add files to the ocr processing queue.'));
				}
			} else {
				$this->logger->debug('Worker detection failed after first check was complete: Did you stop the worker in between?', ['app' => 'ocr']);
				throw new NotFoundException($this->l10n->t('No ocr worker exists.'));
			}
		} catch (Exception $e) {
			exec('rm ' . $status->getTempFile());
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
		$this->logger->logException($e, ['app' => 'ocr', 'message' => 'Exception during message queue processing']);
		if ($e instanceof NotFoundException) {
			throw new NotFoundException($e->getMessage());
		} else {
			throw $e;
		}
	}

}