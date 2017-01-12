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

namespace OCA\Ocr\Tests\Db;



use OCA\Ocr\Db\OcrStatus;
use OCA\Ocr\Db\OcrStatusMapper;

class OcrStatusMapperTest extends MapperTestUtility {

	private $mapper;

	private $status;

	private $twoRows;

	private $userId = 'john';

	protected function setUp(){
		parent::setUp();
		$this->mapper = new OcrStatusMapper($this->db);
		// create mock notes
		$status1 = new OcrStatus();
		$status2 = new OcrStatus();
		$this->status = [$status1, $status2];
		$this->twoRows = [
			['id' => $this->status[0]->getId()],
			['id' => $this->status[1]->getId()]
		];
	}

	public function testFind(){
		$id = 3;
		$rows = [['id' => $this->status[0]->getId()]];
		$sql = 'SELECT * FROM *PREFIX*ocr_status WHERE id = ?';
		$this->setMapperResult($sql, [$id], $rows);
		$result = $this->mapper->find($id);
		$this->assertEquals($this->status[0], $result);
	}

	/**
	 * @expectedException \OCP\AppFramework\Db\DoesNotExistException
	 */
	public function testFindNotFound(){
		$id = 3;
		$sql = 'SELECT * FROM *PREFIX*ocr_status WHERE id = ?';
		$this->setMapperResult($sql, [$id]);
		$this->mapper->find($id);
	}

	/**
	 * @expectedException \OCP\AppFramework\Db\MultipleObjectsReturnedException
	 */
	public function testFindMoreThanOneResultFound(){
		$id = 3;
		$rows = $this->twoRows;
		$sql = 'SELECT * FROM *PREFIX*ocr_status WHERE id = ?';
		$this->setMapperResult($sql, [$id], $rows);
		$this->mapper->find($id);
	}

	public function testFindAllProcessed(){
		$rows = $this->twoRows;
		$sql = 'SELECT * FROM *PREFIX*ocr_status WHERE user_id = ? AND status = ?';
		$this->setMapperResult($sql, [$this->userId, 'PROCESSED'], $rows);
		$result = $this->mapper->findAllProcessed($this->userId);
		$this->assertEquals($this->status, $result);
	}

	public function testFindAllPending(){
		$rows = $this->twoRows;
		$sql = 'SELECT * FROM *PREFIX*ocr_status WHERE user_id = ? AND status = ?';
		$this->setMapperResult($sql, [$this->userId, 'PENDING'], $rows);
		$result = $this->mapper->findAllPending($this->userId);
		$this->assertEquals($this->status, $result);
	}

	public function testFindAllFailed(){
		$rows = $this->twoRows;
		$sql = 'SELECT * FROM *PREFIX*ocr_status WHERE user_id = ? AND status = ? AND error_displayed = ?';
		$this->setMapperResult($sql, [$this->userId, 'FAILED', false], $rows);
		$result = $this->mapper->findAllFailed($this->userId);
		$this->assertEquals($this->status, $result);
	}

	public function testFindAll(){
		$rows = $this->twoRows;
		$sql = 'SELECT * FROM *PREFIX*ocr_status WHERE user_id = ?';
		$this->setMapperResult($sql, [$this->userId], $rows);
		$result = $this->mapper->findAll($this->userId);
		$this->assertEquals($this->status, $result);
	}

}