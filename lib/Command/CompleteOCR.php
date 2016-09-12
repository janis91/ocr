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

namespace OCA\Ocr\Command;

use Exception;
use OCA\Ocr\Service\OcrService;
use OCA\Ocr\Service\ServiceException;
use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\MultipleObjectsReturnedException;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Class CompleteOCR
 *
 * @package OCA\Ocr\Command
 */
class CompleteOCR extends Command {

	/**
	 * @var OcrService
	 */
	private $ocrService;

	/**
	 * UpdateStatus constructor.
	 */
	public function __construct(OcrService $ocrService) {
		parent::__construct();
		$this->ocrService = $ocrService;
	}

	/**
	 * Required Arguments configuration
	 */
	protected function configure() {
		$this->setName('ocr:complete')
			->addArgument(
				'status-id',
				InputArgument::REQUIRED,
				'status id, integer'
			)
			->addArgument(
				'failed',
				InputArgument::REQUIRED,
				'failed, boolean'
			)
			->setDescription('Console API for completion of the ocr processing of a file');
	}

	/**
	 * Executes the complete function of the OCRService
	 * @param InputInterface $input
	 * @param OutputInterface $output
	 */
	protected function execute(InputInterface $input, OutputInterface $output) {
		$statusId = $input->getArgument('status-id');
		$failed = $input->getArgument('failed');
		try {
			if ($failed === 'false') {
				$failed = false;
			} elseif ($failed === 'true') {
				$failed = true;
			} else {
				throw new ServiceException('Wrong Arguments.');
			}
			$this->ocrService->complete($statusId, $failed);
		} catch (Exception $e) {
			if ($e instanceof MultipleObjectsReturnedException || $e instanceof DoesNotExistException) {
				$output->writeln('<error>Could not complete ocr for status id ' . $statusId .
					': ' . $e->getMessage() .
					'</error> ');
			} else {
				$output->writeln('<error>Unexpected error for status id ' . $statusId .
					': ' . $e->getMessage() .
					'</error> ');
			}
		}
	}
}