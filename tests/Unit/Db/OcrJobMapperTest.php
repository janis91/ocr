<?php

/**
 * Nextcloud - OCR
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 * 
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */
namespace OCA\Ocr\Tests\Unit\Db;

use OCA\Ocr\Db\OcrJobMapper;
use OCA\Ocr\Db\OcrJob;
use OCA\Ocr\Constants\OcrConstants;


class OcrJobMapperTest extends MapperTestUtility {

    private $cut;

    private $jobs;

    private $twoRows;

    private $userId = 'john';

    protected function setUp() {
        parent::setUp();
        $this->cut = new OcrJobMapper($this->db);
        $job1 = new OcrJob();
        $job2 = new OcrJob();
        $this->jobs = [
                $job1,
                $job2
        ];
        $this->twoRows = [
                [
                        'id' => $this->jobs[0]->getId()
                ],
                [
                        'id' => $this->jobs[1]->getId()
                ]
        ];
    }

    public function testFind() {
        $id = 3;
        $rows = [
                [
                        'id' => $this->jobs[0]->getId()
                ]
        ];
        $sql = 'SELECT * FROM *PREFIX*ocr_jobs WHERE id = ?';
        $this->setMapperResult($sql, [
                $id
        ], $rows);
        $result = $this->cut->find($id);
        $this->assertEquals($this->jobs[0], $result);
    }

    /**
     * @expectedException \OCP\AppFramework\Db\DoesNotExistException
     */
    public function testFindNotFound() {
        $id = 3;
        $sql = 'SELECT * FROM *PREFIX*ocr_jobs WHERE id = ?';
        $this->setMapperResult($sql, [
                $id
        ]);
        $this->cut->find($id);
    }

    /**
     * @expectedException \OCP\AppFramework\Db\MultipleObjectsReturnedException
     */
    public function testFindMoreThanOneResultFound() {
        $id = 3;
        $rows = $this->twoRows;
        $sql = 'SELECT * FROM *PREFIX*ocr_jobs WHERE id = ?';
        $this->setMapperResult($sql, [
                $id
        ], $rows);
        $this->cut->find($id);
    }

    public function testFindAllProcessed() {
        $rows = $this->twoRows;
        $sql = 'SELECT * FROM *PREFIX*ocr_jobs WHERE user_id = ? AND status = ?';
        $this->setMapperResult($sql, [
                $this->userId,
                OcrConstants::STATUS_PROCESSED
        ], $rows);
        $result = $this->cut->findAllProcessed($this->userId);
        $this->assertEquals($this->jobs, $result);
    }

    public function testFindAllPending() {
        $rows = $this->twoRows;
        $sql = 'SELECT * FROM *PREFIX*ocr_jobs WHERE user_id = ? AND status = ?';
        $this->setMapperResult($sql, [
                $this->userId,
                OcrConstants::STATUS_PENDING
        ], $rows);
        $result = $this->cut->findAllPending($this->userId);
        $this->assertEquals($this->jobs, $result);
    }

    public function testFindAllFailed() {
        $rows = $this->twoRows;
        $sql = 'SELECT * FROM *PREFIX*ocr_jobs WHERE user_id = ? AND status = ? AND error_displayed = ?';
        $this->setMapperResult($sql, [
                $this->userId,
                OcrConstants::STATUS_FAILED,
                false
        ], $rows);
        $result = $this->cut->findAllFailed($this->userId);
        $this->assertEquals($this->jobs, $result);
    }

    public function testFindAll() {
        $rows = $this->twoRows;
        $sql = 'SELECT * FROM *PREFIX*ocr_jobs WHERE user_id = ?';
        $this->setMapperResult($sql, [
                $this->userId
        ], $rows);
        $result = $this->cut->findAll($this->userId);
        $this->assertEquals($this->jobs, $result);
    }
    
    public function testDeleteAllForUser() {
        $rows = $this->twoRows;
        $sql = 'DELETE FROM *PREFIX*ocr_jobs WHERE user_id = ?';
        $this->setMapperResult($sql, [$this->userId], $rows);
        $result = $this->cut->deleteAllForUser($this->userId);
        $this->assertEquals($this->jobs, $result);
    }
}