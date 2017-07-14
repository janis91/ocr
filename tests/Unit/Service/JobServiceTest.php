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

use Test\TestCase;
use OCA\Ocr\Service\JobService;
use OCA\Ocr\Constants\OcrConstants;
use OCA\Ocr\Db\OcrJob;
use OCA\Ocr\Db\File;
use OCA\Ocr\Service\NotFoundException;
use OCP\AppFramework\Db\DoesNotExistException;


class JobServiceTest extends TestCase {

    protected $cut;

    protected $userId = 'john';

    protected $loggerMock;

    protected $l10nMock;

    protected $viewMock;

    protected $redisServiceMock;

    protected $jobMapperMock;

    protected $fileServiceMock;

    protected $appConfigServiceMock;

    protected $fileUtilMock;

    protected $phpUtilMock;

    protected $tempManagerMock;

    protected $fileInfoSharedPdf;

    protected $fileInfoSharedPng;

    protected $fileInfoNotSharedPdf;

    public function setUp() {
        $this->jobMapperMock = $this->getMockBuilder('OCA\Ocr\Db\OcrJobMapper')
            ->disableOriginalConstructor()
            ->getMock();
        $this->loggerMock = $this->getMockBuilder('OCP\ILogger')
            ->getMock();
        $this->viewMock = $this->getMockBuilder('OC\Files\View')
            ->getMock();
        $this->l10nMock = $this->getMockBuilder('OCP\IL10N')
            ->getMock();
        $this->tempManagerMock = $this->getMockBuilder('OCP\ITempManager')
            ->getMock();
        $this->redisServiceMock = $this->getMockBuilder('OCA\Ocr\Service\RedisService')
            ->disableOriginalConstructor()
            ->getMock();
        $this->fileServiceMock = $this->getMockBuilder('OCA\Ocr\Service\FileService')
            ->disableOriginalConstructor()
            ->getMock();
        $this->appConfigServiceMock = $this->getMockBuilder('OCA\Ocr\Service\AppConfigService')
            ->disableOriginalConstructor()
            ->getMock();
        $this->fileUtilMock = $this->getMockBuilder('OCA\Ocr\Util\FileUtil')
            ->getMock();
        $this->phpUtilMock = $this->getMockBuilder('OCA\Ocr\Util\PHPUtil')
            ->disableOriginalConstructor()
            ->getMock();
        $this->fileInfoSharedPdf = new File(42, '/test/path/to/file.pdf', 'file.pdf', 'application/pdf', 'home::notJohn');
        $this->fileInfoSharedPng = new File(42, '/test/path/to/file.png', 'file.png', 'image/png', 'home::notJohn');
        $this->fileInfoNotSharedPdf = new File(42, '/test/path/to/file.pdf', 'file.pdf', 'application/pdf', 'home::john');
        $this->cut = new JobService($this->l10nMock, $this->loggerMock, $this->userId, $this->viewMock, 
                $this->tempManagerMock, $this->redisServiceMock, $this->jobMapperMock, $this->fileServiceMock, 
                $this->appConfigServiceMock, $this->phpUtilMock, $this->fileUtilMock);
    }

    /**
     * @expectedException OCA\Ocr\Service\NotFoundException
     * @expectedExceptionMessage Empty parameters passed.
     */
    public function testProcessEmptyParameters() {
        $files = '';
        $languages = [
                'any'
        ];
        $this->l10nMock->expects($this->once())
            ->method('t')
            ->with('Empty parameters passed.')
            ->will($this->returnValue('Empty parameters passed.'));
        $this->cut->process($languages, $files);
    }

    /**
     * @expectedException OCA\Ocr\Service\NotFoundException
     * @expectedExceptionMessage Empty parameters passed.
     */
    public function testProcessNotAcceptedLanguage() {
        $files = [
                'id' => 1
        ];
        $languages = [
                'fra'
        ];
        $this->appConfigServiceMock->expects($this->once())
            ->method('getAppValue')
            ->with('languages')
            ->will($this->returnValue('deu;eng;spa;deu-frak'));
        $this->l10nMock->expects($this->once())
            ->method('t')
            ->with('Empty parameters passed.')
            ->will($this->returnValue('Empty parameters passed.'));
        $this->cut->process($languages, $files);
    }

    /**
     * @expectedException OCA\Ocr\Service\NotFoundException
     * @expectedExceptionMessage Empty parameters passed.
     */
    public function testProcessNoSpecificNoLanguage() {
        $files = [
                'id' => 1
        ];
        $languages = [
                ''
        ];
        $this->appConfigServiceMock->expects($this->once())
            ->method('getAppValue')
            ->with('languages')
            ->will($this->returnValue('deu;eng;spa;deu-frak'));
        $this->l10nMock->expects($this->once())
            ->method('t')
            ->with('Empty parameters passed.')
            ->will($this->returnValue('Empty parameters passed.'));
        $this->cut->process($languages, $files);
    }

