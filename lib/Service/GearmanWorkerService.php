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
use OCP\IL10N;
use OCP\ILogger;

/**
 * Class GearmanWorkerService
 *
 * @package OCA\Ocr\Service
 */
class GearmanWorkerService {

	/**
	 * @var ILogger
	 */
	private $logger;

	/**
	 * @var IL10N
	 */
	private $l10n;

	/**
	 * GearmanWorkerService constructor.
	 *
	 * @param IL10N $l10n
	 * @param ILogger $logger
	 */
	public function __construct(IL10N $l10n, ILogger $logger) {
		$this->logger = $logger;
		$this->l10n = $l10n;
	}

	/**
	 * Checks if a worker is active and registered at the Gearman Job Server.
	 * returns false if not.
	 * @return boolean|null
	 */
	public function workerExists() {
		try {
			$checkCommand = 'gearadmin -h 127.0.0.1 -p 4730 --workers 2>&1';
			exec($checkCommand, $result, $success);
			if ($success !== 0) {
				throw new NotFoundException($this->l10n->t('Gearman worker detection failed.'));
			}
			// look into the resulting array. 3 because first row is the ps checking command, second row is the grep command separated from the ps and 3rd or more has to be the GearmanOCRWorker.php.
			foreach ($result as $res) {
				if (strpos($res, 'ocr') !== false) {
					$this->logger->debug('Worker found.', ['app' => 'ocr']);
					return true;
				}
			}
			$this->logger->debug('No worker found.', ['app' => 'ocr']);
			return false;
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
		$this->logger->logException($e, ['app' => 'ocr', 'message' => 'Exception during gearman worker service function processing']);
		if ($e instanceof NotFoundException) {
			throw new NotFoundException($e->getMessage());
		} else {
			throw $e;
		}
	}

}