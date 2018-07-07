<?php
/**
 * formWizardPage SpecialPage for FormWizard extension
 *
 * @file
 * @ingroup Extensions
 */
class SpecialFormWizardPage extends SpecialPage {
	public function __construct() {
		parent::__construct( 'formWizardPage' );
	}

	/**
	 * Show the page to the user
	 *
	 * @param string $sub The subpage string argument (if any).
	 */
	public function execute( $sub ) {
		$out = $this->getOutput();
		$out->setPageTitle( $this->msg( 'special-formWizardPage-title' ) );
		$out->addHelpLink( 'How to become a MediaWiki hacker' );
		$out->addWikiMsg( 'special-formWizardPage-intro' );
	}

	protected function getGroupName() {
		return 'other';
	}
}