    public function testProcessSpecificNoLanguage() {
        $files = [
                [
                        'id' => 1
                ],
                [
                        'id' => 2
                ],
                [
                        'id' => 3
                ]
        ];
        $languages = [
                'any'
        ];
        $this->appConfigServiceMock->expects($this->once())
            ->method('getAppValue')
            ->with('languages')
            ->will($this->returnValue('deu;eng;spa;deu-frak'));
        $this->fileServiceMock->expects($this->once())
            ->method('buildFileInfo')
            ->with($files)
            ->will(
                $this->returnValue(
                        [
                                $this->fileInfoNotSharedPdf,
                                $this->fileInfoSharedPdf,
                                $this->fileInfoSharedPng
                        ]));
        // foreach from here on
        $this->fileServiceMock->expects($this->exactly(3))
            ->method('checkSharedWithInitiator')
            ->withConsecutive([
                $this->fileInfoNotSharedPdf
        ], [
                $this->fileInfoSharedPdf
        ], [
                $this->fileInfoSharedPng
        ])
            ->will($this->onConsecutiveCalls(false, true, true));
        $this->fileServiceMock->expects($this->exactly(3))
            ->method('buildTarget')
            ->withConsecutive([
                $this->fileInfoNotSharedPdf,
                false
        ], [
                $this->fileInfoSharedPdf,
                true
        ], [
                $this->fileInfoSharedPng,
                true
        ])
            ->will(
                $this->onConsecutiveCalls('/test/path/to/file_OCR.pdf', '/test/path/to/file_OCR.pdf', 
                        '/test/path/to/file_OCR.txt'));
        $this->fileServiceMock->expects($this->exactly(3))
            ->method('buildSource')
            ->withConsecutive([
                $this->fileInfoNotSharedPdf,
                false
        ], [
                $this->fileInfoSharedPdf,
                true
        ], [
                $this->fileInfoSharedPng,
                true
        ])
            ->will(
                $this->onConsecutiveCalls('john/' . $this->fileInfoNotSharedPdf->getPath(), 
                        'notJohn/' . $this->fileInfoSharedPdf->getPath(), 
                        'notJohn/' . $this->fileInfoSharedPng->getPath()));
        $this->fileServiceMock->expects($this->exactly(3))
            ->method('getCorrectType')
            ->withConsecutive([
                $this->fileInfoNotSharedPdf
        ], [
                $this->fileInfoSharedPdf
        ], [
                $this->fileInfoSharedPng
        ])
            ->will($this->onConsecutiveCalls(OcrConstants::OCRmyPDF, OcrConstants::OCRmyPDF, OcrConstants::TESSERACT));
        // step into tempfile creation
        $this->tempManagerMock->expects($this->exactly(3))
            ->method('getTempBaseDir')
            ->will($this->returnValue('/tmp'));
        $this->phpUtilMock->expects($this->exactly(3))
            ->method('tempnamWrapper')
            ->with('/tmp', OcrConstants::TEMPFILE_PREFIX)
            ->will($this->returnValue('/tmp/ocr_randomTempFileName'));
        // only one png
        $this->phpUtilMock->expects($this->once())
            ->method('unlinkWrapper')
            ->with('/tmp/ocr_randomTempFileName');
        $this->phpUtilMock->expects($this->once())
            ->method('touchWrapper')
            ->with('/tmp/ocr_randomTempFileName.txt');
        $this->phpUtilMock->expects($this->once())
            ->method('chmodWrapper')
            ->with('/tmp/ocr_randomTempFileName.txt', 0600);
        // step out from tempfile creation
        $job1 = new OcrJob(OcrConstants::STATUS_PENDING, 'john/' . $this->fileInfoNotSharedPdf->getPath(), 
                '/test/path/to/file_OCR.pdf', '/tmp/ocr_randomTempFileName', OcrConstants::OCRmyPDF, $this->userId, 
                false, $this->fileInfoSharedPdf->getName(), null);
        $job2 = new OcrJob(OcrConstants::STATUS_PENDING, 'notJohn/' . $this->fileInfoSharedPdf->getPath(), 
                '/test/path/to/file_OCR.pdf', '/tmp/ocr_randomTempFileName', OcrConstants::OCRmyPDF, $this->userId, 
                false, $this->fileInfoSharedPdf->getName(), null);
        $job3 = new OcrJob(OcrConstants::STATUS_PENDING, 'notJohn/' . $this->fileInfoSharedPng->getPath(), 
                '/test/path/to/file_OCR.txt', '/tmp/ocr_randomTempFileName.txt', OcrConstants::TESSERACT, $this->userId, 
                false, $this->fileInfoSharedPng->getName(), null);
        $this->redisServiceMock->expects($this->exactly(3))
            ->method('sendJob')
            ->withConsecutive([
                $job1,
                []
        ], [
                $job2,
                []
        ], [
                $job3,
                []
        ]);
        $result = $this->cut->process($languages, $files);
        $this->assertEquals('PROCESSING', $result);
    }

