<?php

/**
 * Nextcloud - OCR
 * This file is licensed under the Affero General Public License version 3 or
 * later.
 * See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2020
 */

namespace OCA\Ocr\Tests\Php\Unit\Migration;


use GuzzleHttp\RequestOptions;
use OC\IntegrityCheck\Helpers\FileAccessHelper;
use OCA\Ocr\Constants\OcrConstants;
use OCA\Ocr\Migration\FetchTessdata;
use OCA\Ocr\Tests\Php\Unit\TestCase;
use OCA\Ocr\Util\FetchTessdataUtil;
use OCP\Files\IAppData;
use OCP\Files\NotPermittedException;
use OCP\Http\Client\IClientService;
use OCP\ITempManager;
use OCP\Migration\IOutput;

class FetchTessdataTest extends TestCase {
	/** @var IOutput|MockObject */
	private $output;
	/** @var IAppData|MockObject */
	private $appData;
	/** @var ITempManager|MockObject */
	private $tempManager;
	/** @var IClientService|MockObject */
	private $clientService;
	/** @var FileAccessHelper|MockObject */
	private $fileAccessHelper;
	/** @var FetchTessdataUtil|MockObject */
	private $fetchTessdataUtil;
	/** @var FetchTessdata */
	private $repairStep;

	protected function setUp() {
		parent::setUp();
		$this->appData = $this->getMockBuilder('OCP\Files\IAppData')
			->getMock();
		$this->output = $this->getMockBuilder('OCP\Migration\IOutput')
			->getMock();
		$this->tempManager = $this->getMockBuilder('OCP\ITempManager')
			->getMock();
		$this->clientService = $this->getMockBuilder('OCP\Http\Client\IClientService')
			->getMock();
		$this->fileAccessHelper = $this->getMockBuilder('OC\IntegrityCheck\Helpers\FileAccessHelper')
			->getMock();
		$this->fetchTessdataUtil = $this->getMockBuilder('OCA\Ocr\Util\FetchTessdataUtil')
			->disableOriginalConstructor()
			->getMock();
		$this->repairStep = new FetchTessdata($this->appData, $this->tempManager, $this->clientService, $this->fileAccessHelper, $this->fetchTessdataUtil);
	}

	public function testRun_WHEN_tessdata_folder_already_exists_and_traineddata_exists_THEN_finish_progress() {
		$file = $this->getMockBuilder('OCP\Files\SimpleFS\ISimpleFile')
			->getMock();
		$file->expects($this->once())
			->method('getName')
			->will($this->returnValue("eng.traineddata.gz"));
		$folder = $this->getMockBuilder('OCP\Files\SimpleFS\ISimpleFolder')
			->getMock();
		$folder->expects($this->once())
			->method('getDirectoryListing')
			->will($this->returnValue([$file]));
		$this->appData->expects($this->once())
			->method('getFolder')
			->with(OcrConstants::TESSDATA_FOLDER)
			->will($this->returnValue($folder));

		$this->repairStep->run($this->output);
	}

	public function testRun_WHEN_tessdata_folder_not_exists_and_traineddata_not_exists_THEN_download_extract_and_finish_progress() {
		$folder = $this->getMockBuilder('OCP\Files\SimpleFS\ISimpleFolder')
			->getMock();
		$folder->expects($this->once())
			->method('getDirectoryListing')
			->will($this->returnValue([]));
		$this->appData->expects($this->once())
			->method('getFolder')
			->with(OcrConstants::TESSDATA_FOLDER)
			->will($this->returnValue($folder));
		$this->tempManager->expects($this->once())
			->method('getTemporaryFile')
			->with('.tar.gz')
			->will($this->returnValue('/tmp/temp.tar.gz'));
		$client = $this->getMockBuilder('OCP\Http\Client\IClient')
			->getMock();
		$this->clientService->expects($this->once())
			->method('newClient')
			->will($this->returnValue($client));
		$client->expects($this->once())
			->method('get')
			->with(OcrConstants::TESSDATA_DOWNLOAD_URL, ['save_to' => '/tmp/temp.tar.gz', RequestOptions::TIMEOUT => 600, RequestOptions::CONNECT_TIMEOUT => 10]);
		$this->tempManager->expects($this->once())
			->method('getTemporaryFolder')
			->will($this->returnValue('/tmp/temp/'));
		$this->fetchTessdataUtil->expects($this->once())
			->method('extract')
			->with($this->isInstanceOf('OC\Archive\TAR'), '/tmp/temp/');
		$this->fetchTessdataUtil->expects($this->once())
			->method('verify')
			->with('/tmp/temp/')
			->will($this->returnValue(['eng.traineddata.gz', 'deu.traineddata.gz']));
		$folder->expects($this->exactly(2))
			->method('fileExists')
			->withConsecutive([
				'eng.traineddata.gz'
			], [
				'deu.traineddata.gz'
			])
			->will($this->onConsecutiveCalls(false, false));
		$file1 = $this->getMockBuilder('OCP\Files\SimpleFS\ISimpleFile')
			->getMock();
		$file2 = $this->getMockBuilder('OCP\Files\SimpleFS\ISimpleFile')
			->getMock();
		$folder->expects($this->exactly(2))
			->method('newFile')
			->withConsecutive([
				'eng.traineddata.gz'
			], [
				'deu.traineddata.gz'
			])
			->will($this->onConsecutiveCalls($file1, $file2));
		$this->fileAccessHelper->expects($this->exactly(2))
			->method('file_get_contents')
			->withConsecutive([
				'/tmp/temp/tessdata/eng.traineddata.gz'
			], [
				'/tmp/temp/tessdata/deu.traineddata.gz'
			])
			->will($this->onConsecutiveCalls('file1', 'file2'));
		$file1->expects($this->once())
			->method('putContent')
			->with('file1');
		$file2->expects($this->once())
			->method('putContent')
			->with('file2');
		$this->tempManager->expects($this->once())
			->method('clean');

		$this->repairStep->run($this->output);
	}

	public function testRun_GIVEN_getTemporaryFile_throws_Exception_WHEN_tessdata_folder_not_exists_and_traineddata_not_exists_THEN_download_extract_and_finish_progress() {
		$this->expectException(NotPermittedException::class);

		$folder = $this->getMockBuilder('OCP\Files\SimpleFS\ISimpleFolder')
			->getMock();
		$folder->expects($this->once())
			->method('getDirectoryListing')
			->will($this->returnValue([]));
		$this->appData->expects($this->once())
			->method('getFolder')
			->with(OcrConstants::TESSDATA_FOLDER)
			->will($this->returnValue($folder));
		$this->tempManager->expects($this->once())
			->method('getTemporaryFile')
			->with('.tar.gz')
			->will($this->throwException(new NotPermittedException()));
		$this->tempManager->expects($this->once())
			->method('clean');

		$this->repairStep->run($this->output);
	}
}
