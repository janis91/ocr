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

use OCP\Files;
use \OCP\IRequest;
use \OCP\AppFramework\Http\JSONResponse;
use \OCP\AppFramework\Controller;
use \OCP\ILogger;
use \OCP\IConfig;


class OcrController extends Controller {

	private $userId;
	private $logger;
	private $config;

	public function __construct($AppName, IRequest $request, $UserId, ILogger $logger, IConfig $config){
		parent::__construct($AppName, $request);
		$this->userId = $UserId;
		$this->logger = $logger;
		$this->config = $config;
	}

	/**
	 * Get languages supported by installed tesseract. (Version has to be at least 3.02.02)
	 * @NoAdminRequired
	 * @return JSONResponse
	 */
	public function languages(){
		$success = -1;
		exec('tesseract --list-langs 2>&1', $result, $success);
		if ($success === 0 && count($result) != "Array[0]") {
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
			return new JSONResponse(array('languages' => $tds));
		} else {
			return new JSONResponse(array(), \OCP\AppFramework\Http::STATUS_NOT_FOUND);
		}
	}

	/**
	 * @NoAdminRequired
	 * @param string $srcDir
	 * @param string $srcFile
	 * @param string $language - deu, eng...
	 * @return JSONResponse
	 */
	public function process($srcFile, $srcDir, $language) {
		$newName ='';
		// Parameters set
		if(!empty($srcFile) && !empty($language) && strlen($language) > 0 && !empty($srcDir)) {
			$file = $srcDir.'/'.$srcFile;
			$fileInfo = \OC\Files\Filesystem::getFileInfo($file);
			$mtype = $fileInfo->getMimetype();
			$srcFile = substr($srcFile, 0, -4);
			if ($mtype == 'application/pdf'){
				$newName = \OCP\Files::buildNotExistingFileName($srcDir,$srcFile.'_OCR.pdf'); // new filename (and in case it exists already it will be build other way)
				$success = $this->ocrmypdf($fileInfo, $newName, $language);
				$message = $success ? 'OCR_SUCCESS' : 'OCR_ERROR';
			}elseif ($mtype == 'image/png' || $mtype == 'image/jpeg' || $mtype == 'image/tiff'){
				$newName = \OCP\Files::buildNotExistingFileName($srcDir,$srcFile.'_OCR.txt'); // new filename (and in case it exists already it will be build other way)
				$success = $this->tesseract($fileInfo, $newName, $language);
				$message = $success ? 'OCR_SUCCESS' : 'OCR_ERROR';
			}else{
				$success = false;
				$message = 'WRONG_MIMETYPE'; // wrong mimetype
			}
		}else{
			$success = false;
			$message = 'WRONG_PARAMETERS'; // parameters not set
		}
		return new JSONResponse(array('success' => $success,'message' => $message, 'file' => $srcFile));
	}

	/**
	 * execute the tesseract thing
	 * @NoAdminRequired
	 * @param \OC\Files\FileInfo $fileinfo
	 * @param string $newName
	 * @param string $language
	 * @return bool
	 */
	private function tesseract($fileinfo , $newName, $language){
		try {
			$tempM = new \OC\TempManager($this->logger, $this->config);
			$tempFile = $tempM->getTemporaryFile();
			// Build and execute command
			$command = 'tesseract "' . $this->config->getSystemValue('datadirectory') . $fileinfo->getPath() . '" "' . $tempFile . '" -l ' . $language;
			$success = -1;
			exec($command, $_out, $success);
			// Command successful and no error by tesseract (line[0] is 'Tesseract Open Source OCR Engine v3.03 with Leptonica' line[1] should not exist)
			if ($success == 0 && !isset($_out[1])) {
				//Save the tmp file with newname
				\OC\Files\Filesystem::file_put_contents($newName, file_get_contents($tempFile . '.txt')); // need .txt because tesseract saves it like this
				// Cleaning temp files
				exec('rm ' . $tempFile . '.txt');
				$tempM->clean();
				return true;
			} else {
				return false;
			}
		} catch (Exception $e) {
			return false;
		}
	}

	/**
	 * execute the ocrmypdf thing
	 * @NoAdminRequired
	 * @param \OC\Files\FileInfo $fileinfo
	 * @param string $newName
	 * @param string $language
	 * @return bool
	 */
	private function ocrmypdf($fileinfo, $newName, $language){
		try {
			$tempM = new \OC\TempManager($this->logger, $this->config);
			$tempFile = $tempM->getTemporaryFile();
			// Build and execute command
			$command = 'ocrmypdf "' . $this->config->getSystemValue('datadirectory') . $fileinfo->getPath() . '" "' . $tempFile . '" -l ' . $language . ' --skip-text';
			$success = -1;
			exec($command, $_out, $success);
			// Command successful and no error by tesseract (line[0] is 'Tesseract Open Source OCR Engine v3.03 with Leptonica' line[1] should not exist)
			if ($success == 0 && !isset($_out[0])) {
				//Save the tmp file with newname
				\OC\Files\Filesystem::file_put_contents($newName, file_get_contents($tempFile)); // don't need to extend with .pdf / it uses the tmp file to save
				// Cleaning temp files
				$tempM->clean();
				return true;
			} else {
				return false;
			}
		} catch (Exception $e) {
			return false;
		}
	}


}