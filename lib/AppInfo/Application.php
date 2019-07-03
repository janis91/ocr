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
use OCP\AppFramework\Http\ContentSecurityPolicy;
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
                    vendor_script(OcrConstants::APP_NAME, 'tesseract.js/tesseract.min');
                    vendor_script(OcrConstants::APP_NAME, 'tesseract.js/worker.min');
                    vendor_script(OcrConstants::APP_NAME, 'choices.js/choices.min');
                    vendor_style(OcrConstants::APP_NAME, 'choices.js/choices.min');
                    vendor_script(OcrConstants::APP_NAME, 'pdf.js/pdf.min');
                    vendor_script(OcrConstants::APP_NAME, 'pdf.js/pdf.worker.min');
                    vendor_script(OcrConstants::APP_NAME, 'pdf-lib/pdf-lib.min');
                    script(OcrConstants::APP_NAME, OcrConstants::APP_NAME);
                    style(OcrConstants::APP_NAME, OcrConstants::APP_NAME);

                    $cspManager = \OC::$server->getContentSecurityPolicyManager();
                    $csp = new ContentSecurityPolicy();
                    $csp->addAllowedWorkerSrcDomain("blob:");
                    $csp->addAllowedScriptDomain("'strict-dynamic'");
                    $csp->addAllowedConnectDomain('data:');
                    $csp->addAllowedWorkerSrcDomain("self");
                    $cspManager->addDefaultPolicy($csp);
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