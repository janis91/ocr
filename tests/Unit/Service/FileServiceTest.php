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
use OCA\Ocr\Service\FileService;
use OCA\Ocr\Db\File;
use OCA\Ocr\Db\Share;
use OCA\Ocr\Constants\OcrConstants;


class FileServiceTest extends TestCase {

    protected $cut;

    protected $userId = 'john';

    protected $loggerMock;

    protected $l10nMock;

    protected $fileMapperMock;

    protected $shareMapperMock;

    protected $fileUtilMock;

    protected $fileInfoSharedPdf;
    
    protected $fileInfoSharedPdfOnRoot;

    protected $fileInfoSharedPng;

    protected $fileInfoNotSharedPdf;

    protected $fileInfoNotSharedPdfOnRoot;
    
    protected $fileInfoNotSharedPng;

    public function setUp() {
        $this->fileMapperMock = $this->getMockBuilder('OCA\Ocr\Db\FileMapper')
            ->disableOriginalConstructor()
            ->getMock();
        $this->shareMapperMock = $this->getMockBuilder('OCA\Ocr\Db\ShareMapper')
            ->disableOriginalConstructor()
            ->getMock();
        $this->loggerMock = $this->getMockBuilder('OCP\ILogger')
            ->getMock();
        $this->l10nMock = $this->getMockBuilder('OCP\IL10N')
            ->getMock();
        $this->fileUtilMock = $this->getMockBuilder('OCA\Ocr\Util\FileUtil')
            ->getMock();
        $this->fileInfoSharedPdf = new File(42, '/test/path/to/file.pdf', 'file.pdf', 'application/pdf', 'home::notJohn');
        $this->fileInfoSharedPdfOnRoot = new File(42, '/file.pdf', 'file.pdf', 'application/pdf', 'home::notJohn');
        $this->fileInfoSharedPng = new File(42, '/test/path/to/file.png', 'file.png', 'image/png', 'home::notJohn');
        $this->fileInfoNotSharedPdf = new File(42, '/test/path/to/file.pdf', 'file.pdf', 'application/pdf', 'home::john');
        $this->fileInfoNotSharedPdfOnRoot = new File(42, '/file.pdf', 'file.pdf', 'application/pdf', 'home::john');
        $this->fileInfoNotSharedPng = new File(42, '/test/path/to/file.png', 'file.png', 'image/png', 'home::john');
        $this->cut = new FileService($this->l10nMock, $this->loggerMock, $this->userId, $this->fileMapperMock, 
                $this->shareMapperMock, $this->fileUtilMock);
    }

    public function testCheckSharedWithInitiatorTruthy() {
        $result = $this->cut->checkSharedWithInitiator($this->fileInfoSharedPdf);
        $this->assertTrue($result);
    }

    public function testCheckSharedWithInitiatorFalsy() {
        $result = $this->cut->checkSharedWithInitiator($this->fileInfoNotSharedPdf);
        $this->assertFalse($result);
    }

    public function testBuildTargetForSharedForImage() {
        $share = new Share($this->fileInfoSharedPng->getPath());
        $this->shareMapperMock->expects($this->once())
            ->method('find')
            ->with(42, $this->userId, 'notJohn')
            ->will($this->returnValue($share));
        $this->fileUtilMock->expects($this->once())
            ->method('buildNotExistingFilename')
            ->with('test/path/to', 'file.txt')
            ->will($this->returnValue('/test/path/to/file.txt'));
        $result = $this->cut->buildTarget($this->fileInfoSharedPng, true, false);
        $this->assertEquals('/test/path/to/file.txt', $result);
    }

    public function testBuildTargetForSharedForPdf() {
        $share = new Share($this->fileInfoSharedPdf->getPath());
        $this->shareMapperMock->expects($this->once())
            ->method('find')
            ->with(42, $this->userId, 'notJohn')
            ->will($this->returnValue($share));
        $this->fileUtilMock->expects($this->once())
            ->method('buildNotExistingFilename')
            ->with('test/path/to', 'file.pdf')
            ->will($this->returnValue('/test/path/to/file.pdf'));
            $result = $this->cut->buildTarget($this->fileInfoSharedPdf, true, false);
        $this->assertEquals('/test/path/to/file.pdf', $result);
    }
    
    public function testBuildTargetForSharedForPdfAndReplace() {
        $share = new Share($this->fileInfoSharedPdf->getPath());
        $this->shareMapperMock->expects($this->once())
        ->method('find')
        ->with(42, $this->userId, 'notJohn')
        ->will($this->returnValue($share));
        $result = $this->cut->buildTarget($this->fileInfoSharedPdf, true, true);
        $this->assertEquals('test/path/to/file.pdf', $result);
    }
    
    public function testBuildTargetForSharedForPdfAndReplaceOnRoot() {
        $share = new Share($this->fileInfoSharedPdfOnRoot->getPath());
        $this->shareMapperMock->expects($this->once())
        ->method('find')
        ->with(42, $this->userId, 'notJohn')
        ->will($this->returnValue($share));
        $result = $this->cut->buildTarget($this->fileInfoSharedPdfOnRoot, true, true);
        $this->assertEquals('/file.pdf', $result);
    }

