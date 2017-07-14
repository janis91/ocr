<?php

/**
 * Nextcloud - OCR
 * This file is licensed under the Affero General Public License version 3 or
 * later.
 * See the COPYING file.
 * 
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */
namespace OCA\Ocr\Tests\Unit\Service;

use OCA\Ocr\Service\RedisService;
use OCA\Ocr\Db\OcrJob;
use Test\TestCase;
use OCA\Ocr\Constants\OcrConstants;
use OCA\Ocr\Db\File;


class RedisServiceTest extends TestCase {

    protected $cut;

    protected $loggerMock;

    protected $l10nMock;

    protected $jobMapperMock;

    protected $fileUtilMock;

    protected $redisUtilMock;

    protected $redisMock;

    protected $fileInfoNotSharedPdf;

    public function setUp() {
        $this->jobMapperMock = $this->getMockBuilder('OCA\Ocr\Db\OcrJobMapper')
            ->disableOriginalConstructor()
            ->getMock();
        $this->loggerMock = $this->getMockBuilder('OCP\ILogger')
            ->getMock();
        $this->l10nMock = $this->getMockBuilder('OCP\IL10N')
            ->getMock();
        $this->redisUtilMock = $this->getMockBuilder('OCA\Ocr\Util\RedisUtil')
            ->disableOriginalConstructor()
            ->getMock();
        $this->fileUtilMock = $this->getMockBuilder('OCA\Ocr\Util\FileUtil')
            ->getMock();
        $this->redisMock = $this->getMockBuilder('Redis')
            ->getMock();
        $this->fileInfoNotSharedPdf = new File(42, '/test/path/to/file.pdf', 'file.pdf', 'application/pdf', 'home::john');
        $this->cut = new RedisService($this->jobMapperMock, $this->fileUtilMock, $this->redisUtilMock, $this->l10nMock, 
                $this->loggerMock);
    }

    public function testSendJob() {
        $languages = [
                'deu',
                'deu-frak'
        ];
        $job = new OcrJob(OcrConstants::STATUS_PENDING, 'john' . $this->fileInfoNotSharedPdf->getPath(), 
                '/test/path/to/file_OCR.pdf', '/tmp/ocr_randomTempFileName', OcrConstants::OCRmyPDF, 'john', false, 
                $this->fileInfoNotSharedPdf->getName(), null);
        $this->redisUtilMock->expects($this->once())
            ->method('setupRedisInstance')
            ->will($this->returnValue($this->redisMock));
        $jobInserted = $job;
        $jobInserted->setId(1);
        $this->jobMapperMock->expects($this->once())
            ->method('insert')
            ->with($job)
            ->will($this->returnValue($jobInserted));
        $msg = json_encode(
                [
                        'id' => 1,
                        'type' => 1,
                        'source' => 'john/test/path/to/file.pdf',
                        'tempFile' => '/tmp/ocr_randomTempFileName',
                        'languages' => $languages
                ]);
        $this->redisMock->expects($this->once())
            ->method('lPush')
            ->with(OcrConstants::REDIS_NEW_JOBS_QUEUE, $msg)
            ->will($this->returnValue(true));
        $this->cut->sendJob($job, $languages);
    }

    /**
     * @expectedException OCA\Ocr\Service\NotFoundException
     * @expectedExceptionMessage Could not add files to the Redis OCR processing queue.
     */
    public function testSendJobFailed() {
        $languages = [
                'deu',
                'deu-frak'
        ];
        $job = new OcrJob(OcrConstants::STATUS_PENDING, 'john' . $this->fileInfoNotSharedPdf->getPath(), 
                '/test/path/to/file_OCR.pdf', '/tmp/ocr_randomTempFileName', OcrConstants::OCRmyPDF, 'john', false, 
                $this->fileInfoNotSharedPdf->getName(), null);
        $this->redisUtilMock->expects($this->once())
            ->method('setupRedisInstance')
            ->will($this->returnValue($this->redisMock));
        $jobInserted = $job;
        $jobInserted->setId(1);
        $this->jobMapperMock->expects($this->once())
            ->method('insert')
            ->with($job)
            ->will($this->returnValue($jobInserted));
        $msg = json_encode(
                [
                        'id' => 1,
                        'type' => 1,
                        'source' => 'john/test/path/to/file.pdf',
                        'tempFile' => '/tmp/ocr_randomTempFileName',
                        'languages' => $languages
                ]);
        $this->redisMock->expects($this->once())
            ->method('lPush')
            ->with(OcrConstants::REDIS_NEW_JOBS_QUEUE, $msg)
            ->will($this->returnValue(false));
        $this->l10nMock->expects($this->once())
            ->method('t')
            ->with('Could not add files to the Redis OCR processing queue.')
            ->will($this->returnValue('Could not add files to the Redis OCR processing queue.'));
        $this->fileUtilMock->expects($this->once())
            ->method('execRemove')
            ->with($jobInserted->getTempFile());
        $jobInserted->setStatus(OcrConstants::STATUS_FAILED);
        $jobInserted->setErrorLog('Could not add files to the Redis OCR processing queue.');
        $this->jobMapperMock->expects($this->once())
            ->method('update')
            ->with($jobInserted);
        $this->cut->sendJob($job, $languages);
    }

    public function testReadingFinishedJobs() {
        $this->redisUtilMock->expects($this->once())
            ->method('setupRedisInstance')
            ->will($this->returnValue($this->redisMock));
        $this->redisMock->expects($this->once())
            ->method('multi')
            ->will($this->returnValue($this->redisMock));
        $this->redisMock->expects($this->once())
            ->method('lRange')
            ->with(OcrConstants::REDIS_FINISHED_JOBS_QUEUE, 0, -1)
            ->will($this->returnValue($this->redisMock));
        $this->redisMock->expects($this->once())
            ->method('delete')
            ->with(OcrConstants::REDIS_FINISHED_JOBS_QUEUE)
            ->will($this->returnValue($this->redisMock));
        $this->redisMock->expects($this->once())
            ->method('exec')
            ->will($this->returnValue([
                'result'
        ]));
        $result = $this->cut->readingFinishedJobs();
        $this->assertEquals('result', $result);
    }
}