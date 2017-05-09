<?php

/**
 * Nextcloud - OCR
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 * 
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */
namespace OCA\Ocr\Db;

use OCP\AppFramework\Db\Entity;
use JsonSerializable;


/**
 * Class to represent a ocr job.
 * 
 * @method string getStatus()
 * @method void setStatus(string $status)
 * @method string getSource()
 * @method void setSource(integer $source)
 * @method string getTarget()
 * @method void setTarget(string $target)
 * @method string getTempFile()
 * @method void setTempFile(string $tempFile)
 * @method string getType()
 * @method void setType(string $type)
 * @method string getUserId()
 * @method void setUserId(string $userId)
 * @method boolean getErrorDisplayed()
 * @method void setErrorDisplayed(boolean $errorDisplayed)
 * @method void setOriginalFilename(string $originalFilename)
 * @method string getOriginalFilename()
 * @method void setErrorLog(string $errorLog)
 * @method string getErrorLog()
 */
class OcrJob extends Entity implements JsonSerializable {

    /**
     *
     * @var string
     */
    protected $status;

    /**
     *
     * @var string
     */
    protected $source;

    /**
     *
     * @var string
     */
    protected $target;

    /**
     *
     * @var string
     */
    protected $tempFile;

    /**
     *
     * @var string
     */
    protected $type;

    /**
     *
     * @var string
     */
    protected $userId;

    /**
     *
     * @var boolean
     */
    protected $errorDisplayed;

    /**
     *
     * @var string
     */
    protected $originalFilename;

    /**
     *
     * @var string
     */
    protected $errorLog;

    /**
     * OcrJob constructor.
     * 
     * @param string $status            
     * @param string $source            
     * @param string $target            
     * @param string $tempFile            
     * @param string $type            
     * @param string $userId            
     * @param boolean $errorDisplayed            
     * @param string $originalFilename            
     * @param string $errorLog            
     */
    public function __construct($status = null, $source = null, $target = null, $tempFile = null, $type = null, $userId = null, 
            $errorDisplayed = null, $originalFilename = null, $errorLog = null) {
        $this->setStatus($status);
        $this->setSource($source);
        $this->setTarget($target);
        $this->setTempFile($tempFile);
        $this->setType($type);
        $this->setUserId($userId);
        $this->setErrorDisplayed($errorDisplayed);
        $this->setOriginalFilename($originalFilename);
        $this->setErrorLog($errorLog);
    }

    /**
     * Specify data which should be serialized to JSON
     * 
     * @link http://php.net/manual/en/jsonserializable.jsonserialize.php
     * @return mixed data which can be serialized by <b>json_encode</b>,
     *         which is a value of any type other than a resource.
     * @since 5.4.0
     */
    function jsonSerialize() {
        return [
                'id' => $this->id,
                'status' => $this->status,
                'source' => $this->source,
                'target' => $this->target,
                'tempFile' => $this->tempFile,
                'type' => $this->type,
                'userId' => $this->userId,
                'errorDisplayed' => $this->errorDisplayed,
                'originalFilename' => $this->originalFilename,
                'errorLog' => $this->errorLog
        ];
    }
}