    public function testBuildTargetNotForSharedForImage() {
        $this->fileUtilMock->expects($this->once())
            ->method('buildNotExistingFilename')
            ->with('test/path/to', 'file.txt')
            ->will($this->returnValue('/test/path/to/file.txt'));
            $result = $this->cut->buildTarget($this->fileInfoNotSharedPng, false, false);
        $this->assertEquals('/test/path/to/file.txt', $result);
    }

    public function testBuildTargetNotForSharedForPdf() {
        $this->fileUtilMock->expects($this->once())
            ->method('buildNotExistingFilename')
            ->with('test/path/to', 'file.pdf')
            ->will($this->returnValue('/test/path/to/file.pdf'));
            $result = $this->cut->buildTarget($this->fileInfoNotSharedPdf, false, false);
        $this->assertEquals('/test/path/to/file.pdf', $result);
    }
    
    public function testBuildTargetNotForSharedForPdfAndReplace() {
        $result = $this->cut->buildTarget($this->fileInfoNotSharedPdf, false, true);
        $this->assertEquals('test/path/to/file.pdf', $result);
    }
    
    public function testBuildTargetNotForSharedForPdfAndReplaceOnRoot() {
        $result = $this->cut->buildTarget($this->fileInfoNotSharedPdfOnRoot, false, true);
        $this->assertEquals('/file.pdf', $result);
    }

    public function testBuildSourceForShared() {
        $result = $this->cut->buildSource($this->fileInfoSharedPdf, true);
        $this->assertEquals('notJohn/' . $this->fileInfoSharedPdf->getPath(), $result);
    }

    public function testBuildSourceForNotShared() {
        $result = $this->cut->buildSource($this->fileInfoNotSharedPdf, false);
        $this->assertEquals('john/' . $this->fileInfoNotSharedPdf->getPath(), $result);
    }

    public function testBuildFileInfoSuccessfully() {
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
        $this->fileMapperMock->expects($this->exactly(3))
            ->method('find')
            ->withConsecutive([
                1
        ], [
                2
        ], [
                3
        ])
            ->will(
                $this->onConsecutiveCalls($this->fileInfoSharedPng, $this->fileInfoNotSharedPdf, 
                        $this->fileInfoSharedPdf));
        $result = $this->cut->buildFileInfo($files);
        $this->assertEquals(
                [
                        $this->fileInfoSharedPng,
                        $this->fileInfoNotSharedPdf,
                        $this->fileInfoSharedPdf
                ], $result);
    }

    /**
     * @expectedException OCA\Ocr\Service\NotFoundException
     * @expectedExceptionMessage Wrong parameter.
     */
    public function testBuildFileInfoEmptyFirstId() {
        $this->l10nMock->expects($this->once())
            ->method('t')
            ->with('Wrong parameter.')
            ->will($this->returnValue('Wrong parameter.'));
        $files = [
                [
                        'id' => ''
                ],
                [
                        'id' => 2
                ],
                [
                        'id' => 3
                ]
        ];
        $this->fileMapperMock->expects($this->never())
            ->method('find');
        $this->cut->buildFileInfo($files);
    }

    /**
     * @expectedException OCA\Ocr\Service\NotFoundException
     * @expectedExceptionMessage Wrong parameter.
     */
    public function testBuildFileInfoEmptyLastId() {
        $this->l10nMock->expects($this->once())
            ->method('t')
            ->with('Wrong parameter.')
            ->will($this->returnValue('Wrong parameter.'));
        $files = [
                [
                        'id' => 1
                ],
                [
                        'id' => 2
                ],
                [
                        'id' => null
                ]
        ];
        $this->fileMapperMock->expects($this->exactly(2))
            ->method('find')
            ->withConsecutive([
                1
        ], [
                2
        ])
            ->will($this->onConsecutiveCalls($this->fileInfoSharedPng, $this->fileInfoNotSharedPdf));
        $this->cut->buildFileInfo($files);
    }

    /**
     * @expectedException OCA\Ocr\Service\NotFoundException
     * @expectedExceptionMessage Wrong MIME type.
     */
    public function testBuildFileInfoWrongMimeType() {
        $wrongMimeTypeFile = new File(42, '/test/path/to/file.mpg', 'file.mpg', 'application/stream', 'home::notJohn');
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
        $this->l10nMock->expects($this->once())
            ->method('t')
            ->with('Wrong MIME type.')
            ->will($this->returnValue('Wrong MIME type.'));
        $this->fileMapperMock->expects($this->once())
            ->method('find')
            ->with(1)
            ->will($this->returnValue($wrongMimeTypeFile));
        $this->cut->buildFileInfo($files);
    }
    
    public function testGetCorrectTypeForPdf() {
        $result = $this->cut->getCorrectType($this->fileInfoNotSharedPdf);
        $this->assertEquals(OcrConstants::OCRmyPDF, $result);
    }
    
    public function testGetCorrectTypeForPng() {
        $result = $this->cut->getCorrectType($this->fileInfoNotSharedPng);
        $this->assertEquals(OcrConstants::TESSERACT, $result);
    }
}