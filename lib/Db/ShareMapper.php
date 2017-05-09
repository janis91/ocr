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


/**
 * Class ShareMapper
 * 
 * @package OCA\Ocr\Db
 */
class ShareMapper extends Mapper {

    /**
     * ShareMapper constructor.
     * 
     * @param IDBConnection $db            
     */
    public function __construct(IDBConnection $db) {
        parent::__construct($db, 'share', 'OCA\Ocr\Db\Share');
    }

    /**
     * Find the right name for a shared file
     * 
     * @param integer $fileid            
     * @param string $shareWith            
     * @param string $owner            
     * @return Share
     */
    public function find($fileid, $shareWith, $owner) {
        $sql = 'SELECT file_target FROM *PREFIX*share WHERE file_source = ? AND share_with = ? AND uid_owner = ?';
        return $this->findEntity($sql, [
                $fileid,
                $shareWith,
                $owner
        ]);
    }
}