<?php

/**
 * Nextcloud - OCR
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 * 
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */
namespace OCA\Ocr\Constants;


abstract class OcrConstants {

    /**
     * The pending status.
     * 
     * @var string
     */
    const STATUS_PENDING = 'PENDING';

    /**
     * The processed status.
     * 
     * @var string
     */
    const STATUS_PROCESSED = 'PROCESSED';

    /**
     * The failed status.
     * 
     * @var string
     */
    const STATUS_FAILED = 'FAILED';

    /**
     * Supported MIME types for OCR processing.
     * 
     * @var array
     */
    const ALLOWED_MIME_TYPES = [
            'application/pdf',
            'image/png',
            'image/jpeg',
            'image/tiff',
            'image/jp2',
            'image/jpm',
            'image/jpx',
            'image/webp',
            'image/gif'
    ];

    /**
     * The correct MIME type for a PDF file.
     * 
     * @var string
     */
    const MIME_TYPE_PDF = 'application/pdf';

    /**
     * The type of a job (OCRmyPDF).
     * 
     * @var integer
     */
    const OCRmyPDF = 1;

    /**
     * The type of a job (Tesseract).
     * 
     * @var integer
     */
    const TESSERACT = 0;

    /**
     * The name of the message queue that waits for now jobs.
     * 
     * @var string
     */
    const REDIS_NEW_JOBS_QUEUE = 'incoming';

    /**
     * The name of the message queue that waits for finished jobs.
     * 
     * @var string
     */
    const REDIS_FINISHED_JOBS_QUEUE = 'finished';

    /**
     * The name of the languages config key.
     * 
     * @var string
     */
    const LANGUAGES_CONFIG_KEY = 'languages';

    /**
     * The name of the redis host config key.
     * 
     * @var string
     */
    const REDIS_CONFIG_KEY_HOST = 'redisHost';

    /**
     * The name of the redis port config key.
     * 
     * @var string
     */
    const REDIS_CONFIG_KEY_PORT = 'redisPort';

    /**
     * The name of the redis db config key.
     * 
     * @var string
     */
    const REDIS_CONFIG_KEY_DB = 'redisDb';
    
    /**
     * The name of the redis db config key.
     *
     * @var string
     */
    const REDIS_CONFIG_KEY_PASSWORD = 'redisPassword';

    /**
     * The prefix for the redis key.
     * 
     * @var string
     */
    const REDIS_KEY_PREFIX = 'ocr:';

    /**
     * The prefix for the tempfiles that are created.
     * 
     * @var string
     */
    const TEMPFILE_PREFIX = 'ocr_';
}