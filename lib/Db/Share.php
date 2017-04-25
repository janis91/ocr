<?php
/**
 * Nextcloud - OCR
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */

namespace OCA\Ocr\Db;

use OCP\AppFramework\Db\Entity;

/**
 * Class Share
 *
 * @package OCA\Ocr\Db
 *
 * @method string getFileTarget()
 */
class Share extends Entity {

	/**
	 * @var string
	 */
	protected $fileTarget;

	/**
	 * Share constructor.
	 *
	 * @param null $fileTarget
	 */
	public function __construct($fileTarget = null) {
		$this->fileTarget = $fileTarget;
	}

}