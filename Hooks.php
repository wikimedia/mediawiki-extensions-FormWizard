<?php

/**
 * @file
 * @ingroup Extensions
 * @license GPL-2.0-or-later
 */

class FormWizardHooks {

	/**
	 * Conditionally register the unit testing module for the ext.formWizard
	 * module only if that module is loaded.
	 *
	 * @param array &$testModules The array of registered test modules
	 * @param ResourceLoader &$resourceLoader The reference to the resource
	 *  loader
	 * @return true
	 */
	public static function onResourceLoaderTestModules(
		array &$testModules,
		ResourceLoader &$resourceLoader
	) {
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

	/**
	 * Hook for BeforePageDisplay.
	 *
	 * Enables JavaScript.
	 *
	 * @param OutputPage &$out The OutputPage object.
	 * @param Skin &$skin Skin object that will be used to generate the page,
	 *  added in 1.13.
	 */
	public static function onBeforePageDisplay(
		OutputPage &$out,
		Skin &$skin
	) {
		$out->addModules( [
			'ext.formWizard',
			'oojs'
		] );
	}

	public static function onParserSetup( &$parser ) {
		// Create a function hook associating the "formwizard" magic word with renderExample()
		$parser->setFunctionHook( 'formwizard', 'FormWizardHooks::showProjectButton' );
	}

	/**
	 * Contruct button from parser arguments.
	 *
	 * @param String $parser The parse name.
	 * @param String $project The project name in parser function defintion
	 * @param String $action Text to display on the button.
	 * @param String $config Path to config file.
	 * @param String $pageName Name of the page to create.
	 * @param String $pageType Type of the page to create.
	 * @return string
	 */
	public static function showProjectButton( $parser, $project, $action, $config,
		$pageName, $pageType
	) {
		// The input parameters are wikitext with templates expanded.
		// The output should be wikitext too.
		$output = "<span class='mw-ui-button mw-ui-progressive'
				    id='formwizard-launch'
				    color = 'blue'
				    role='button'
				    aria-disabled='false'>" . $action . "
			</span>";
		$parser->getOutput()->setExtensionData( 'formWizardProject', $project );
		$parser->getOutput()->setExtensionData( 'formWizardConfig', $config );
		$parser->getOutput()->setExtensionData( 'formWizardPageName', $pageName );
		$parser->getOutput()->setExtensionData( 'formWizardPageType', $pageType );
		return $output;
	}

	/**
	 * @param OutputPage &$out
	 * @param ParserOutput $parseroutput
	 */
	public static function onOutputPageParserOutput( OutputPage &$out, ParserOutput $parseroutput ) {
		$out->addJsConfigVars( 'formWizardConfig',
			$parseroutput->getExtensionData( 'formWizardConfig' ) );
		$out->addJsConfigVars( 'formWizardProject',
			$parseroutput->getExtensionData( 'formWizardProject' ) );
		$out->addJsConfigVars( 'formWizardPageName',
			$parseroutput->getExtensionData( 'formWizardPageName' ) );
		$out->addJsConfigVars( 'formWizardPageType',
			$parseroutput->getExtensionData( 'formWizardPageType' ) );
	}
}
