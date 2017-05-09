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

use OCP\AppFramework\Db\Mapper;
use OCP\IDBConnection;
use OCA\Ocr\Constants\OcrConstants;


/**
 * Class OcrJobMapper
 * 
 * @package OCA\Ocr\Db
 */
class OcrJobMapper extends Mapper {

    /**
     * OcrJobMapper constructor.
     * 
     * @param IDBConnection $db            
     */
    public function __construct(IDBConnection $db) {
        parent::__construct($db, 'ocr_jobs', 'OCA\Ocr\Db\OcrJob');
    }

    /**
     * Find a specific job entity
     * 
     * @param
     *            $id
     * @return OcrJob
     */
    public function find($id) {
        $sql = 'SELECT * FROM *PREFIX*ocr_jobs WHERE id = ?';
        return $this->findEntity($sql, [
                $id
        ]);
    }

    /**
     * Finds all user specific jobs entities
     * 
     * @param
     *            $userId
     * @return OcrJob[]
     */
    public function findAll($userId) {
        $sql = 'SELECT * FROM *PREFIX*ocr_jobs WHERE user_id = ?';
        return $this->findEntities($sql, [
                $userId
        ]);
    }

    /**
     * Finds all jobs PROCESSED entities for a given userid
     * 
     * @param
     *            $userId
     * @return OcrJob[]
     */
    public function findAllProcessed($userId) {
        $sql = 'SELECT * FROM *PREFIX*ocr_jobs WHERE user_id = ? AND status = ?';
        return $this->findEntities($sql, [
                $userId,
                OcrConstants::STATUS_PROCESSED
        ]);
    }

    /**
     * Finds all jobs PENDING entities for a given userid.
     * 
     * @param
     *            $userId
     * @return OcrJob[]
     */
    public function findAllPending($userId) {
        $sql = 'SELECT * FROM *PREFIX*ocr_jobs WHERE user_id = ? AND status = ?';
        return $this->findEntities($sql, [
                $userId,
                OcrConstants::STATUS_PENDING
        ]);
    }

    /**
     * Finds all jobs FAILED entities for a given userid, which were not displayed yet.
     * 
     * @param
     *            $userId
     * @return OcrJob[]
     */
    public function findAllFailed($userId) {
        $sql = 'SELECT * FROM *PREFIX*ocr_jobs WHERE user_id = ? AND status = ? AND error_displayed = ?';
        return $this->findEntities($sql, [
                $userId,
                OcrConstants::STATUS_FAILED,
                false
        ]);
    }
}