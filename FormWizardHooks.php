<?php

/**
 * @file
 * @ingroup Extensions
 * @license GPL-2.0-or-later
 */

class FormWizardHooks {

	public static function onBeforePageDisplay( 
		OutputPage &$out, 
		Skin &$skin ) {

		$out->addModules( [
			'ext.formWizard'
		] );
	}
}