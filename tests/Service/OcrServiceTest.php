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

namespace OCA\Ocr\Tests\Service;

use OCA\Ocr\Db\File;
use OCA\Ocr\Db\OcrStatus;
use OCA\Ocr\Service\NotFoundException;
use OCA\Ocr\Service\OcrService;
use OCA\Ocr\Tests\TestCase;
use OCP\AppFramework\Db\DoesNotExistException;


class OcrServiceTest extends TestCase {

	private $logger;

	private $tempM;

	private $config;

	private $queueService;

	private $statusMapper;

	private $fileMapper;

	private $shareMapper;

	private $view;

	private $userId = 'john';

	private $l10n;

	private $service;

	public function setUp() {
		$this->logger = $this->getMockBuilder('OCP\ILogger')
			->disableOriginalConstructor()
			->getMock();
		$this->tempM = $this->getMockBuilder('OCP\ITempManager')
			->disableOriginalConstructor()
			->getMock();
		$this->queueService = $this->getMockBuilder('OCA\Ocr\Service\QueueService')
			->disableOriginalConstructor()
			->getMock();
		$this->statusMapper = $this->getMockBuilder('OCA\Ocr\Db\OcrStatusMapper')
			->disableOriginalConstructor()
			->getMock();
		$this->fileMapper = $this->getMockBuilder('OCA\Ocr\Db\FileMapper')
			->disableOriginalConstructor()
			->getMock();
		$this->shareMapper = $this->getMockBuilder('OCA\Ocr\Db\ShareMapper')
			->disableOriginalConstructor()
			->getMock();
		$this->view = $this->getMockBuilder('OC\Files\View')
			->disableOriginalConstructor()
			->getMock();
		$this->l10n = $this->getMockBuilder('OCP\IL10N')
			->disableOriginalConstructor()
			->getMock();

		$this->service = $this->getMockBuilder('OCA\Ocr\Service\OcrService')
			->setConstructorArgs([$this->tempM, $this->queueService, $this->statusMapper, $this->fileMapper, $this->shareMapper, $this->view, $this->userId, $this->l10n, $this->logger])
			->setMethods(array('buildTarget', 'buildTargetForShared'))
			->getMock();
	}

	// tesseract is installed so there should be a array with at least 'eng' in the array
	public function testListLanguages(){
		$result = $this->service->listLanguages();
		$this->assertTrue(in_array('eng',$result));
	}

	public function testDeleteStatus() {
		$status = OcrStatus::fromRow([
			'id' => 3,
			'status' => 'PENDING',
			'source' => 'new.png',
			'target' => 'new_OCR.txt',
			'temp_file' => 'temp',
			'user_id' => $this->userId,
			'type' => 'tess',
			'errorDisplayed' => false
		]);

		$expected = OcrStatus::fromRow([
			'id' => 3,
			'status' => 'PENDING',
			'source' => null,
			'target' => 'new',
			'temp_file' => null,
			'user_id' => $this->userId,
			'type' => null,
			'errorDisplayed' => null
		]);

		$this->statusMapper->expects($this->once())
			->method('find')
			->with($this->equalTo(3))
			->will($this->returnValue($status));

		$this->statusMapper->expects($this->once())
			->method('delete')
			->with($this->equalTo($status))
			->will($this->returnValue($status));

		$result = $this->service->deleteStatus(3, $this->userId);

		$this->assertEquals($expected->getId(), $result->getId());
		$this->assertEquals($expected->getTarget(), $result->getTarget());
		$this->assertEquals($expected->getType(), $result->getType());
		$this->assertEquals($expected->getUserId(), $result->getUserId());
	}

	/**
	 * @expectedException \OCA\Ocr\Service\NotFoundException
	 */
	public function testDeleteStatusDoesNotExist() {
		$this->statusMapper->expects($this->once())
			->method('find')
			->with($this->equalTo(3))
			->will($this->throwException(new DoesNotExistException('')));


		$result = $this->service->deleteStatus(3, $this->userId);
	}

	// FIXME: status() is not possbile to test, because it uses global functions like file_exists().

	public function testGetAllForPersonal() {
		$status = array(OcrStatus::fromRow([
			'id' => 3,
			'status' => 'PENDING',
			'source' => 'new.png',
			'target' => 'new_OCR.txt',
			'temp_file' => 'temp',
			'user_id' => $this->userId,
			'type' => 'tess',
			'errorDisplayed' => false
		]));

		$expected = array(OcrStatus::fromRow([
			'id' => 3,
			'status' => 'PENDING',
			'source' => null,
			'target' => 'new',
			'temp_file' => null,
			'user_id' => $this->userId,
			'type' => null,
			'errorDisplayed' => null
		]));

		$this->statusMapper->expects($this->once())
			->method('findAll')
			->with($this->equalTo($this->userId))
			->will($this->returnValue($status));

		$result = $this->service->getAllForPersonal($this->userId);

		$this->assertEquals($expected[0]->getId(), $result[0]->getId());
		$this->assertEquals($expected[0]->getTarget(), $result[0]->getTarget());
		$this->assertEquals($expected[0]->getType(), $result[0]->getType());
		$this->assertEquals($expected[0]->getUserId(), $result[0]->getUserId());
	}

