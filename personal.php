<?php
/**
 * nextCloud - ocr
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */

$app = new \OCA\Ocr\AppInfo\Application();
/** @var OCA\Ocr\Controller\PersonalSettingsController */
$controller = $app->getContainer()->query('PersonalSettingsController');
return $controller->displayPanel()->fetchPage();