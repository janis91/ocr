<?php

/**
 * Nextcloud - OCR
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2019
 */

namespace OCA\Ocr\Tests\Unit\Controller;

use OCA\Ocr\Constants\OcrConstants;
use OCA\Ocr\Controller\PersonalSettingsController;
use OCA\Ocr\Tests\Unit\TestCase;
use OCP\AppFramework\Http;
use OCP\IConfig;
use OCP\ILogger;
use OCP\IRequest;
use PHPUnit\Framework\MockObject\MockObject;


class PersonalSettingsControllerTest extends TestCase {
	/**
	 * @var string
	 */
	private $appName = OcrConstants::APP_NAME;
	/**
	 * @var IRequest|MockObject
	 */
	private $request;
	/**
	 * @var IConfig|MockObject
	 */
	private $config;
	/**
	 * @var ILogger|MockObject
	 */
	private $logger;
	/**
	 * @var string
	 */
	private $userId = 'user';
	/**
	 * @var PersonalSettingsController
	 */
	private $cut;

	public function setUp() {
		$this->request = $this->getMockBuilder('OCP\IRequest')
			->getMock();
		$this->config = $this->getMockBuilder('OCP\IConfig')
			->getMock();
		$this->logger = $this->getMockBuilder('OCP\ILogger')
			->getMock();
		$this->cut = new PersonalSettingsController($this->appName, $this->request, $this->config, $this->logger, $this->userId);
	}

	public function testGet_WHEN_user_value_empty_THEN_returns_a_JSONResponse_OK_with_an_empty_array() {
		$this->config->expects($this->once())
			->method('getUserValue')
			->with($this->userId, OcrConstants::APP_NAME, 'favoriteLanguages')
			->will($this->returnValue(''));

		$result = $this->cut->get();

		$this->assertJSONResponse(Http::STATUS_OK, [], $result);
	}

	public function testGet_WHEN_user_value_deu_and_eng_THEN_returns_a_JSONResponse_OK_with_this_array() {
		$this->config->expects($this->once())
			->method('getUserValue')
			->with($this->userId, OcrConstants::APP_NAME, 'favoriteLanguages')
			->will($this->returnValue('["deu", "eng"]'));

		$result = $this->cut->get();

		$this->assertJSONResponse(Http::STATUS_OK, ['deu', 'eng'], $result);
	}

	public function testSet_GIVEN_null_THEN_returns_JSONResponse_400() {
		$result = $this->cut->set(null);

		$this->assertJSONResponse(Http::STATUS_BAD_REQUEST, '', $result);
	}

	public function testSet_GIVEN_invalid_JSON_string_THEN_returns_JSONResponse_400() {
		$result = $this->cut->set('<');

		$this->assertJSONResponse(Http::STATUS_BAD_REQUEST, '', $result);
	}

	public function testSet_GIVEN_JSON_object_THEN_returns_JSONResponse_400() {
		$result = $this->cut->set('{}');

		$this->assertJSONResponse(Http::STATUS_BAD_REQUEST, '', $result);
	}

	public function testSet_GIVEN_invalid_JSON_array_such_that_not_allowed_language_is_provided_THEN_returns_JSONResponse_400() {
		$result = $this->cut->set('["deu", "eng", "something"]');

		$this->assertJSONResponse(Http::STATUS_BAD_REQUEST, '', $result);
	}

	public function testSet_GIVEN_empty_JSON_array_THEN_returns_JSONResponse_OK_with_empty_array() {
		$this->config->expects($this->once())
			->method('deleteUserValue')
			->with($this->userId, OcrConstants::APP_NAME, 'favoriteLanguages')
			->will($this->returnValue(null));

		$result = $this->cut->set('[]');

		$this->assertJSONResponse(Http::STATUS_OK, [], $result);
	}

	public function testSet_GIVEN_valid_JSON_array_THEN_returns_JSONResponse_OK_with_this_array() {
		$this->config->expects($this->once())
			->method('setUserValue')
			->with($this->userId, OcrConstants::APP_NAME, 'favoriteLanguages', '["deu","eng"]')
			->will($this->returnValue(null));

		$result = $this->cut->set('["deu", "eng"]');

		$this->assertJSONResponse(Http::STATUS_OK, ['deu', 'eng'], $result);
	}

	public function testSet_GIVEN_all_languages_in_JSON_array_THEN_returns_JSONResponse_OK_with_this_array() {
		$given = json_encode(OcrConstants::ALLOWED_LANGUAGES);
		$this->config->expects($this->once())
			->method('setUserValue')
			->with($this->userId, OcrConstants::APP_NAME, 'favoriteLanguages', $given)
			->will($this->returnValue(null));

		$result = $this->cut->set($given);

		$this->assertJSONResponse(Http::STATUS_OK, OcrConstants::ALLOWED_LANGUAGES, $result);
	}

	public function testSet_GIVEN_valid_JSON_array_that_has_duplicates_THEN_returns_JSONResponse_OK_with_unique_array() {
		$this->config->expects($this->once())
			->method('setUserValue')
			->with($this->userId, OcrConstants::APP_NAME, 'favoriteLanguages', '["deu","eng"]')
			->will($this->returnValue(null));

		$result = $this->cut->set('["deu", "eng", "deu"]');

		$this->assertJSONResponse(Http::STATUS_OK, ['deu', 'eng'], $result);
	}

	/**
	 * @param int $expexctedStatus
	 * @param array|object|string $expectedData
	 * @param Http\JSONResponse $actual
	 */
	private function assertJSONResponse($expexctedStatus, $expectedData, $actual) {
		$this->assertInstanceOf('OCP\AppFramework\Http\JSONResponse', $actual);
		$this->assertEquals($expexctedStatus, $actual->getStatus());
		$this->assertEquals($expectedData, $actual->getData());
	}
}