	/**
	 * returns nothing
	 */
	public function testComplete(){
		$status = new OcrStatus('PENDING','new.png','new_OCR.txt','temp','tess',$this->userId,false);

		$this->statusMapper->expects($this->once())
			->method('find')
			->with($this->equalTo(3))
			->will($this->returnValue($status));

		$updatedStatus = $status;

		$updatedStatus->setStatus('PROCESSED');

		$this->statusMapper->expects($this->once())
			->method('update')
			->with($this->equalTo($updatedStatus))
			->will($this->returnValue($updatedStatus));

		$this->service->complete(3, false);
	}

	/**
	 * returns nothing
	 */
	public function testCompleteSetFailed(){
		$status = new OcrStatus('PENDING','new.png','new_OCR.txt','temp','tess',$this->userId,false);

		$this->statusMapper->expects($this->once())
			->method('find')
			->with($this->equalTo(3))
			->will($this->returnValue($status));

		$updatedStatus = $status;

		$updatedStatus->setStatus('FAILED');

		$this->statusMapper->expects($this->once())
			->method('update')
			->with($this->equalTo($updatedStatus))
			->will($this->returnValue($updatedStatus));

		$this->service->complete(3, true);
	}

	/**
	 * @expectedException \OCA\Ocr\Service\NotFoundException
	 */
	public function testCompleteFailure(){
		$this->statusMapper->expects($this->once())
			->method('find')
			->with($this->equalTo(3))
			->will($this->throwException(new NotFoundException('')));
		$this->service->complete(3, false);
	}


	public function testProcessShared(){
		// {"id":325}
		$files = array (
			0 => array(
			'id' => 325
		));

		$fileArray = array(new File(325, 'path', 'new.png', 'image/png', 'home::admin'));

		$this->fileMapper->expects($this->once())
			->method('find')
			->with($this->equalTo($files[0]['id']))
			->will($this->returnValue($fileArray[0]));

		$this->service->expects($this->once())
			->method('buildTargetForShared')
			->with($this->equalTo($fileArray[0]))
			->will($this->returnValue('new_OCR.txt'));

		$this->tempM->expects($this->once())
			->method('getTemporaryFile')
			->will($this->returnValue('/tmp/file'));

		$status = new OcrStatus('PENDING', 'admin/path', 'new_OCR.txt', '/tmp/file', 'tess', $this->userId, false);

		$this->queueService->expects($this->once())
			->method('clientSend')
			->with($this->equalTo($status),
				$this->equalTo('eng'),
				$this->equalTo(\OC::$SERVERROOT))
			->will($this->returnValue(true));

		$result = $this->service->process('eng', $files);

		$this->assertEquals('PROCESSING', $result);
	}

	public function testProcessNotShared(){
		// {"id":325}
		$files = array (
			0 => array(
				'id' => 325
			));

		$fileArray = array(new File(325, 'path', 'new.png', 'image/png', 'home::john'));

		$this->fileMapper->expects($this->once())
			->method('find')
			->with($this->equalTo($files[0]['id']))
			->will($this->returnValue($fileArray[0]));

		$this->service->expects($this->once())
			->method('buildTarget')
			->with($this->equalTo($fileArray[0]))
			->will($this->returnValue('new_OCR.txt'));

		$this->tempM->expects($this->once())
			->method('getTemporaryFile')
			->will($this->returnValue('/tmp/file'));

		$status = new OcrStatus('PENDING', 'john/path', 'new_OCR.txt', '/tmp/file', 'tess', $this->userId, false);

		$this->queueService->expects($this->once())
			->method('clientSend')
			->with($this->equalTo($status),
				$this->equalTo('eng'),
				$this->equalTo(\OC::$SERVERROOT))
			->will($this->returnValue(true));

		$result = $this->service->process('eng', $files);

		$this->assertEquals('PROCESSING', $result);
	}

	/**
	 * @expectedException \OCA\Ocr\Service\NotFoundException
	 */
	public function testProcessWrongParameters(){
		$files = array ();

		$this->service->process('eng', $files);
	}

	/**
	 * @expectedException \OCA\Ocr\Service\NotFoundException
	 */
	public function testProcessWrongMimetypes(){
		// {"id":325}
		$files = array (
			0 => array(
				'id' => 325
			));

		$fileArray = array(new File(325, 'path', 'new.png', 'application/xhtml', 'home::admin'));

		$this->fileMapper->expects($this->once())
			->method('find')
			->with($this->equalTo($files[0]['id']))
			->will($this->returnValue($fileArray[0]));

		$this->service->process('eng', $files);
	}
	/**
	 * @expectedException \OCA\Ocr\Service\NotFoundException
	 */
	public function testProcessWrongParametersTwo(){
		// {"id":325}
		$files = array (
			0 => array(
				'id' => 325
			));

		$this->service->process('', $files);

	}
}