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

use OCP\AppFramework\Db\Mapper;
use OCP\IDBConnection;

/**
 * Class OcrStatusMapper
 *
 * @package OCA\Ocr\Db
 */
class OcrStatusMapper extends Mapper {

	/**
	 * OcrStatusMapper constructor.
	 *
	 * @param IDBConnection $db
	 */
	public function __construct(IDBConnection $db) {
		parent::__construct($db, 'ocr_status', 'OCA\Ocr\Db\OcrStatus');
	}

	/**
	 * Find a specific status entity
	 *
	 * @param $id
	 * @return \OCP\AppFramework\Db\Entity
	 */
	public function find($id){
		$sql = 'SELECT * FROM *PREFIX*ocr_status WHERE id = ?';
		return $this->findEntity($sql, [$id]);
	}

	/**
	 * Finds all status PROCESSED entities for a given userid
	 * @param $userId
	 * @return array
	 */
	public function findAllProcessed($userId) {
		$sql = 'SELECT * FROM *PREFIX*ocr_status WHERE user_id = ? AND status = ?';
		return $this->findEntities($sql, [$userId, 'PROCESSED']);
	}

	/**
	 * Finds all status PENDING entities for a given userid
	 * @param $userId
	 * @return array
	 */
	public function findAllPending($userId) {
		$sql = 'SELECT * FROM *PREFIX*ocr_status WHERE user_id = ? AND status = ?';
		return $this->findEntities($sql, [$userId, 'PENDING']);
	}

	/**
	 * Finds all status FAILED entities for a given userid
	 * @param $userId
	 * @return array
	 */
	public function findAllFailed($userId) {
		$sql = 'SELECT * FROM *PREFIX*ocr_status WHERE user_id = ? AND status = ?';
		return $this->findEntities($sql, [$userId, 'FAILED']);
	}

}