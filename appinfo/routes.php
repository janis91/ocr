<?php
/**
 * Nextcloud - OCR
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 * 
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */
return [
        'routes' => [
                [
                        'name' => 'Job#process',
                        'url' => '/',
                        'verb' => 'POST'
                ],
                [
                        'name' => 'Job#deleteJob',
                        'url' => '/',
                        'verb' => 'DELETE'
                ],
                [
                        'name' => 'Job#getAllJobs',
                        'url' => '/',
                        'verb' => 'GET'
                ],
                [
                        'name' => 'Status#getStatus',
                        'url' => '/status',
                        'verb' => 'GET'
                ],
                // settings
                [
                        'name' => 'AdminSettings#setLanguages',
                        'url' => '/admin/languages',
                        'verb' => 'POST'
                ],
                [
                        'name' => 'AdminSettings#setRedis',
                        'url' => '/admin/redis',
                        'verb' => 'POST'
                ],
                [
                        'name' => 'AdminSettings#getLanguages',
                        'url' => '/languages',
                        'verb' => 'GET'
                ],
                [
                        'name' => 'AdminSettings#evaluateRedisSettings',
                        'url' => '/redis',
                        'verb' => 'GET'
                ]
        ]
];