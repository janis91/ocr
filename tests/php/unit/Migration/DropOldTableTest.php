<?php

/**
 * Nextcloud - OCR
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 * 
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */
namespace OCA\Ocr\Tests\Unit\Migration;

use OCA\Ocr\Migration\DropOldTable;
use OCA\Ocr\Tests\Unit\TestCase;
use OCP\Migration\IOutput;
use OCP\IDBConnection;


class DropOldTableTest extends TestCase {

    /** @var IOutput */
    private $output;

    /** @var IDBConnection */
    private $connection;

    /** @var DropOldTable */
    private $repairStep;

    protected function setUp() {
        parent::setUp();
        $this->connection = $this->getMockBuilder('OCP\IDBConnection')
            ->disableOriginalConstructor()
            ->getMock();
        $this->output = $this->getMockBuilder('OCP\Migration\IOutput')
            ->getMock();
        $this->repairStep = new DropOldTable($this->connection);
    }

    public function testRunNothingToMigrate() {
        $this->connection->expects($this->exactly(2))
            ->method('tableExists')
            ->withConsecutive($this->equalTo('ocr_jobs'), $this->equalTo('ocr_status'))
            ->will($this->returnValue(false));
        $this->connection->expects($this->never())
            ->method('dropTable');
        $this->repairStep->run($this->output);
    }

    public function testRunMigration() {
        $this->connection->expects($this->exactly(2))
            ->method('tableExists')
            ->withConsecutive($this->equalTo('ocr_jobs'), $this->equalTo('ocr_status'))
            ->will($this->returnValue(true));
        $this->connection->expects($this->exactly(2))
            ->method('dropTable')
            ->withConsecutive($this->equalTo('ocr_jobs'), $this->equalTo('ocr_status'));
        $this->repairStep->run($this->output);
    }
}