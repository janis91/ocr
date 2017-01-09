<?php
/**
 * nextCloud - ocr
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2016
 */

namespace OCA\Ocr\AppInfo;


use OC\Files\View;
use OCA\Ocr\Controller\OcrController;
use OCA\Ocr\Controller\PersonalSettingsController;
use OCA\Ocr\Db\OcrStatusMapper;
use OCA\Ocr\Service\OcrService;
use OCA\Ocr\Service\QueueService;
use OCP\AppFramework\App;
use OCP\AppFramework\IAppContainer;
use OCP\IContainer;

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
		parent::__construct('ocr', $urlParams);
		$container = $this->getContainer();

		/**
		 * Add the js and style if OCA\Files app is loaded
		 */
		$eventDispatcher = \OC::$server->getEventDispatcher();
		$eventDispatcher->addListener('OCA\Files::loadAdditionalScripts', function() {
			$scripts = array('ocrapp', 'ocrocr', 'ocrview');
			script('ocr', $scripts);
			style('ocr', 'style');
		});

		/**
		 * Register core services
		 */
		$container->registerService('CurrentUID', function(IContainer $c) {
			/** @var \OC\Server $server */
			$server = $c->query('ServerContainer');
			$user = $server->getUserSession()->getUser();
			return ($user) ? $user->getUID() : '';
		});

		// Allow automatic DI for the View, until they migrated to Nodes API
		$container->registerService(View::class, function() {
			return new View('');
		}, false);

		/**
		 * Register the Ocr Status mapper
		 */
		$container->registerService('OcrStatusMapper', function(IContainer $c) {
			/** @var \OC\Server $server */
			$server = $c->query('ServerContainer');
			return new OcrStatusMapper(
				$server->getDatabaseConnection()
			);
		});

		/**
		 * Register the Queue Service
		 */
		$container->registerService('QueueService', function(IAppContainer $c) {
			/** @var \OC\Server $server */
			$server = $c->query('ServerContainer');
			return new QueueService(
				$c->query('OcrStatusMapper'),
				$server->getL10N('ocr'),
				$server->getLogger()
			);
		});

		/**
		 * Register the Ocr Services
		 */
		$container->registerService('OcrService', function(IAppContainer $c) {
			/** @var \OC\Server $server */
			$server = $c->query('ServerContainer');
			return new OcrService(
				$server->getTempManager(),
				$server->getConfig(),
				$c->query('QueueService'),
				$c->query('OcrStatusMapper'),
				new View('/' . $c->query('CurrentUID') . '/files'),
				$c->query('CurrentUID'),
				$server->getL10N('ocr'),
				$server->getLogger()
			);
		});

		/**
		 * Controller
		 */
		$container->registerService('OcrController', function(IAppContainer $c) {
			/** @var \OC\Server $server */
			$server = $c->query('ServerContainer');
			return new OcrController(
				$c->getAppName(),
				$server->getRequest(),
				$c->query('OcrService'),
				$c->query('CurrentUID')
			);
		});

		/**
		 * Controller
		 */
		$container->registerAlias('PersonalSettingsController', PersonalSettingsController::class);
	}

	public function registerPersonal(){
		\OCP\App::registerPersonal($this->getContainer()->getAppName(), 'personal');
	}

}