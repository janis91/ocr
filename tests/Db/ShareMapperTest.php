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


use OCA\Ocr\Db\Share;
use OCA\Ocr\Db\ShareMapper;

class ShareMapperTest extends MapperTestUtility {
	private $mapper;

	private $share;

	private $twoRows;

	private $userId = 'john';

	protected function setUp(){
		parent::setUp();
		$this->mapper = new ShareMapper($this->db);
		// create mock notes
		$share1 = new Share();
		$share2 = new Share();
		$this->share = [$share1, $share2];
		$this->twoRows = [
			['id' => $this->share[0]->getId()],
			['id' => $this->share[1]->getId()]
		];
	}

	public function testFind(){
		$filesource = 'source';
		$sharewith = 'admin';
		$uidowner = 'admin2';
		$rows = [['id' => $this->share[0]->getId()]];
		$sql = 'SELECT file_target FROM *PREFIX*share WHERE file_source = ? AND share_with = ? AND uid_owner = ?';
		$this->setMapperResult($sql, [$filesource, $sharewith, $uidowner], $rows);
		$result = $this->mapper->find($filesource, $sharewith, $uidowner);
		$this->assertEquals($this->share[0], $result);
	}

	/**
	 * @expectedException \OCP\AppFramework\Db\DoesNotExistException
	 */
	public function testFindNotFound(){
		$filesource = 'source';
		$sharewith = 'admin';
		$uidowner = 'admin2';
		$sql = 'SELECT file_target FROM *PREFIX*share WHERE file_source = ? AND share_with = ? AND uid_owner = ?';
		$this->setMapperResult($sql, [$filesource, $sharewith, $uidowner]);
		$this->mapper->find($filesource, $sharewith, $uidowner);
	}
}