    public function testProcessWithLanguages() {
        $files = [
                [
                        'id' => 1
                ],
                [
                        'id' => 2
                ],
                [
                        'id' => 3
                ]
        ];
        $languages = [
                'deu',
                'deu-frak'
        ];
        $this->appConfigServiceMock->expects($this->once())
            ->method('getAppValue')
            ->with('languages')
            ->will($this->returnValue('deu;eng;spa;deu-frak'));
        $this->fileServiceMock->expects($this->once())
            ->method('buildFileInfo')
            ->with($files)
            ->will(
                $this->returnValue(
                        [
                                $this->fileInfoNotSharedPdf,
                                $this->fileInfoSharedPdf,
                                $this->fileInfoSharedPng
                        ]));
        // foreach from here on
        $this->fileServiceMock->expects($this->exactly(3))
            ->method('checkSharedWithInitiator')
            ->withConsecutive([
                $this->fileInfoNotSharedPdf
        ], [
                $this->fileInfoSharedPdf
        ], [
                $this->fileInfoSharedPng
        ])
            ->will($this->onConsecutiveCalls(false, true, true));
        $this->fileServiceMock->expects($this->exactly(3))
            ->method('buildTarget')
            ->withConsecutive([
                $this->fileInfoNotSharedPdf,
                false
        ], [
                $this->fileInfoSharedPdf,
                true
        ], [
                $this->fileInfoSharedPng,
                true
        ])
            ->will(
                $this->onConsecutiveCalls('/test/path/to/file_OCR.pdf', '/test/path/to/file_OCR.pdf', 
                        '/test/path/to/file_OCR.txt'));
        $this->fileServiceMock->expects($this->exactly(3))
            ->method('buildSource')
            ->withConsecutive(
                [
                        $this->fileInfoNotSharedPdf,
                        false
                ], [
                        $this->fileInfoSharedPdf,
                        true
                ], [
                        $this->fileInfoSharedPng,
                        true
                ])
            ->will(
                $this->onConsecutiveCalls('john/' . $this->fileInfoNotSharedPdf->getPath(), 
                        'notJohn/' . $this->fileInfoSharedPdf->getPath(), 
                        'notJohn/' . $this->fileInfoSharedPng->getPath()));
        $this->fileServiceMock->expects($this->exactly(3))
            ->method('getCorrectType')
            ->withConsecutive([
                $this->fileInfoNotSharedPdf
        ], [
                $this->fileInfoSharedPdf
        ], [
                $this->fileInfoSharedPng
        ])
            ->will($this->onConsecutiveCalls(OcrConstants::OCRmyPDF, OcrConstants::OCRmyPDF, OcrConstants::TESSERACT));
        // step into tempfile creation
        $this->tempManagerMock->expects($this->exactly(3))
            ->method('getTempBaseDir')
            ->will($this->returnValue('/tmp'));
        $this->phpUtilMock->expects($this->exactly(3))
            ->method('tempnamWrapper')
            ->with('/tmp', OcrConstants::TEMPFILE_PREFIX)
            ->will($this->returnValue('/tmp/ocr_randomTempFileName'));
        // only one png
        $this->phpUtilMock->expects($this->once())
            ->method('unlinkWrapper')
            ->with('/tmp/ocr_randomTempFileName');
        $this->phpUtilMock->expects($this->once())
            ->method('touchWrapper')
            ->with('/tmp/ocr_randomTempFileName.txt');
        $this->phpUtilMock->expects($this->once())
            ->method('chmodWrapper')
            ->with('/tmp/ocr_randomTempFileName.txt', 0600);
        // step out from tempfile creation
        $job1 = new OcrJob(OcrConstants::STATUS_PENDING, 'john/' . $this->fileInfoNotSharedPdf->getPath(), 
                '/test/path/to/file_OCR.pdf', '/tmp/ocr_randomTempFileName', OcrConstants::OCRmyPDF, $this->userId, 
                false, $this->fileInfoNotSharedPdf->getName(), null);
        $job2 = new OcrJob(OcrConstants::STATUS_PENDING, 'notJohn/' . $this->fileInfoSharedPdf->getPath(), 
                '/test/path/to/file_OCR.pdf', '/tmp/ocr_randomTempFileName', OcrConstants::OCRmyPDF, $this->userId, 
                false, $this->fileInfoSharedPdf->getName(), null);
        $job3 = new OcrJob(OcrConstants::STATUS_PENDING, 'notJohn/' . $this->fileInfoSharedPng->getPath(), 
                '/test/path/to/file_OCR.txt', '/tmp/ocr_randomTempFileName.txt', OcrConstants::TESSERACT, $this->userId, 
                false, $this->fileInfoSharedPng->getName(), null);
        $this->redisServiceMock->expects($this->exactly(3))
            ->method('sendJob')
            ->withConsecutive([
                $job1,
                $languages
        ], [
                $job2,
                $languages
        ], [
                $job3,
                $languages
        ]);
        $result = $this->cut->process($languages, $files);
        $this->assertEquals('PROCESSING', $result);
    }

