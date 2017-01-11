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

namespace OCA\Ocr\Db;

use OCP\AppFramework\Db\Entity;
use JsonSerializable;

/**
 * Class to represent a ocr status.
 *
 * @method string getStatus()
 * @method void setStatus(string $status)
 * @method integer getFileId()
 * @method void setFileId(integer $fileId)
 * @method string getNewName()
 * @method void setNewName(string $newName)
 * @method string getTempFile()
 * @method void setTempFile(string $tempFile)
 * @method string getType()
 * @method void setType(string $type)
 * @method string getUserId()
 * @method void setUserId(string $userId)
 * @method boolean getErrorDisplayed()
 * @method void setErrorDisplayed(boolean $errorDisplayed)
 */
class OcrStatus extends Entity implements JsonSerializable {

	/**
	 * @var string
	 */
	protected $status;

	/**
	 * @var integer
	 */
	protected $fileId;

	/**
	 * @var string
	 */
	protected $newName;

	/**
	 * @var string
	 */
	protected $tempFile;

	/**
	 * @var string
	 */
	protected $type;

	/**
	 * @var string
	 */
	protected $userId;


	/**
	 * @var boolean
	 */
	protected $errorDisplayed;

	/**
	 * OcrStatus constructor.
	 *
	 * @param null $status
	 * @param null $fileId
	 * @param null $newName
	 * @param null $tempFile
	 * @param null $type
	 * @param null $userId
	 * @param null $errorDisplayed
	 */
	public function __construct($status = null, $fileId = null, $newName = null, $tempFile = null, $type = null, $userId = null, $errorDisplayed = null) {
		$this->setStatus($status);
		$this->setFileId($fileId);
		$this->setNewName($newName);
		$this->setTempFile($tempFile);
		$this->setType($type);
		$this->setUserId($userId);
		$this->setErrorDisplayed($errorDisplayed);
	}

    /**
     * Specify data which should be serialized to JSON
     * @link http://php.net/manual/en/jsonserializable.jsonserialize.php
     * @return mixed data which can be serialized by <b>json_encode</b>,
     * which is a value of any type other than a resource.
     * @since 5.4.0
     */
    function jsonSerialize()
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'fileId' => $this->fileId,
            'newName' => $this->newName,
            'tempFile' => $this->tempFile,
            'type' => $this->type,
            'userId' => $this->userId,
            'errorDisplayed' => $this->errorDisplayed
        ];
    }
}