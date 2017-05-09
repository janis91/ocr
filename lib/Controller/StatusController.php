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
use OCA\Ocr\Service\StatusService;
use OCP\IRequest;


class StatusController extends Controller {
    use Errors;
    
    /**
     *
     * @var StatusService
     */
    private $service;

    /**
     * StatusController constructor.
     * 
     * @param string $AppName            
     * @param IRequest $request            
     * @param StatusService $service            
     */
    public function __construct($AppName, IRequest $request, StatusService $service) {
        parent::__construct($AppName, $request);
        $this->service = $service;
    }

    /**
     * Get the current status.
     * @NoAdminRequired
     * 
     * @return DataResponse
     */
    public function getStatus() {
        return $this->handleNotFound(function () {
            return $this->service->getStatus();
        });
    }
}