    /**
     * @expectedException OCA\Ocr\Service\NotFoundException
     * @expectedExceptionMessage Temp file cannot be created.
     */
    public function testProcessTempFileCreationFail() {
        $files = [
                [
                        'id' => 1
                ],
                [
                        'id' => 2
                ],
                [
                        'id' => 3
                ]
        ];
        $languages = [
                'any'
        ];
        $this->appConfigServiceMock->expects($this->once())
            ->method('getAppValue')
            ->with('languages')
            ->will($this->returnValue('deu;eng;spa;deu-frak'));
        $this->fileServiceMock->expects($this->once())
            ->method('buildFileInfo')
            ->with($files)
            ->will(
                $this->returnValue(
                        [
                                $this->fileInfoNotSharedPdf,
                                $this->fileInfoSharedPdf,
                                $this->fileInfoSharedPng
                        ]));
        // foreach from here on
        $this->fileServiceMock->expects($this->once())
            ->method('checkSharedWithInitiator')
            ->with($this->fileInfoNotSharedPdf)
            ->will($this->returnValue(false));
        $this->fileServiceMock->expects($this->once())
            ->method('buildTarget')
            ->with($this->fileInfoNotSharedPdf, false)
            ->will($this->returnValue('/test/path/to/file_OCR.pdf'));
        $this->fileServiceMock->expects($this->once())
            ->method('buildSource')
            ->with($this->fileInfoNotSharedPdf, false)
            ->will($this->returnValue('john/' . $this->fileInfoNotSharedPdf->getPath()));
        $this->fileServiceMock->expects($this->once())
            ->method('getCorrectType')
            ->with($this->fileInfoNotSharedPdf)
            ->will($this->returnValue(OcrConstants::OCRmyPDF));
        // step into tempfile creation
        $this->tempManagerMock->expects($this->once())
            ->method('getTempBaseDir')
            ->will($this->returnValue('/tmp'));
        $this->phpUtilMock->expects($this->once())
            ->method('tempnamWrapper')
            ->with('/tmp', OcrConstants::TEMPFILE_PREFIX)
            ->will($this->throwException(new NotFoundException('Temp file cannot be created.')));
        $this->cut->process($languages, $files);
    }

    /**
     * @expectedException OCA\Ocr\Service\NotFoundException
     * @expectedExceptionMessage Cannot delete temporary file during temp file creation for Tesseract.
     */
    public function testProcessTempFileDeletionFail() {
        $files = [
                [
                        'id' => 1
                ],
                [
                        'id' => 2
                ],
                [
                        'id' => 3
                ]
        ];
        $languages = [
                'any'
        ];
        $this->appConfigServiceMock->expects($this->once())
            ->method('getAppValue')
            ->with('languages')
            ->will($this->returnValue('deu;eng;spa;deu-frak'));
        $this->fileServiceMock->expects($this->once())
            ->method('buildFileInfo')
            ->with($files)
            ->will(
                $this->returnValue(
                        [
                                $this->fileInfoSharedPng,
                                $this->fileInfoNotSharedPdf,
                                $this->fileInfoSharedPdf
                        ]));
        // foreach from here on
        $this->fileServiceMock->expects($this->once())
            ->method('checkSharedWithInitiator')
            ->with($this->fileInfoSharedPng)
            ->will($this->returnValue(true));
        $this->fileServiceMock->expects($this->once())
            ->method('buildTarget')
            ->with($this->fileInfoSharedPng, true)
            ->will($this->returnValue('/test/path/to/file_OCR.txt'));
        $this->fileServiceMock->expects($this->once())
            ->method('buildSource')
            ->with($this->fileInfoSharedPng, true)
            ->will($this->returnValue('john/' . $this->fileInfoSharedPng->getPath()));
        $this->fileServiceMock->expects($this->once())
            ->method('getCorrectType')
            ->with($this->fileInfoSharedPng)
            ->will($this->returnValue(OcrConstants::TESSERACT));
        // step into tempfile creation
        $this->tempManagerMock->expects($this->once())
            ->method('getTempBaseDir')
            ->will($this->returnValue('/tmp'));
        $this->phpUtilMock->expects($this->once())
            ->method('tempnamWrapper')
            ->with('/tmp', OcrConstants::TEMPFILE_PREFIX)
            ->will($this->returnValue('/tmp/ocr_randomTempFileName'));
        $this->phpUtilMock->expects($this->once())
            ->method('unlinkWrapper')
            ->with('/tmp/ocr_randomTempFileName')
            ->willThrowException(
                new NotFoundException('Cannot delete temporary file during temp file creation for Tesseract.'));
        $this->cut->process($languages, $files);
    }

