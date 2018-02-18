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
use OCP\IURLGenerator;
use OCP\Settings\IIconSection;


class Section implements IIconSection {

    /** @var IL10N */
    private $l;
    /** @var IURLGenerator */
    private $url;

    /**
     * @param IL10N $l
     * @param IURLGenerator $url
     */
    public function __construct(IL10N $l, IURLGenerator $url) {
      $this->l = $l;
      $this->url = $url;
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
        return $this->url->imagePath('ocr', 'ocr.svg');
    }
}
