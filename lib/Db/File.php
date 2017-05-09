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


/**
 * Class File (represents the File to process)
 * 
 * @package OCA\Ocr\Db
 * @method integer getFileid()
 * @method string getPath()
 * @method string getName()
 * @method string getMimetype()
 * @method string getStoragename()
 */
class File extends Entity {

    /**
     *
     * @var integer
     */
    protected $fileid;

    /**
     *
     * @var string
     */
    protected $path;

    /**
     *
     * @var string
     */
    protected $name;

    /**
     *
     * @var string
     */
    protected $mimetype;

    /**
     *
     * @var string
     */
    protected $storagename;

    /**
     * File constructor.
     * 
     * @param integer $fileid            
     * @param string $path            
     * @param string $name            
     * @param string $mimetype            
     * @param string $storagename            
     */
    public function __construct($fileid = null, $path = null, $name = null, $mimetype = null, $storagename = null) {
        $this->fileid = $fileid;
        $this->path = $path;
        $this->name = $name;
        $this->mimetype = $mimetype;
        $this->storagename = $storagename;
    }
}