    /**
     * @expectedException OCA\Ocr\Service\NotFoundException
     * @expectedExceptionMessage Cannot create temporary file for Tesseract.
     */
    public function testProcessTempFileCreationForTesseractFail() {
        $files = [
                [
                        'id' => 1
                ],
                [
                        'id' => 2
                ],
                [
                        'id' => 3
                ]
        ];
        $languages = [
                'any'
        ];
        $this->appConfigServiceMock->expects($this->once())
            ->method('getAppValue')
            ->with('languages')
            ->will($this->returnValue('deu;eng;spa;deu-frak'));
        $this->fileServiceMock->expects($this->once())
            ->method('buildFileInfo')
            ->with($files)
            ->will(
                $this->returnValue(
                        [
                                $this->fileInfoSharedPng,
                                $this->fileInfoNotSharedPdf,
                                $this->fileInfoSharedPdf
                        ]));
        // foreach from here on
        $this->fileServiceMock->expects($this->once())
            ->method('checkSharedWithInitiator')
            ->with($this->fileInfoSharedPng)
            ->will($this->returnValue(true));
        $this->fileServiceMock->expects($this->once())
            ->method('buildTarget')
            ->with($this->fileInfoSharedPng, true)
            ->will($this->returnValue('/test/path/to/file_OCR.txt'));
        $this->fileServiceMock->expects($this->once())
            ->method('buildSource')
            ->with($this->fileInfoSharedPng, true)
            ->will($this->returnValue('john/' . $this->fileInfoSharedPng->getPath()));
        $this->fileServiceMock->expects($this->once())
            ->method('getCorrectType')
            ->with($this->fileInfoSharedPng)
            ->will($this->returnValue(OcrConstants::TESSERACT));
        // step into tempfile creation
        $this->tempManagerMock->expects($this->once())
            ->method('getTempBaseDir')
            ->will($this->returnValue('/tmp'));
        $this->phpUtilMock->expects($this->once())
            ->method('tempnamWrapper')
            ->with('/tmp', OcrConstants::TEMPFILE_PREFIX)
            ->will($this->returnValue('/tmp/ocr_randomTempFileName'));
        $this->phpUtilMock->expects($this->once())
            ->method('unlinkWrapper')
            ->with('/tmp/ocr_randomTempFileName');
        $this->phpUtilMock->expects($this->once())
            ->method('touchWrapper')
            ->with('/tmp/ocr_randomTempFileName.txt')
            ->willThrowException(new NotFoundException('Cannot create temporary file for Tesseract.'));
        $this->cut->process($languages, $files);
    }

    /**
     * @expectedException OCA\Ocr\Service\NotFoundException
     * @expectedExceptionMessage Cannot set permissions to temporary file for Tesseract.
     */
    public function testProcessTempFileSetPermissionsForTesseractFail() {
        $files = [
                [
                        'id' => 1
                ],
                [
                        'id' => 2
                ],
                [
                        'id' => 3
                ]
        ];
        $languages = [
                'any'
        ];
        $this->appConfigServiceMock->expects($this->once())
            ->method('getAppValue')
            ->with('languages')
            ->will($this->returnValue('deu;eng;spa;deu-frak'));
        $this->fileServiceMock->expects($this->once())
            ->method('buildFileInfo')
            ->with($files)
            ->will(
                $this->returnValue(
                        [
                                $this->fileInfoSharedPng,
                                $this->fileInfoNotSharedPdf,
                                $this->fileInfoSharedPdf
                        ]));
        // foreach from here on
        $this->fileServiceMock->expects($this->once())
            ->method('checkSharedWithInitiator')
            ->with($this->fileInfoSharedPng)
            ->will($this->returnValue(true));
        $this->fileServiceMock->expects($this->once())
            ->method('buildTarget')
            ->with($this->fileInfoSharedPng, true)
            ->will($this->returnValue('/test/path/to/file_OCR.txt'));
        $this->fileServiceMock->expects($this->once())
            ->method('buildSource')
            ->with($this->fileInfoSharedPng, true)
            ->will($this->returnValue('john/' . $this->fileInfoSharedPng->getPath()));
        $this->fileServiceMock->expects($this->once())
            ->method('getCorrectType')
            ->with($this->fileInfoSharedPng)
            ->will($this->returnValue(OcrConstants::TESSERACT));
        // step into tempfile creation
        $this->tempManagerMock->expects($this->once())
            ->method('getTempBaseDir')
            ->will($this->returnValue('/tmp'));
        $this->phpUtilMock->expects($this->once())
            ->method('tempnamWrapper')
            ->with('/tmp', OcrConstants::TEMPFILE_PREFIX)
            ->will($this->returnValue('/tmp/ocr_randomTempFileName'));
        $this->phpUtilMock->expects($this->once())
            ->method('unlinkWrapper')
            ->with('/tmp/ocr_randomTempFileName');
        $this->phpUtilMock->expects($this->once())
            ->method('touchWrapper')
            ->with('/tmp/ocr_randomTempFileName.txt');
        $this->phpUtilMock->expects($this->once())
            ->method('chmodWrapper')
            ->with('/tmp/ocr_randomTempFileName.txt', 0600)
            ->willThrowException(new NotFoundException('Cannot set permissions to temporary file for Tesseract.'));
        $this->cut->process($languages, $files);
    }

