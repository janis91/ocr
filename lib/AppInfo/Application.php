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
                    
                    // Allow loading languages from github tessdata fork
                    $csp->addAllowedConnectDomain("https://raw.githubusercontent.com");

                    // Allow creating worker
                    $csp->addAllowedChildSrcDomain("blob:"); // Needed for browser that don't know worker-src directive (like Safari or Edge)
                    $csp->addAllowedWorkerSrcDomain("blob:");
                    // Opera works already (data: missing in connect-src but processes successful)

                    // Allow importScripts(worker.min.js) for Safari (will not be enabled by default, because this has massive security risks as implication)
                    // $csp->addAllowedScriptDomain("'unsafe-eval'");
                    // Safari works already (data: missing in connect-src but processes successful)
                    $parsed_url = \parse_url(\OC::$server->getURLGenerator()->getBaseUrl() . "/nextcloud");
                    $scheme = isset($parsed_url['scheme']) ? $parsed_url['scheme'] . '://' : '';
                    $host = isset($parsed_url['host']) ? $parsed_url['host'] : '';
                    $port = isset($parsed_url['port']) ? ':' . $parsed_url['port'] : '';
                    // Allow importScripts(worker.min.js) for Firefox and Chrome (Because 'self' isn't working at the moment)
                    $csp->addAllowedScriptDomain("$scheme$host$port");
                    // Chrome and Firefox work now (data: missing in connect-src but processes successful)

                    // Allow connect to data:octet/stream for fully functioning tesseract web worker
                    $csp->addAllowedConnectDomain('data:');
                    // No browser complains anymore

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