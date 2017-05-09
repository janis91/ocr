<?php

/**
 * Nextcloud - OCR
 * This file is licensed under the Affero General Public License version 3 or
 * later.
 * See the COPYING file.
 * 
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */
namespace OCA\Ocr\Util;

/**
 * Class FileUtil
 *
 * @package OCA\Ocr\Util
 */
class FileUtil {

    /**
     * Wraps the static function \OCP\Files::buildNotExistingFileName() in order to be able to test everything else.
     * @codeCoverageIgnore
     * 
     * @param string $filePath            
     * @param string $fileName            
     * @return string
     */
    public function buildNotExistingFilename($filePath, $fileName) {
        return \OCP\Files::buildNotExistingFileName($filePath, $fileName);
    }
    
    /**
     * Executes the exec function with a remove statement for a given file path.
     * @codeCoverageIgnore
     *
     * @param string $pathToFile
     */
    public function execRemove($pathToFile) {
        exec('rm ' . $pathToFile);
    }
    
    /**
     * Wraps the static file_get_contents method of php.
     * @codeCoverageIgnore
     *
     * @param string $pathToFile
     * @return string
     */
    public function getFileContents($pathToFile) {
        return file_get_contents($pathToFile);
    }
    
    /**
     * Wraps the static file_exists method of php.
     * @codeCoverageIgnore
     *
     * @param string $pathToFile
     * @return boolean
     */
    public function fileExists($pathToFile) {
        return file_exists($pathToFile);
    }
}