    /**
     * @expectedException OCA\Ocr\Service\NotFoundException
     * @expectedExceptionMessage Cannot delete because of wrong owner.
     */
    public function testDeleteJobWrongOwner() {
        $job = new OcrJob(OcrConstants::STATUS_PENDING, 'john/' . $this->fileInfoNotSharedPdf->getPath(), 
                '/test/path/to/file_OCR.pdf', '/tmp/ocr_randomTempFileName', OcrConstants::OCRmyPDF, 'notJohn', false, 
                $this->fileInfoSharedPdf->getName(), null);
        $job->setId(1);
        $this->jobMapperMock->expects($this->once())
            ->method('find')
            ->with(1)
            ->will($this->returnValue($job));
        $this->l10nMock->expects($this->once())
            ->method('t')
            ->with('Cannot delete because of wrong owner.')
            ->will($this->returnValue('Cannot delete because of wrong owner.'));
        $this->cut->deleteJob(1, $this->userId);
    }

    /**
     * @expectedException OCA\Ocr\Service\NotFoundException
     * @expectedExceptionMessage Cannot delete because of wrong ID.
     */
    public function testDeleteJobWrongID() {
        $this->jobMapperMock->expects($this->once())
            ->method('find')
            ->with(1)
            ->willThrowException(new DoesNotExistException('any'));
        $this->l10nMock->expects($this->once())
            ->method('t')
            ->with('Cannot delete because of wrong ID.')
            ->will($this->returnValue('Cannot delete because of wrong ID.'));
        $this->cut->deleteJob(1, $this->userId);
    }

    public function testDeleteJob() {
        $job = new OcrJob(OcrConstants::STATUS_FAILED, 'john/' . $this->fileInfoNotSharedPdf->getPath(), 
                '/test/path/to/file_OCR.pdf', '/tmp/ocr_randomTempFileName', OcrConstants::OCRmyPDF, $this->userId, 
                false, $this->fileInfoNotSharedPdf->getName(), 'testLog');
        $job->setId(1);
        $this->jobMapperMock->expects($this->once())
            ->method('find')
            ->with(1)
            ->will($this->returnValue($job));
        $this->jobMapperMock->expects($this->once())
            ->method('delete')
            ->with($job)
            ->will($this->returnValue($job));
        $result = $this->cut->deleteJob(1, $this->userId);
        $this->assertNull($result->getErrorLog());
        $this->assertNull($result->getErrorDisplayed());
        $this->assertNull($result->getSource());
        $this->assertNull($result->getStatus());
        $this->assertNull($result->getTarget());
        $this->assertNull($result->getTempFile());
        $this->assertNull($result->getType());
        $this->assertNull($result->getUserId());
        $this->assertEquals(1, $result->getId());
        $this->assertEquals($this->fileInfoNotSharedPdf->getName(), $result->getOriginalFilename());
    }

