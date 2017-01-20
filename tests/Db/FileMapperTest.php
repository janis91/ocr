<?php
/**
 * nextCloud - ocr
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */

namespace OCA\Ocr\Tests\Db;


use OCA\Ocr\Db\File;
use OCA\Ocr\Db\FileMapper;

class FileMapperTest extends MapperTestUtility  {
	private $mapper;

	private $file;

	private $twoRows;

	protected function setUp(){
		parent::setUp();
		$this->mapper = new FileMapper($this->db);
		// create mock notes
		$file1 = new File();
		$file2 = new File();
		$this->file = [$file1, $file2];
		$this->twoRows = [
			['id' => $this->file[0]->getId()],
			['id' => $this->file[1]->getId()]
		];
	}

	public function testFind(){
		$fileid = 3;
		$rows = [['id' => $this->file[0]->getId()]];
		$sql = 'SELECT f.fileid AS fileid, f.path AS path, f.name as name, m.mimetype AS mimetype, s.id AS storagename FROM *PREFIX*filecache AS f, *PREFIX*mimetypes AS m, *PREFIX*storages AS s WHERE f.fileid = ? AND f.mimetype = m.id AND f.storage = s.numeric_id';
		$this->setMapperResult($sql, [$fileid], $rows);
		$result = $this->mapper->find($fileid);
		$this->assertEquals($this->file[0], $result);
	}

	/**
	 * @expectedException \OCP\AppFramework\Db\DoesNotExistException
	 */
	public function testFindNotFound(){
		$fileid = 3;
		$sql = 'SELECT f.fileid AS fileid, f.path AS path, f.name as name, m.mimetype AS mimetype, s.id AS storagename FROM *PREFIX*filecache AS f, *PREFIX*mimetypes AS m, *PREFIX*storages AS s WHERE f.fileid = ? AND f.mimetype = m.id AND f.storage = s.numeric_id';
		$this->setMapperResult($sql, [$fileid]);
		$this->mapper->find($fileid);
	}
}