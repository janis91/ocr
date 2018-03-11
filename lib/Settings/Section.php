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
namespace OCA\Ocr\Settings;

use OCP\IL10N;
use OCP\Settings\IIconSection;
use OCP\IURLGenerator;
use OCA\Ocr\Constants\OcrConstants;


class Section implements IIconSection {

    /** @var IL10N */
    private $l;

    /** @var IURLGenerator */
    private $urlGenerator;

    /**
     *
     * @param IL10N $l     
     * @param IURLGenerator $urlGenerator       
     */
    public function __construct(IL10N $l, IURLGenerator $urlGenerator) {
        $this->l = $l;
        $this->urlGenerator = $urlGenerator;
    }

    /**
     *
     * {@inheritdoc}
     *
     */
    public function getID() {
        return OcrConstants::APP_NAME;
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
        return $this->urlGenerator->imagePath(OcrConstants::APP_NAME, 'icon/ocr.svg');
    }
}