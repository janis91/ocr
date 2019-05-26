<?php

/**
 * Nextcloud - OCR
 * This file is licensed under the Affero General Public License version 3 or
 * later.
 * See the COPYING file.
 * 
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2019
 */
namespace OCA\Ocr\AppInfo;

use OC\Files\View;
use OCP\AppFramework\App;
use OCP\IContainer;
use OCA\Ocr\Constants\OcrConstants;


/**
 * Class Application
 * 
 * @package OCA\Ocr\AppInfo
 */
class Application extends App {

    /**
     * Application constructor.
     * 
     * @param array $urlParams            
     */
    public function __construct(array $urlParams = array()) {
        parent::__construct(OcrConstants::APP_NAME, $urlParams);
        $container = $this->getContainer();
        /**
         * Add the js and style if OCA\Files app is loaded
         */
        $eventDispatcher = \OC::$server->getEventDispatcher();
        $eventDispatcher->addListener('OCA\Files::loadAdditionalScripts', 
                function () {
                    script(OcrConstants::APP_NAME, 'dist/ocrapp');
                    style(OcrConstants::APP_NAME, 'ocrstyle');
                    // if not loaded before - load select2 for multi select languages
                    vendor_script('select2/select2');
                    vendor_style('select2/select2');
                });
        /**
         * Register core services
         */
        $container->registerService('CurrentUID', 
                function (IContainer $c) {
                    /** @var \OC\Server $server */
                    $server = $c->query('ServerContainer');
                    $user = $server->getUserSession()
                        ->getUser();
                    return ($user) ? $user->getUID() : '';
                });
        // Allow automatic DI for the View, until they migrated to Nodes API
        $container->registerService(View::class, function () {
            return new View('');
        }, false);
    }
}