<?php

/**
 * Nextcloud - OCR
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 * 
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2020
 */
namespace OCA\Ocr\Migration;

use OCP\IDBConnection;
use OCP\Migration\IOutput;
use OCP\Migration\IRepairStep;


class DropOldTable implements IRepairStep {

    /** @var IDBConnection */
    protected $connection;

    /**
     *
     * @param IDBConnection $connection            
     */
    public function __construct(IDBConnection $connection) {
        $this->connection = $connection;
    }

    /**
     * @inheritDoc
     */
    public function getName() {
        return 'Drop old database table';
    }

    /**
     * @inheritDoc
     */
    public function run(IOutput $output) {
        $output->startProgress(1);
        if ($this->connection->tableExists('ocr_jobs')) {
            $this->connection->dropTable('ocr_jobs');
        }
        // still needed for downwards compatibility
        if ($this->connection->tableExists('ocr_status')) {
            $this->connection->dropTable('ocr_status');
        }
        $output->advance(1, "Drop old database table: ocr_jobs");
        $output->finishProgress();
    }
}