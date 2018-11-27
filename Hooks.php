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
			'remoteExtPath' => 'FormWizard'
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
	 * Converts an array of values in form [0] => "name=value" into a real
	 * associative array in form [name] => value. If no = is provided,
	 * true is assumed like this: [name] => true
	 *
	 * @param array string $options
	 * @return array $results
	 */
	public static function extractOptions( array $options ) {
		$results = [];

		foreach ( $options as $option ) {
			$pair = explode( '=', $option, 2 );
			if ( count( $pair ) === 2 ) {
				$name = trim( $pair[0] );
				$value = trim( $pair[1] );
				$results[$name] = $value;
			}
			if ( count( $pair ) === 1 ) {
				$name = trim( $pair[0] );
				$results[$name] = true;
			}
		}
		return $results;
	}

	/**
	 * Contruct button from parser arguments.
	 *
	 * @param String $parser The parse name.
	 * @return String $output Contructed button output.
	 */
	public static function showProjectButton( $parser ) {
		$options = self::extractOptions( array_slice( func_get_args(), 1 ) );
		// The input parameters are wikitext with templates expanded.
		// The output should be wikitext too.
		$output = "<div id='formwizard-init-form'>
						<span class='mw-ui-button mw-ui-progressive'
								id='formwizard-launch'
								role='button'
								aria-disabled='false'>" . $options[ 'action' ] . "
						</span>" .
					"</div>";
		$parser->getOutput()->setExtensionData( 'formWizardProject', $options[ 'project' ] );
		$parser->getOutput()->setExtensionData( 'formWizardConfig', $options[ 'config' ] );
		$parser->getOutput()->setExtensionData( 'formWizardPageMode', $options[ 'mode' ] );
		$parser->getOutput()->preventClickjacking( true );
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
		$out->addJsConfigVars( 'formWizardPageMode',
			$parseroutput->getExtensionData( 'formWizardPageMode' ) );
	}
}