    public function testGetAllJobsForUser() {
        $job1 = new OcrJob(OcrConstants::STATUS_FAILED, 'john/' . $this->fileInfoNotSharedPdf->getPath(), 
                '/test/path/to/file_OCR.pdf', '/tmp/ocr_randomTempFileName', OcrConstants::OCRmyPDF, $this->userId, 
                false, $this->fileInfoNotSharedPdf->getName(), 'testLog');
        $job1->setId(1);
        $job2 = new OcrJob(OcrConstants::STATUS_PENDING, 'notJohn/' . $this->fileInfoSharedPng->getPath(), 
                '/test/path/to/file_OCR.txt', '/tmp/ocr_randomTempFileName.txt', OcrConstants::TESSERACT, $this->userId, 
                true, $this->fileInfoSharedPng->getName(), null);
        $job2->setId(2);
        $this->jobMapperMock->expects($this->once())
            ->method('findAll')
            ->with($this->userId)
            ->will($this->returnValue([
                $job1,
                $job2
        ]));
        $result = $this->cut->getAllJobsForUser($this->userId);
        $this->assertEquals(1, $result[0]->getId());
        $this->assertEquals($this->fileInfoNotSharedPdf->getName(), $result[0]->getOriginalFilename());
        $this->assertEquals(OcrConstants::STATUS_FAILED, $result[0]->getStatus());
        $this->assertEquals('testLog', $result[0]->getErrorLog());
        $this->assertNull($result[0]->getErrorDisplayed());
        $this->assertNull($result[0]->getSource());
        $this->assertNull($result[0]->getTarget());
        $this->assertNull($result[0]->getTempFile());
        $this->assertNull($result[0]->getType());
        $this->assertNull($result[0]->getUserId());
        $this->assertEquals(2, $result[1]->getId());
        $this->assertEquals($this->fileInfoSharedPng->getName(), $result[1]->getOriginalFilename());
        $this->assertEquals(OcrConstants::STATUS_PENDING, $result[1]->getStatus());
        $this->assertNull($result[1]->getErrorLog());
        $this->assertNull($result[1]->getErrorDisplayed());
        $this->assertNull($result[1]->getSource());
        $this->assertNull($result[1]->getTarget());
        $this->assertNull($result[1]->getTempFile());
        $this->assertNull($result[1]->getType());
        $this->assertNull($result[1]->getUserId());
    }

    /**
     * @expectedException OCA\Ocr\Service\NotFoundException
     * @expectedExceptionMessage Reading the finished jobs from Redis went wrong.
     */
    public function testCheckForFinishedJobsRetrievedDataCorrupt() {
        $json = '';
        $this->redisServiceMock->expects($this->once())
            ->method('readingFinishedJobs')
            ->will($this->returnValue($json));
        $this->l10nMock->expects($this->once())
            ->method('t')
            ->with('Reading the finished jobs from Redis went wrong.')
            ->will($this->returnValue('Reading the finished jobs from Redis went wrong.'));
        $this->cut->checkForFinishedJobs();
    }

    public function testCheckForFinishedJobsSuccessfully() {
        $job1 = new OcrJob(OcrConstants::STATUS_PENDING, 'john/' . $this->fileInfoNotSharedPdf->getPath(), 
                '/test/path/to/file_OCR.pdf', '/tmp/ocr_randomTempFileName', OcrConstants::OCRmyPDF, $this->userId, 
                false, $this->fileInfoNotSharedPdf->getName(), null);
        $job1->setId(1);
        $job2 = new OcrJob(OcrConstants::STATUS_PENDING, 'notJohn/' . $this->fileInfoSharedPng->getPath(), 
                '/test/path/to/file_OCR.txt', '/tmp/ocr_randomTempFileName.txt', OcrConstants::TESSERACT, $this->userId, 
                false, $this->fileInfoSharedPng->getName(), null);
        $job2->setId(2);
        $redisFinishedJobs = [
                '{"id":1,"error":false,"log":""}',
                '{"id":2,"error":true,"log":"big fail"}'
        ];
        $this->redisServiceMock->expects($this->once())
            ->method('readingFinishedJobs')
            ->will($this->returnValue($redisFinishedJobs));
        // foreach
        $this->jobMapperMock->expects($this->exactly(2))
            ->method('find')
            ->withConsecutive([
                1
        ], [
                2
        ])
            ->will($this->onConsecutiveCalls($job1, $job2));
        $job1->setStatus(OcrConstants::STATUS_PROCESSED);
        $job2->setStatus(OcrConstants::STATUS_FAILED);
        $job2->setErrorLog('big fail');
        $this->jobMapperMock->expects($this->exactly(2))
            ->method('update')
            ->withConsecutive([
                $job1
        ], [
                $job2
        ]);
        $this->cut->checkForFinishedJobs();
    }

