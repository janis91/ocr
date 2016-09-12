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

use OCA\Ocr\Command\CompleteOCR;

$app = new Application();
$container = $app->getContainer();
$application->add($container->query(CompleteOCR::class));