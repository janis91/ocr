<?php

/**
 * Nextcloud - OCR
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 * 
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */
namespace OCA\Ocr\Util;

use OCA\Ocr\Service\NotFoundException;
use OCP\IL10N;


/**
 * Class PHPUtil
 * 
 * @package OCA\Ocr\Util
 */
class PHPUtil {

    /**
     *
     * @var IL10N
     */
    private $l10n;

    /**
     * 
     * @param IL10N $l10n
     */
    public function __construct(IL10N $l10n) {
        $this->l10n = $l10n;
    }

    /**
     * Wraps the php native function tempnam()
     * @codeCoverageIgnore
     * 
     * @param string $dir            
     * @param string $prefix            
     * @throws NotFoundException
     * @return string
     */
    public function tempnamWrapper($dir, $prefix) {
        $tempFile = tempnam($dir, $prefix);
        if ($tempFile === false) {
            throw new NotFoundException($this->l10n->t('Temp file cannot be created.'));
        } else {
            return $tempFile;
        }
    }

    /**
     * Wraps the php native function unlink()
     * @codeCoverageIgnore
     * 
     * @param string $fileName            
     * @throws NotFoundException
     * @return boolean
     */
    public function unlinkWrapper($fileName) {
        if (unlink($fileName)) {
            return true;
        } else {
            throw new NotFoundException(
                    $this->l10n->t('Cannot delete temporary file during creation of temp file for Tesseract.'));
        }
    }

    /**
     * Wraps the php native function touch()
     * @codeCoverageIgnore
     * 
     * @param string $fileName            
     * @throws NotFoundException
     * @return boolean
     */
    public function touchWrapper($fileName) {
        if (touch($fileName)) {
            return true;
        } else {
            throw new NotFoundException($this->l10n->t('Cannot create temporary file for Tesseract.'));
        }
    }

    /**
     * Wraps the php native function chmod()
     * @codeCoverageIgnore
     * 
     * @param string $fileName            
     * @param integer $mode            
     * @throws NotFoundException
     * @return boolean
     */
    public function chmodWrapper($fileName, $mode) {
        if (chmod($fileName, $mode)) {
            return true;
        } else {
            throw new NotFoundException($this->l10n->t('Cannot set permissions for temporary Tesseract file.'));
        }
    }
}
