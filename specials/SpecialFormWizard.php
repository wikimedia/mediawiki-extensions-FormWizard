<?php
/**
 * formWizardPage SpecialPage for FormWizard extension
 *
 * @file
 * @ingroup Extensions
 */
class SpecialFormWizard extends SpecialPage {
	public function __construct() {
		parent::__construct( 'FormWizard' );
	}

	protected function getGroupName() {
		return 'pagetools';
	}
}
