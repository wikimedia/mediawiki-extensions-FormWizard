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

	/**
	 * Show the page to the user
	 *
	 * @param string $sub The subpage string argument (if any).
	 */
	public function execute( $sub ) {
		$out = $this->getOutput();
		$out->setPageTitle( $this->msg( 'special-formWizard-title' ) );
		$out->addHelpLink( 'How to become a MediaWiki hacker' );
		$out->addWikiMsg( 'special-formWizard-intro' );
	}

	protected function getGroupName() {
		return 'other';
	}
}
