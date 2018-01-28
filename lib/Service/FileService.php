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
namespace OCA\Ocr\Service;

use OCA\Ocr\Db\FileMapper;
use OCA\Ocr\Db\File;
use OCP\ILogger;
use OCA\Ocr\Db\ShareMapper;
use OCP\IL10N;
use OCA\Ocr\Constants\OcrConstants;
use OCA\Ocr\Util\FileUtil;


/**
 * Class FileService
 * 
 * @package OCA\Ocr\Service
 */
class FileService {

    /**
     *
     * @var ILogger
     */
    private $logger;

    /**
     *
     * @var FileMapper
     */
    private $fileMapper;

    /**
     *
     * @var ShareMapper
     */
    private $shareMapper;

    /**
     *
     * @var string
     */
    private $userId;

    /**
     *
     * @var IL10N
     */
    private $l10n;

    /**
     *
     * @var FileUtil
     */
    private $fileUtil;

    public function __construct(IL10N $l10n, ILogger $logger, $userId, FileMapper $fileMapper, ShareMapper $shareMapper, 
            FileUtil $fileUtil) {
        $this->l10n = $l10n;
        $this->logger = $logger;
        $this->userId = $userId;
        $this->fileMapper = $fileMapper;
        $this->shareMapper = $shareMapper;
        $this->fileUtil = $fileUtil;
    }

    /**
     * Checks if shared with the process initiator
     * 
     * @param File $fileInfo            
     * @return boolean
     */
    public function checkSharedWithInitiator($fileInfo) {
        $owner = str_replace('home::', '', $fileInfo->getStoragename());
        if ($this->userId === $owner) {
            // user is owner (no shared file)
            return false;
        } else {
            // user is not owner (shared file)
            return true;
        }
    }

    /**
     * Builds the target name.
     * 
     * @param File $fileInfo            
     * @param boolean $shared            
     * @param boolean $replace            
     * @return string
     */
    public function buildTarget($fileInfo, $shared, $replace) {
        if ($shared) {
            $target = $this->buildTargetForShared($fileInfo, $replace);
        } else {
            $target = $this->buildTargetNotForShared($fileInfo, $replace);
        }
        return $target;
    }

    /**
     * Builds the source name.
     * 
     * @param File $fileInfo            
     * @param boolean $shared            
     * @return string
     */
    public function buildSource($fileInfo, $shared) {
        $source = $fileInfo->getPath();
        if ($shared) {
            $source = str_replace('home::', '', $fileInfo->getStoragename()) . '/' . $source;
        } else {
            $source = $this->userId . '/' . $source;
        }
        return $source;
    }

    /**
     * Returns the fileInfo for each file in files and checks
     * if it has a allowed MIME type and some other conditions.
     * 
     * @param array $files            
     * @return File[]
     * @throws NotFoundException
     */
    public function buildFileInfo($files) {
        $fileArray = array();
        foreach ($files as $file) {
            // Check if anything is missing and file type is correct
            if (!empty($file['id'])) {
                $fileInfo = $this->fileMapper->find($file['id']);
                $this->checkMimeType($fileInfo);
                array_push($fileArray, $fileInfo);
            } else {
                throw new NotFoundException($this->l10n->t('Wrong parameter.'));
            }
        }
        return $fileArray;
    }

    /**
     * Determines the correct type for the ocr process worker.
     * 
     * @param File $fileInfo            
     * @return integer
     */
    public function getCorrectType($fileInfo) {
        if ($fileInfo->getMimetype() === OcrConstants::MIME_TYPE_PDF) {
            return OcrConstants::OCRmyPDF;
        } else {
            return OcrConstants::TESSERACT;
        }
    }

    /**
     * Returns a not existing file name for pdf or image processing.
     * 
     * @param File $fileInfo            
     * @param boolean $replace            
     * @return string
     */
    private function buildTargetForShared(File $fileInfo, $replace) {
        $share = $this->shareMapper->find($fileInfo->getFileid(), $this->userId, 
                str_replace('home::', '', $fileInfo->getStoragename()));
        // get rid of the .png or .pdf and so on
        // '/thedom.png' => '/thedom' || '/Test/thedom.png' => '/Test/thedom'
        $fileName = substr($share->getFileTarget(), 0, (strrpos($share->getFileTarget(), '.')));
        // remove everything in front of and including of the first appearance of a slash from behind
        // '/thedom' => 'thedom' || '/Test/thedom' => 'thedom'
        $fileName = substr(strrchr($fileName, "/"), 1);
        // eliminate the file name from the path
        // '/thedom.png' => '/' || '/Test/thedom.png' => '/Test'
        $filePath = dirname($share->getFileTarget());
        // replace the first slash
        $pos = strpos($filePath, '/');
        if ($pos !== false) {
            // '/' => '' || '/Test/' => 'Test'
            $filePath = substr_replace($filePath, '', $pos, strlen('/'));
        }
        if ($fileInfo->getMimetype() === OcrConstants::MIME_TYPE_PDF) {
            // PDFs:
            if ($replace) {
                if($filePath === '/') {
                    $filePath = '';
                }
                return $filePath . '/'. $fileName . '.pdf';
            } else {
                return $this->fileUtil->buildNotExistingFilename($filePath, $fileName . '.pdf');
            }
        } else {
            // IMAGES:
            return $this->fileUtil->buildNotExistingFilename($filePath, $fileName . '.pdf');
        }
    }

    /**
     * Returns a not existing file name for PDF or image processing.
     * 
     * @param File $fileInfo            
     * @param boolean $replace            
     * @return string
     */
    private function buildTargetNotForShared(File $fileInfo, $replace) {
        // get rid of the .png or .pdf and so on
        // 'thedom.png' => 'thedom'
        $fileName = substr($fileInfo->getName(), 0, (strrpos($fileInfo->getName(), '.')));
        // eliminate the file name from the path
        // 'files/Test/thedom.png' => 'files/Test/' || 'files/thedom.png' => 'files/'
        $filePath = str_replace($fileInfo->getName(), '', $fileInfo->getPath());
        // and get the path on top of the files/ dir
        // 'files/Test/' => '/Test/' || 'files/' => '/'
        $filePath = str_replace('files', '', $filePath);
        // remove the last slash
        // '/Test/' => '/Test' || '/' => ''
        $filePath = substr_replace($filePath, '', strrpos($filePath, '/'), strlen('/'));
        // replace the first slash
        $pos = strpos($filePath, '/');
        if ($pos !== false) {
            // '/Test' => '// 'Test' || '/' => ''
            $filePath = substr_replace($filePath, '', $pos, strlen('/'));
        }
        if ($fileInfo->getMimetype() === OcrConstants::MIME_TYPE_PDF) {
            // PDFs:
            if ($replace) {
                if($filePath === '/') {
                    $filePath = '';
                }
                return $filePath . '/' . $fileName . '.pdf';
            } else {
                return $this->fileUtil->buildNotExistingFilename($filePath, $fileName . '.pdf');
            }
        } else {
            // IMAGES:
            return $this->fileUtil->buildNotExistingFilename($filePath, $fileName . '.pdf');
        }
    }

    /**
     * Checks a MIME type for a specifically given FileInfo.
     * 
     * @param File $fileInfo            
     */
    private function checkMimeType(File $fileInfo) {
        if (!$fileInfo || !in_array($fileInfo->getMimetype(), OcrConstants::ALLOWED_MIME_TYPES)) {
            $this->logger->debug('Getting FileInfo did not work or not included in the ALLOWED_MIMETYPES array.');
            throw new NotFoundException($this->l10n->t('Wrong MIME type.'));
        }
    }
}