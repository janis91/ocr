<?php
/**
 * Nextcloud - OCR
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 * 
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2019
 */
namespace OCA\Ocr\Settings;

use OCP\IL10N;
use OCP\IURLGenerator;
use OCP\Settings\IIconSection;
use OCA\Ocr\Constants\OcrConstants;


class OcrSection implements IIconSection {
	/**
	 * @var IL10N
	 */
	private $l;
	/**
	 * @var IURLGenerator
	 */
	private $url;
	/**
	 * @param IURLGenerator $url
	 * @param IL10N $l
	 */
	public function __construct(IURLGenerator $url, IL10N $l) {
		$this->url = $url;
		$this->l = $l;
	}
	/**
	 * returns the ID of the section. It is supposed to be a lower case string,
	 * e.g. 'ldap'
	 *
	 * @returns string
	 */
	public function getID() {
		return OcrConstants::APP_NAME;
	}
	/**
	 * returns the translated name as it should be displayed, e.g. 'LDAP / AD
	 * integration'. Use the L10N service to translate it.
	 *
	 * @return string
	 */
	public function getName() {
		return $this->l->t('OCR');
	}
	/**
	 * @return int whether the form should be rather on the top or bottom of
	 * the settings navigation. The sections are arranged in ascending order of
	 * the priority values. It is required to return a value between 0 and 99.
	 *
	 * E.g.: 70
	 */
	public function getPriority() {
		return 70;
	}
	/**
	 * {@inheritdoc}
	 */
	public function getIcon() {
		return $this->url->imagePath(OcrConstants::APP_NAME, 'icon/ocr.svg');
	}
	
}