<?php
/**
 * ownCloud - ocr
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2016
 */

namespace OCA\Ocr\Controller;

use PHPUnit_Framework_TestCase;
use OCP\AppFramework\Http\JSONResponse;

/**
 * Class OcrControllerTest
 * The process method can not be tested.
 * There is too much file I/O and CLI
 * behaviour in it.
 * @package OCA\Ocr\Controller
 */
class OcrControllerTest extends PHPUnit_Framework_TestCase {

	private $controller;
	private $userId = 'john';

	public function setUp() {
		$request = $this->getMockBuilder('OCP\IRequest')->getMock();
		$logger = $this->getMockBuilder('\OCP\ILogger')->getMock();
		$config = $this->getMockBuilder('\OCP\IConfig')->getMock();

		$this->controller = new OcrController(
			'ocr', $request, $this->userId, $logger, $config
		);
	}

	/**
	 * @requires OS Linux
	 * depends on a installed tesseract-ocr
	 * and at least one installed language pack
	 * @covers Controller::languages()
	 */
	public function testLanguages() {
		$result = $this->controller->languages();
		$this->assertTrue($result instanceof JSONResponse);
		// the JSONResponse has an array with the key languages
		$this->assertArrayHasKey('languages', $result->getData());
		// the Array of languages holds at least one string
		$this->assertNotEmpty($result->getData()['languages']);
		//the strings in the languages Array is exact 3 characters long
		for($i=1; $i < count($result->getData()['languages']); $i++){
			$this->assertRegExp('/[a-z]{3}/',$result->getData()['languages'][$i]);
		}
	}


}