    /**
     * @expectedException OCA\Ocr\Service\NotFoundException
     * @expectedExceptionMessage Temp file does not exist.
     */
    public function testHandleProcessedFileNotExists() {
        $job1 = new OcrJob(OcrConstants::STATUS_PROCESSED, 'john/' . $this->fileInfoNotSharedPdf->getPath(), 
                '/test/path/to/file_OCR.pdf', '/tmp/ocr_randomTempFileName', OcrConstants::OCRmyPDF, $this->userId, 
                false, $this->fileInfoNotSharedPdf->getName(), null);
        $job1->setId(1);
        $this->jobMapperMock->expects($this->once())
            ->method('findAllProcessed')
            ->with($this->userId)
            ->will($this->returnValue([
                $job1
        ]));
        $this->l10nMock->expects($this->once())
            ->method('t')
            ->with('Temp file does not exist.')
            ->will($this->returnValue('Temp file does not exist.'));
        $this->fileUtilMock->expects($this->once())
            ->method('fileExists')
            ->with($job1->getTempFile())
            ->will($this->returnValue(false));
        $job1->setStatus(OcrConstants::STATUS_FAILED);
        $job1->setErrorLog('Temp file does not exist.');
        $this->jobMapperMock->expects($this->once())
            ->method('update')
            ->with($job1);
        $this->cut->handleProcessed();
    }

    public function testHandleProcessed() {
        $job1 = new OcrJob(OcrConstants::STATUS_PROCESSED, 'john/' . $this->fileInfoNotSharedPdf->getPath(), 
                '/test/path/to/file_OCR.pdf', '/tmp/ocr_randomTempFileName', OcrConstants::OCRmyPDF, $this->userId, 
                false, $this->fileInfoNotSharedPdf->getName(), null);
        $job1->setId(1);
        $job2 = new OcrJob(OcrConstants::STATUS_PROCESSED, 'notJohn/' . $this->fileInfoSharedPng->getPath(), 
                '/test/path/to/file_OCR.txt', '/tmp/ocr_randomTempFileName.txt', OcrConstants::TESSERACT, $this->userId, 
                false, $this->fileInfoSharedPng->getName(), null);
        $job2->setId(2);
        $this->jobMapperMock->expects($this->once())
            ->method('findAllProcessed')
            ->with($this->userId)
            ->will($this->returnValue([
                $job1,
                $job2
        ]));
        $this->fileUtilMock->expects($this->exactly(2))
            ->method('fileExists')
            ->withConsecutive([
                $job1->getTempFile()
        ], [
                $job2->getTempFile()
        ])
            ->will($this->returnValue(true));
        $this->fileUtilMock->expects($this->exactly(2))
            ->method('getFileContents')
            ->withConsecutive([
                $job1->getTempFile()
        ], [
                $job2->getTempFile()
        ])
            ->will($this->onConsecutiveCalls('stream1', 'stream2'));
        $this->viewMock->expects($this->exactly(2))
            ->method('file_put_contents')
            ->withConsecutive([
                $job1->getTarget(),
                'stream1'
        ], [
                $job2->getTarget(),
                'stream2'
        ]);
        $this->jobMapperMock->expects($this->exactly(2))
            ->method('delete')
            ->withConsecutive([
                $job1
        ], [
                $job2
        ]);
        $this->fileUtilMock->expects($this->exactly(2))
            ->method('execRemove')
            ->withConsecutive([
                $job1->getTempFile()
        ], [
                $job2->getTempFile()
        ]);
        $result = $this->cut->handleProcessed();
        $this->assertEquals([$job1, $job2], $result);
    }

    public function testHandleFailed() {
        $job1 = new OcrJob(OcrConstants::STATUS_FAILED, 'john/' . $this->fileInfoNotSharedPdf->getPath(), 
                '/test/path/to/file_OCR.pdf', '/tmp/ocr_randomTempFileName', OcrConstants::OCRmyPDF, $this->userId, 
                false, $this->fileInfoNotSharedPdf->getName(), null);
        $job1->setId(1);
        $job2 = new OcrJob(OcrConstants::STATUS_FAILED, 'notJohn/' . $this->fileInfoSharedPng->getPath(), 
                '/test/path/to/file_OCR.txt', '/tmp/ocr_randomTempFileName.txt', OcrConstants::TESSERACT, $this->userId, 
                false, $this->fileInfoSharedPng->getName(), null);
        $job2->setId(2);
        $this->jobMapperMock->expects($this->once())
            ->method('findAllFailed')
            ->with($this->userId)
            ->will($this->returnValue([
                $job1,
                $job2
        ]));
        // foreach
        $this->fileUtilMock->expects($this->exactly(2))
            ->method('execRemove')
            ->withConsecutive([
                $job1->getTempFile()
        ], [
                $job2->getTempFile()
        ]);
        $job1Origin = $job1;
        $job2Origin= $job2;
        $job1->setErrorDisplayed(true);
        $job2->setErrorDisplayed(true);
        $this->jobMapperMock->expects($this->exactly(2))
            ->method('update')
            ->withConsecutive([
                $job1
        ], [
                $job2
        ]);
        $result = $this->cut->handleFailed();
        $this->assertEquals([$job1Origin, $job2Origin], $result);
    }
}