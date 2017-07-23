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
namespace OCA\Ocr\Controller;

use OCA\Ocr\Service\JobService;
use OCP\AppFramework\Http\DataResponse;
use OCP\IRequest;
use OCP\AppFramework\Controller;


/**
 * Class JobController
 * 
 * @package OCA\Ocr\Controller
 */
class JobController extends Controller {
    use Errors;

    /**
     *
     * @var string
     */
    private $userId;

    /**
     *
     * @var JobService
     */
    private $service;

    /**
     * JobController constructor.
     * 
     * @param string $AppName            
     * @param IRequest $request            
     * @param JobService $service            
     * @param
     *            $UserId
     */
    public function __construct($AppName, IRequest $request, JobService $service, $UserId) {
        parent::__construct($AppName, $request);
        $this->userId = $UserId;
        $this->service = $service;
    }

    /**
     * Processing the srcFile(s)
     * @NoAdminRequired
     * 
     * @param string[] $languages
     *            - deu, eng...
     * @param array $files            
     * @param boolean $replace            
     * @return DataResponse
     */
    public function process($languages, $files, $replace) {
        return $this->handleNotFound(
                function () use ($languages, $files, $replace) {
                    return $this->service->process($languages, $files, $replace);
                });
    }

    /**
     * @NoAdminRequired
     * 
     * @return \OCP\AppFramework\Http\DataResponse
     */
    public function getAllJobs() {
        return $this->handleNotFound(
                function () {
                    return $this->service->getAllJobsForUser($this->userId);
                });
    }

    /**
     * @NoAdminRequired
     * 
     * @param integer $id            
     * @return \OCP\AppFramework\Http\DataResponse
     */
    public function deleteJob($id) {
        return $this->handleNotFound(
                function () use ($id) {
                    return $this->service->deleteJob($id, $this->userId);
                });
    }
}