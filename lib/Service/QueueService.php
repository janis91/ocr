<?php
/**
 * nextCloud - ocr
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */

namespace OCA\Ocr\Service;

use Exception;
use OCA\Ocr\Db\OcrStatus;
use OCA\Ocr\Db\OcrStatusMapper;
use OCP\IConfig;
use OCP\IL10N;
use OCP\ILogger;

/**
 * Class QueueService
 *
 * @package OCA\Ocr\Service
 */
class QueueService {

	/**
	 * @var IConfig
	 */
	private $config;

	/**
	 * @var OcrStatusMapper
	 */
	private $mapper;

	/**
	 * @var ILogger
	 */
	private $logger;

	/**
	 * @var IL10N
	 */
	private $l10n;

	/**
	 * @var resource
	 */
	private $queue;

	/**
	 * @var resource
	 */
	private $statusqueue;

	/**
	 * QueueService constructor.
	 *
	 * @param OcrStatusMapper $mapper
	 * @param IConfig $config
	 * @param IL10N $l10n
	 * @param ILogger $logger
	 */
	public function __construct(OcrStatusMapper $mapper, IConfig $config, IL10N $l10n, ILogger $logger) {
		$this->mapper = $mapper;
		$this->logger = $logger;
		$this->l10n = $l10n;
		$this->queue = msg_get_queue(21671);
		$this->statusqueue = msg_get_queue(27672);
		$this->config = $config;
	}

	/**
	 * Inits the client and sends the task to the background worker (async)
	 *
	 * @param OcrStatus $status
	 * @param string[] $languages
	 * @param string $occDir
	 */
	public function clientSend($status, $languages, $occDir) {
		try {
				$this->mapper->insert($status);
				$msg = json_encode(array(
					'type' => $status->getType(),
					'source' => $this->config->getSystemValue('datadirectory') . '/' . $status->getSource(),
					'tempfile' => $status->getTempFile(),
					'languages' => $languages,
					'statusid' => $status->getId(),
					'occdir' => $occDir
				));
				if (msg_send($this->queue, 1, $msg)) {
					$this->logger->debug('Client message: ' . $msg, ['app' => 'ocr']);
				} else {
					$this->mapper->delete($status);
					throw new NotFoundException($this->l10n->t('Could not add files to the OCR processing queue.'));
				}
		} catch (Exception $e) {
			exec('rm ' . $status->getTempFile());
			$status->setStatus('FAILED');
			$this->mapper->update($status);
			$this->handleException($e);
		}
	}

	/**
	 * TODO: in the future this function could be used to give an admin information
	 * Counts the messages in the message queue.
	 *
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

	/**
	 * TODO: in the future this function could be used to give an admin information
	 * Counts the at this point processed files
	 *
	 * @return mixed
	 */
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