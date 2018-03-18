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
namespace OCA\Ocr\Hooks;

use OCP\IUserManager;
use OCA\Ocr\Db\OcrJobMapper;
use OCP\ILogger;
use OCA\Ocr\Constants\OcrConstants;


/**
 * Class UserHooks
 * 
 * @package OCA\Ocr\Hooks
 */
class UserHooks {

    /**
     *
     * @var IUserManager
     */
    private $userManager;

    /**
     *
     * @var OcrJobMapper
     */
    private $ocrJobMapper;

    /**
     *
     * @var ILogger
     */
    private $logger;

    public function __construct(IUserManager $userManager, OcrJobMapper $ocrJobMapper, ILogger $logger) {
        $this->userManager = $userManager;
        $this->ocrJobMapper = $ocrJobMapper;
        $this->logger = $logger;
    }

    /**
     * Registers the user hooks.
     */
    public function register() {
        $postDelete = function ($user) {
            $this->logger->debug('Deleting all jobs for user "{user}" after user deletion (Hook).', [
                    'user' => $user->getUID(),
                    'app' => OcrConstants::APP_NAME
            ]);
            $this->ocrJobMapper->deleteAllForUser($user->getUID());
        };
        $this->userManager->listen('\OC\User', 'postDelete', $postDelete);
    }
}