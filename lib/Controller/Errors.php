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
namespace OCA\Ocr\Controller;

use Closure;

use OCP\AppFramework\Http;
use OCP\AppFramework\Http\DataResponse;

use OCA\Ocr\Service\NotFoundException;


/**
 * Class Errors
 * @package OCA\Ocr\Controller
 */
trait Errors {

	/**
	 * handles the thrown Errors for all Controllers
	 * and sends a DataResponse with the ErrorMessage of the service
	 * @param Closure $callback
	 * @return DataResponse
	 */
	protected function handleNotFound (Closure $callback) {
		try {
			return new DataResponse($callback());
		} catch(NotFoundException $e) {
			return new DataResponse($e->getMessage(), Http::STATUS_NOT_FOUND);
		}
	}

}