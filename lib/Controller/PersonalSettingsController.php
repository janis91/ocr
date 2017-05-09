<?php

/**
 * Nextcloud - OCR
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 * 
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */
namespace OCA\Ocr\Controller;

use OCP\AppFramework\Controller;
use OCP\IRequest;
use OCP\Template;


class PersonalSettingsController extends Controller {

    /**
     * PersonalSettingsController constructor.
     * 
     * @param string $AppName            
     * @param IRequest $request            
     */
    public function __construct($AppName, IRequest $request) {
        parent::__construct($AppName, $request);
    }

    /**
     * @NoAdminRequired
     * 
     * @return Template
     */
    public function displayPanel() {
        $tmpl = new Template('ocr', 'settings-personal');
        return $tmpl;
    }
}