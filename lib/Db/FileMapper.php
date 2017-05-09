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
 * Class FileMapper
 * 
 * @package OCA\Ocr\Db
 */
class FileMapper extends Mapper {

    /**
     * FileMapper constructor.
     * ATTENTION: the common methods like 'delete' 'update' and things like that will not work because we join and
     * cleanup some columns!!!
     * 
     * @param IDBConnection $db            
     */
    public function __construct(IDBConnection $db) {
        parent::__construct($db, 'filecache', 'OCA\Ocr\Db\File');
    }

    /**
     * Find a specific file entity
     * 
     * @param
     *            $fileid
     * @return File
     */
    public function find($fileid) {
        $sql = 'SELECT f.fileid AS fileid, f.path AS path, f.name as name, m.mimetype AS mimetype, s.id AS storagename FROM *PREFIX*filecache AS f, *PREFIX*mimetypes AS m, *PREFIX*storages AS s WHERE f.fileid = ? AND f.mimetype = m.id AND f.storage = s.numeric_id';
        return $this->findEntity($sql, [
                $fileid
        ]);
    }
}