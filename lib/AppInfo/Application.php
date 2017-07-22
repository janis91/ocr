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
namespace OCA\Ocr\AppInfo;

use OC\Files\View;
use OCA\Ocr\Controller\JobController;
use OCA\Ocr\Controller\PersonalSettingsController;
use OCA\Ocr\Db\FileMapper;
use OCA\Ocr\Db\OcrJobMapper;
use OCA\Ocr\Db\ShareMapper;
use OCA\Ocr\Service\JobService;
use OCP\AppFramework\App;
use OCP\AppFramework\IAppContainer;
use OCP\IContainer;
use OCA\Ocr\Controller\StatusController;
use OCA\Ocr\Service\StatusService;
use OCA\Ocr\Service\FileService;
use OCA\Ocr\Service\RedisService;
use OCA\Ocr\Service\AppConfigService;
use OCA\Ocr\Util\PHPUtil;
use OCA\Ocr\Util\FileUtil;
use OCA\Ocr\Util\RedisUtil;


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
        $eventDispatcher->addListener('OCA\Files::loadAdditionalScripts', 
                function () {
                    script('ocr', 'dist/ocrapp');
                    style('ocr', 'ocrstyle');
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
        /**
         * Register the PHPUtil
         */
        $container->registerService('PHPUtil', 
                function (IContainer $c) {
                    /** @var \OC\Server $server */
                    $server = $c->query('ServerContainer');
                    return new PHPUtil($server->getL10N('ocr'));
                });
        /**
         * Register the RedisUtil
         */
        $container->registerService('RedisUtil',
                function (IContainer $c) {
                    /** @var \OC\Server $server */
                    $server = $c->query('ServerContainer');
                    return new RedisUtil($server->getL10N('ocr'), $server->getLogger(), $server->getConfig());
                });
        /**
         * Register the FileUtil
         */
        $container->registerService('FileUtil', 
                function (IContainer $c) {
                    return new FileUtil();
                });
        /**
         * Register the Ocr Job mapper
         */
        $container->registerService('OcrJobMapper', 
                function (IContainer $c) {
                    /** @var \OC\Server $server */
                    $server = $c->query('ServerContainer');
                    return new OcrJobMapper($server->getDatabaseConnection());
                });
        /**
         * Register the File mapper
         */
        $container->registerService('FileMapper', 
                function (IContainer $c) {
                    /** @var \OC\Server $server */
                    $server = $c->query('ServerContainer');
                    return new FileMapper($server->getDatabaseConnection());
                });
        /**
         * Register the Share mapper
         */
        $container->registerService('ShareMapper', 
                function (IContainer $c) {
                    /** @var \OC\Server $server */
                    $server = $c->query('ServerContainer');
                    return new ShareMapper($server->getDatabaseConnection());
                });
        /**
         * Register the App Config Service
         */
        $container->registerService('AppConfigService', 
                function (IAppContainer $c) {
                    /** @var \OC\Server $server */
                    $server = $c->query('ServerContainer');
                    return new AppConfigService($server->getConfig(), $server->getL10N('ocr'), $c->query('RedisUtil'), $server->getLogger());
                });
        /**
         * Register the Job Service
         */
        $container->registerService('FileService', 
                function (IAppContainer $c) {
                    /** @var \OC\Server $server */
                    $server = $c->query('ServerContainer');
                    return new FileService($server->getL10N('ocr'), $server->getLogger(), $c->query('CurrentUID'), 
                            $c->query('FileMapper'), $c->query('ShareMapper'), $c->query('FileUtil'));
                });
        /**
         * Register the Redis Service
         */
        $container->registerService('RedisService', 
                function (IAppContainer $c) {
                    /** @var \OC\Server $server */
                    $server = $c->query('ServerContainer');
                    return new RedisService($c->query('OcrJobMapper'), $c->query('FileUtil'), $c->query('RedisUtil'), 
                            $server->getL10N('ocr'), $server->getLogger());
                });
        /**
         * Register the Job Service
         */
        $container->registerService('JobService', 
                function (IAppContainer $c) {
                    /** @var \OC\Server $server */
                    $server = $c->query('ServerContainer');
                    return new JobService($server->getL10N('ocr'), $server->getLogger(), $c->query('CurrentUID'), 
                            new View('/' . $c->query('CurrentUID') . '/files'), $server->getTempManager(), $c->query('RedisService'), 
                            $c->query('OcrJobMapper'), $c->query('FileService'), $c->query('AppConfigService'), 
                            $c->query('PHPUtil'), $c->query('FileUtil'));
                });
        /**
         * Register the Status Service
         */
        $container->registerService('StatusService', 
                function (IAppContainer $c) {
                    /** @var \OC\Server $server */
                    $server = $c->query('ServerContainer');
                    return new StatusService($server->getL10N('ocr'), $server->getLogger(), $c->query('CurrentUID'), 
                            $c->query('OcrJobMapper'), $c->query('JobService'));
                });
        /**
         * Controller
         */
        $container->registerService('StatusController', 
                function (IAppContainer $c) {
                    /** @var \OC\Server $server */
                    $server = $c->query('ServerContainer');
                    return new StatusController($c->getAppName(), $server->getRequest(), $c->query('StatusService'));
                });
        /**
         * Controller
         */
        $container->registerService('JobController', 
                function (IAppContainer $c) {
                    /** @var \OC\Server $server */
                    $server = $c->query('ServerContainer');
                    return new JobController($c->getAppName(), $server->getRequest(), $c->query('JobService'), 
                            $c->query('CurrentUID'));
                });
        /**
         * Controller
         */
        $container->registerAlias('PersonalSettingsController', PersonalSettingsController::class);
    }

    /**
     * Registers the Personal Settings Page for deletion of status objects and such things.
     * @codeCoverageIgnore
     */
    public function registerPersonal() {
        \OCP\App::registerPersonal($this->getContainer()
            ->getAppName(), 'personal');
    }
}
