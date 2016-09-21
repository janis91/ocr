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

use OCA\Ocr\Db\OcrStatus;
use OCA\Ocr\Service\NotFoundException;
use OCA\Ocr\Service\OcrService;
use OCA\Ocr\Tests\TestCase;


class OcrServiceTest extends TestCase {

	private $logger;

	private $tempM;

	private $config;

	private $queueService;

	private $statusMapper;

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
		$this->config = $this->getMockBuilder('OCP\IConfig')
			->disableOriginalConstructor()
			->getMock();
		$this->queueService = $this->getMockBuilder('OCA\Ocr\Service\QueueService')
			->disableOriginalConstructor()
			->getMock();
		$this->statusMapper = $this->getMockBuilder('OCA\Ocr\Db\OcrStatusMapper')
			->disableOriginalConstructor()
			->getMock();
		$this->view = $this->getMockBuilder('OC\Files\View')
			->disableOriginalConstructor()
			->getMock();
		$this->l10n = $this->getMockBuilder('OCP\IL10N')
			->disableOriginalConstructor()
			->getMock();

		//FIXME: only necessary because of the static function buildNotExistingFileName... change if not necessary anymore
		$this->service = $this->getMockBuilder('OCA\Ocr\Service\OcrService')
			->setConstructorArgs([$this->tempM, $this->config, $this->queueService, $this->statusMapper, $this->view, $this->userId, $this->l10n, $this->logger])
			->setMethods(array('buildNewName'))
			->getMock();
	}

	// tesseract is installed so there should be a array with at least 'eng' in the array
	public function testListLanguages(){
		$result = $this->service->listLanguages();
		$this->assertTrue(in_array('eng',$result));
	}


	// FIXME: status() is not possbile to test, because it uses global functions like file_exists().

	/**
	 * returns nothing
	 */
	public function testComplete(){
		$status = OcrStatus::fromRow([
			'id' => 3,
			'status' => 'PENDING',
			'file_id' => 4,
			'new_name' => 'new',
			'temp_file' => 'temp',
			'user_id' => $this->userId,
			'type' => 'tess'
		]);

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
		$status = OcrStatus::fromRow([
			'id' => 3,
			'status' => 'PENDING',
			'file_id' => 4,
			'new_name' => 'new',
			'temp_file' => 'temp',
			'user_id' => $this->userId,
			'type' => 'tess'
		]);

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


	public function testProcess(){
		// {"id":325,"name":"peter.pdf","mimetype":"application\/pdf","mtime":1474450696000,"type":"file","size":103819,"etag":"e7195348f44aca1ad8d81ff6c8b6ea43","permissions":27,"hasPreview":false,"path":"\/","tags":[],"sharePermissions":"19"}
		$files = array (
			0 => array(
			'id' => 325,
			'name' => 'picture.png',
			'mimetype' => 'image/png',
			'mtime' => 1474450696000,
			'type' => 'file',
			'size' => 103819,
			'etag' => 'e7195348f44aca1ad8d81ff6c8b6ea43',
			'permissions' => 27,
			'hasPreview' => false,
			'path' => '/',
			'tags' =>
				array (
				),
			'sharePermissions' => '19',
		));

		$fileInfo = $this->getMockBuilder('OC\Files\FileInfo')
			->disableOriginalConstructor()
			->getMock();

		$fileInfo->expects($this->any())
			->method('getId')
			->will($this->returnValue(325));

		$fileInfo->expects($this->any())
			->method('getPath')
			->will($this->returnValue('/'));

		$fileInfo->expects($this->any())
			->method('getMimeType')
			->will($this->returnValue('image/png'));

		$fileInfo->expects($this->any())
			->method('getName')
			->will($this->returnValue('picture.png'));

		$this->service->expects($this->any())
			->method('buildNewName')
			->with($this->equalTo($fileInfo))
			->will($this->returnValue('newName'));

		$status = new OcrStatus('PENDING', $fileInfo->getId(), 'newName', '/tmp/file', 'tess', $this->userId);

		$this->tempM->expects($this->once())
			->method('getTemporaryFile')
			->will($this->returnValue('/tmp/file'));

		$this->queueService->expects($this->once())
			->method('clientSend')
			->with($this->equalTo($status),
				$this->equalTo('/data'),
				$this->equalTo($fileInfo->getPath()),
				$this->equalTo('eng'),
				$this->equalTo(\OC::$SERVERROOT))
			->will($this->returnValue(true));

		$this->view->expects($this->once())
			->method('getFileInfo')
			->with($this->equalTo('/picture.png'))
			->will($this->returnValue($fileInfo));

		$this->config->expects($this->once())
			->method('getSystemValue')
			->with($this->equalTo('datadirectory'))
			->will($this->returnValue('/data'));

		$result = $this->service->process('eng', $files);

		$this->assertEquals('PROCESSING', $result);
	}

	/**
	 * @expectedException \OCA\Ocr\Service\NotFoundException
	 */
	public function testProcessEmptyPassedParameters(){
		// {"id":325,"name":"peter.pdf","mimetype":"application\/pdf","mtime":1474450696000,"type":"file","size":103819,"etag":"e7195348f44aca1ad8d81ff6c8b6ea43","permissions":27,"hasPreview":false,"path":"\/","tags":[],"sharePermissions":"19"}
		$files = array ();

		$fileInfo = $this->getMockBuilder('OC\Files\FileInfo')
			->disableOriginalConstructor()
			->getMock();

		$fileInfo->expects($this->any())
			->method('getId')
			->will($this->returnValue(325));

		$fileInfo->expects($this->any())
			->method('getPath')
			->will($this->returnValue('/'));

		$fileInfo->expects($this->any())
			->method('getMimeType')
			->will($this->returnValue('image/png'));

		$fileInfo->expects($this->any())
			->method('getName')
			->will($this->returnValue('picture.png'));

		$this->service->expects($this->any())
			->method('buildNewName')
			->with($this->equalTo($fileInfo))
			->will($this->returnValue('newName'));

		$status = new OcrStatus('PENDING', $fileInfo->getId(), 'newName', '/tmp/file', 'tess', $this->userId);

		$this->tempM->expects($this->any())
			->method('getTemporaryFile')
			->will($this->returnValue('/tmp/file'));

		$this->queueService->expects($this->any())
			->method('clientSend')
			->with($this->equalTo($status),
				$this->equalTo('/data'),
				$this->equalTo($fileInfo->getPath()),
				$this->equalTo('eng'),
				$this->equalTo(\OC::$SERVERROOT))
			->will($this->returnValue(true));

		$this->view->expects($this->any())
			->method('getFileInfo')
			->with($this->equalTo('/picture.png'))
			->will($this->returnValue($fileInfo));

		$this->config->expects($this->any())
			->method('getSystemValue')
			->with($this->equalTo('datadirectory'))
			->will($this->returnValue('/data'));

		$this->service->process('eng', $files);

	}

	/**
	 * @expectedException \OCA\Ocr\Service\NotFoundException
	 */
	public function testProcessEmptyPassedParametersTwo(){
		// {"id":325,"name":"peter.pdf","mimetype":"application\/pdf","mtime":1474450696000,"type":"file","size":103819,"etag":"e7195348f44aca1ad8d81ff6c8b6ea43","permissions":27,"hasPreview":false,"path":"\/","tags":[],"sharePermissions":"19"}
		$files = array (
			0 => array(
				'id' => 325,
				'name' => 'picture.png',
				'mimetype' => 'image/png',
				'mtime' => 1474450696000,
				'type' => 'file',
				'size' => 103819,
				'etag' => 'e7195348f44aca1ad8d81ff6c8b6ea43',
				'permissions' => 27,
				'hasPreview' => false,
				'path' => '/',
				'tags' =>
					array (
					),
				'sharePermissions' => '19',
			));

		$fileInfo = $this->getMockBuilder('OC\Files\FileInfo')
			->disableOriginalConstructor()
			->getMock();

		$fileInfo->expects($this->any())
			->method('getId')
			->will($this->returnValue(325));

		$fileInfo->expects($this->any())
			->method('getPath')
			->will($this->returnValue('/'));

		$fileInfo->expects($this->any())
			->method('getMimeType')
			->will($this->returnValue('image/png'));

		$fileInfo->expects($this->any())
			->method('getName')
			->will($this->returnValue('picture.png'));

		$this->service->expects($this->any())
			->method('buildNewName')
			->with($this->equalTo($fileInfo))
			->will($this->returnValue('newName'));

		$status = new OcrStatus('PENDING', $fileInfo->getId(), 'newName', '/tmp/file', 'tess', $this->userId);

		$this->tempM->expects($this->any())
			->method('getTemporaryFile')
			->will($this->returnValue('/tmp/file'));

		$this->queueService->expects($this->any())
			->method('clientSend')
			->with($this->equalTo($status),
				$this->equalTo('/data'),
				$this->equalTo($fileInfo->getPath()),
				$this->equalTo('eng'),
				$this->equalTo(\OC::$SERVERROOT))
			->will($this->returnValue(true));

		$this->view->expects($this->any())
			->method('getFileInfo')
			->with($this->equalTo('/picture.png'))
			->will($this->returnValue($fileInfo));

		$this->config->expects($this->any())
			->method('getSystemValue')
			->with($this->equalTo('datadirectory'))
			->will($this->returnValue('/data'));

		$this->service->process('', $files);

	}


	/**
	 * @expectedException \OCA\Ocr\Service\NotFoundException
	 */
	public function testProcessWrongPath(){
		// {"id":325,"name":"peter.pdf","mimetype":"application\/pdf","mtime":1474450696000,"type":"file","size":103819,"etag":"e7195348f44aca1ad8d81ff6c8b6ea43","permissions":27,"hasPreview":false,"path":"\/","tags":[],"sharePermissions":"19"}
		$files = array (
			0 => array(
				'id' => 325,
				'name' => 'picture.png',
				'mimetype' => 'image/png',
				'mtime' => 1474450696000,
				'type' => 'file',
				'size' => 103819,
				'etag' => 'e7195348f44aca1ad8d81ff6c8b6ea43',
				'permissions' => 27,
				'hasPreview' => false,
				'tags' =>
					array (
					),
				'sharePermissions' => '19',
			));

		$fileInfo = $this->getMockBuilder('OC\Files\FileInfo')
			->disableOriginalConstructor()
			->getMock();

		$fileInfo->expects($this->any())
			->method('getId')
			->will($this->returnValue(325));

		$fileInfo->expects($this->any())
			->method('getPath')
			->will($this->returnValue('/'));

		$fileInfo->expects($this->any())
			->method('getMimeType')
			->will($this->returnValue('image/png'));

		$fileInfo->expects($this->any())
			->method('getName')
			->will($this->returnValue('picture.png'));

		$this->service->expects($this->any())
			->method('buildNewName')
			->with($this->equalTo($fileInfo))
			->will($this->returnValue('newName'));

		$status = new OcrStatus('PENDING', $fileInfo->getId(), 'newName', '/tmp/file', 'tess', $this->userId);

		$this->tempM->expects($this->any())
			->method('getTemporaryFile')
			->will($this->returnValue('/tmp/file'));

		$this->queueService->expects($this->any())
			->method('clientSend')
			->with($this->equalTo($status),
				$this->equalTo('/data'),
				$this->equalTo($fileInfo->getPath()),
				$this->equalTo('eng'),
				$this->equalTo(\OC::$SERVERROOT))
			->will($this->returnValue(true));

		$this->view->expects($this->any())
			->method('getFileInfo')
			->with($this->equalTo('/picture.png'))
			->will($this->returnValue($fileInfo));

		$this->config->expects($this->any())
			->method('getSystemValue')
			->with($this->equalTo('datadirectory'))
			->will($this->returnValue('/data'));

		$this->service->process('eng', $files);

	}
}