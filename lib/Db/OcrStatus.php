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
 */
class OcrStatus extends Entity {

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
	 * OcrStatus constructor.
	 *
	 * @param null $status
	 * @param null $fileId
	 * @param null $newName
	 * @param null $tempFile
	 * @param null $type
	 * @param null $userId
	 */
	public function __construct($status = null, $fileId = null, $newName = null, $tempFile = null, $type = null, $userId = null) {
		$this->setStatus($status);
		$this->setFileId($fileId);
		$this->setNewName($newName);
		$this->setTempFile($tempFile);
		$this->setType($type);
		$this->setUserId($userId);
	}
}