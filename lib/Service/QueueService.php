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

	private $queue;

	private $statusqueue;

	public function __construct(OcrStatusMapper $mapper, IL10N $l10n, ILogger $logger) {
		$this->mapper = $mapper;
		$this->logger = $logger;
		$this->l10n = $l10n;
		$this->queue = msg_get_queue(21671);
		$this->statusqueue = msg_get_queue(27672);
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
				$this->mapper->insert($status);

				$msg = json_encode(array(
					'type' => $status->getType(),
					'datadirectory' => $datadirectory,
					'path' => $path,
					'tempfile' => $status->getTempFile(),
					'language' => $language,
					'statusid' => $status->getId(),
					'occdir' => $occDir
				));
				if (msg_send($this->queue, 1, $msg)) {
					$this->logger->debug('Client message: ' . json_encode($msg), ['app' => 'ocr']);
				} else {
					$this->mapper->delete($status);
					throw new NotFoundException($this->l10n->t('Could not add files to the ocr processing queue.'));
				}
		} catch (Exception $e) {
			exec('rm ' . $status->getTempFile());
			$this->handleException($e);
		}
	}

	/**
	 * Counts the messages in the message queue.
	 * @return mixed
	 */
	public function countMessages() {
		try {
			$stats = msg_stat_queue($this->queue);
			$this->logger->debug('Current message count: ' . json_encode($stats['msg_qnum']), ['app' => 'ocr']);
			return $stats['msg_qnum'];
		} catch (Exception $e) {
			$this->handleException($e);
		}
	}

	public function countActiveProcesses() {
		try {
			$stats = msg_stat_queue($this->statusqueue);
			$this->logger->debug('Current active processing count: ' . json_encode($stats['msg_qnum']), ['app' => 'ocr']);
			return $stats['msg_qnum'];
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
		$this->logger->logException($e, ['app' => 'ocr', 'message' => 'Exception during message queue processing']);
		if ($e instanceof NotFoundException) {
			throw new NotFoundException($e->getMessage());
		} else {
			throw $e;
		}
	}

}