<?php

/**
 * @file
 * @ingroup Extensions
 * @license GPL-2.0-or-later
 */

class FormWizardHooks {

	public static function onResourceLoaderTestModules( array &$testModules, ResourceLoader &$resourceLoader ) {
		$testModules['qunit']['ext.formWizard.tests'] = [
			'scripts' => [
				'tests/FormWizard.test.js'
			],
			'dependencies' => [
				'ext.formWizard'
			],
			'localBasePath' => __DIR__,
			'remoteExtPath' => 'FormWizard',
		];
		return true;
	}

	public static function BeforePageDisplay(
		OutputPage &$out,
		Skin &$skin ) {

		$out->addModules( [
			'ext.formWizard'
		] );
	}

	public static function onParserSetup( &$parser ) {
      // Create a function hook associating the "example" magic word with renderExample()
      $parser->setFunctionHook( 'formwizard', 'FormWizardHooks::showPorjectButton' );
   }

   // Render the output of {{#example:}}.
   public static function showPorjectButton( $parser,$project, $action, $config, $pageName ) {
      // The input parameters are wikitext with templates expanded.
      // The output should be wikitext too.
      $output = "<span class='mw-ui-button mw-ui-progressive'
				    id='formwizard-launch'
				    color = 'blue'
				    role='button'
				    aria-disabled='false'>".$action."
				</span>";
			$parser->getOutput()->setExtensionData('formWizardProject', $project);
	  	$parser->getOutput()->setExtensionData('formWizardconfig', $config);
	  	$parser->getOutput()->setExtensionData('formWizardPageName', $pageName);
      return $output;
   }

   public static function onOutputPageParserOutput( OutputPage &$out, ParserOutput $parseroutput ) {
   		$out->addJsConfigVars( 'formWizardconfig', $parseroutput->getExtensionData('formWizardconfig') );
			$out->addJsConfigVars( 'formWizardProject', $parseroutput->getExtensionData( 'formWizardProject' ) );
			$out->addJsConfigVars( 'formWizardPageName', $parseroutput->getExtensionData( 'formWizardPageName' ) );
   }

}
