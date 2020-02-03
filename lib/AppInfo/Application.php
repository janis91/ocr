<?php

/**
 * Nextcloud - OCR
 * This file is licensed under the Affero General Public License version 3 or
 * later.
 * See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2020
 */

namespace OCA\Ocr\AppInfo;

use OC\Files\View;
use OC\Server;
use OCA\Ocr\Controller\TessdataController;
use OCA\Ocr\Middleware\ServiceWorkerMiddleware;
use OCA\Ocr\Service\TessdataService;
use OCP\AppFramework\App;
use OCA\Ocr\Controller\PersonalSettingsController;
use OCP\AppFramework\IAppContainer;
use OCP\IContainer;
use OCP\AppFramework\Http\ContentSecurityPolicy;
use OCA\Ocr\Constants\OcrConstants;
use OCP\Security\CSP\AddContentSecurityPolicyEvent;
use Symfony\Component\EventDispatcher\GenericEvent;


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
		$eventDispatcher->addListener('OCA\Files::loadAdditionalScripts', function () {
			script(OcrConstants::APP_NAME, "chunk-common");
			script(OcrConstants::APP_NAME, "chunk-app-vendors");
			script(OcrConstants::APP_NAME, "app");
			style(OcrConstants::APP_NAME, "chunk-common");
			style(OcrConstants::APP_NAME, "chunk-app-vendors");
			style(OcrConstants::APP_NAME, "app");
		});
		$eventDispatcher->addListener(AddContentSecurityPolicyEvent::class, function (AddContentSecurityPolicyEvent $e) {
			$csp = new ContentSecurityPolicy();

			// Allow creating worker
			$csp->addAllowedChildSrcDomain("blob:"); // Needed for browser that don't know worker-src directive (like Safari or Edge)
			$csp->addAllowedWorkerSrcDomain("blob:");
			// Opera works already (data: missing in connect-src but processes successful)

			// Allow importScripts(worker.min.js) for Safari (will not be enabled by default, because this has massive security risks as implication)
			// $csp->addAllowedScriptDomain("'unsafe-eval'");
			// Safari works already (data: missing in connect-src but processes successful)

			// Allow importScripts(worker.min.js) for Firefox and Chrome (Because 'self' isn't working at the moment)
			$parsed_url = \parse_url(\OC::$server->getURLGenerator()->getBaseUrl() . "/nextcloud");
			$scheme = isset($parsed_url['scheme']) ? $parsed_url['scheme'] . '://' : '';
			$host = isset($parsed_url['host']) ? $parsed_url['host'] : '';
			$port = isset($parsed_url['port']) ? ':' . $parsed_url['port'] : '';
			$csp->addAllowedScriptDomain("$scheme$host$port");
			// Chrome and Firefox work now (data: missing in connect-src but processes successful)

			// Service worker registration for caching
			$csp->addAllowedChildSrcDomain("$scheme$host$port");
			$csp->addAllowedWorkerSrcDomain("$scheme$host$port");

			// Allow connect to data:octet/stream for fully functioning tesseract web worker
			$csp->addAllowedConnectDomain('data:');

			$e->addPolicy($csp);
		});
		/**
		 * Register core services
		 */
		$container->registerService('CurrentUID',
			function (IContainer $c) {
				/** @var Server $server */
				$server = $c->query('ServerContainer');
				$user = $server->getUserSession()
					->getUser();
				return ($user) ? $user->getUID() : '';
			});
		// Allow automatic DI for the View, until they migrated to Nodes API
		$container->registerService(View::class, function () {
			return new View('');
		}, false);
		/**
		 * Register Services
		 */
		$container->registerService('TessdataService', function (IAppContainer $c) {
			/** @var Server $server */
			$server = $c->query('ServerContainer');
			return new TessdataService(
				$server->getAppDataDir($c->getAppName()),
				$server->getLogger()
			);
		});
		/**
		 * Controller
		 */
		$container->registerService('TessdataController', function (IAppContainer $c) {
			/** @var Server $server */
			$server = $c->query('ServerContainer');
			return new TessdataController(
				$c->getAppName(),
				$server->getRequest(),
				$c->query('TessdataService')
			);
		});
	}
}
