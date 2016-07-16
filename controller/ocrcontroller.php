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

use \OCP\IRequest;
use \OCP\AppFramework\Http;
use \OCP\AppFramework\Controller;
use \OCP\IL10N;

class OcrController extends Controller {

	private $userId;
	private $l;

	public function __construct($AppName, IRequest $request, $UserId, IL10N $l){
		parent::__construct($AppName, $request);
		$this->userId = $UserId;
		$this->l = $l;
	}



	/**
	 * @NoAdminRequired
	 * @param string $srcDir
	 * @param string $srcFile - semicolon separated filenames
	 * @param string $srcFileType - image or pdf
	 * @return Http\JSONResponse
	 */
	public function process($srcDir, $srcFile, $srcFileType) {

		return Http\JSONResponse::setData('');

	}

	/**
	 * Get languages supported by installed tesseract. (Version has to be at least 3.02.02)
	 * @NoAdminRequired
	 * @return Http\JSONResponse
	 */
	public function languages(){
		$success = 0;
		exec('tesseract --list-langs 2>&1', $result, $success);
		if ($success == 0 && count($result) != "Array[0]") {
			if (is_array($result)) {
				$traineddata = $result;
			} else {
				$traineddata = explode(' ', $result);
			}

			$tds = array();
			foreach ($traineddata as $td) {
				$tdname = trim($td);
				if (strlen($tdname) == 3) {
					array_push($tds, $tdname);
				}
			}
			$availableLanguages = array('languages' => $tds);
			
			return new JSONResponse($availableLanguages);


		} else {
			// error
		}

	}


}