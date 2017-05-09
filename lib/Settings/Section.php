<?php

/**
 * Nextcloud - OCR
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 * 
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */
namespace OCA\Ocr\Settings;

use OCP\IL10N;
use OCP\Settings\IIconSection;


class Section implements IIconSection {

    /** @var IL10N */
    private $l;

    /**
     *
     * @param IL10N $l            
     */
    public function __construct(IL10N $l) {
        $this->l = $l;
    }

    /**
     *
     * {@inheritdoc}
     *
     */
    public function getID() {
        return 'ocr';
    }

    /**
     *
     * {@inheritdoc}
     *
     */
    public function getName() {
        return $this->l->t('OCR');
    }

    /**
     *
     * {@inheritdoc}
     *
     */
    public function getPriority() {
        return 75;
    }

    /**
     *
     * {@inheritdoc}
     *
     */
    public function getIcon() {
        return '/apps/ocr/img/icon/ocr.svg';
    }
}