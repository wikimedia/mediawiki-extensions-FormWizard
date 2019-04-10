$( function () {
	// {api} instance of mediaWiki api.
	// {Object} configData data from the parsed wikitext.
	// {int} viewControl variable used to control the stack views.
	var api, mode, viewControl = 0;
	api = new mw.Api();

	/**
	 * Create a SelectFileWidget.
	 *
	 * @param {Object} dict The dictionary of configurations.
	 * @return {Object} The SelectFileWidget.
	 */
	function makeSelectFileWidget( dict ) {
		return new OO.ui.SelectFileWidget( {
			accept: dict.accept,
			classes: [ 'formWizard-element' ]
		} );
	}

	/**
	 * Create a DropdownInputWidget.
	 *
	 * @param {Object} dict The dictionary of configurations.
	 * @return {Object} The DropdownInputWidget.
	 */
	function makeDropdownInputWidget( dict ) {
		return new OO.ui.DropdownInputWidget( {
			value: dict.value,
			options: dict.options,
			classes: [ 'formWizard-element' ]
		} );
	}

	/**
	 * Create a NumberInputWidget.
	 *
	 * @param {Object} dict The dictionary of configurations.
	 * @return {Object} The NumberInputWidget.
	 */
	function makeNumberInputWidget( dict ) {
		return new OO.ui.NumberInputWidget( {
			isInteger: dict.isInteger,
			min: dict.min,
			max: dict.max,
			classes: [ 'formWizard-element' ]
		} );
	}

	/**
	 * Create a RadioSelectInputWidget.
	 *
	 * @param {Object} dict The dictionary of configurations.
	 * @return {Object} The RadioSelectInputWidget.
	 */
	function makeRadioSelectInputWidget( dict ) {
		return new OO.ui.RadioSelectInputWidget( {
			value: dict.value,
			options: dict.options,
			classes: [ 'formWizard-element' ]
		} );
	}

	/**
	 * Create a TextInputWidget.
	 *
	 * @param {Object} dict The dictionary of configurations.
	 * @return {Object} The TextInputWidget.
	 */
	function makesmallTextBox( dict ) {
		return new OO.ui.TextInputWidget( {
			placeholder: dict.placeholder,
			title: dict.title,
			characterLength: dict.characterLength,
			required: dict.required,
			classes: [ 'formWizard-element' ]
		} );
	}

	/**
	 * Create a ComboBoxInputWidget.
	 *
	 * @param {Object} dict The dictionary of configurations.
	 * @return {Object} The ComboBoxInputWidget.
	 */
	function makeComboBoxInputWidget( dict ) {
		return new OO.ui.ComboBoxInputWidget( {
			options: dict.options,
			label: dict.label,
			classes: [ 'formWizard-element' ]
		} );
	}

	/**
	 * Create a MultilineTextInputWidget.
	 *
	 * @param {Object} dict The dictionary of configurations.
	 * @return {Object} The MultilineTextInputWidget.
	 */
	function makeMultilineText( dict ) {
		return new OO.ui.MultilineTextInputWidget( {
			rows: dict.rows,
			value: dict.value,
			autosize: dict.autosize,
			placeholder: dict.placeholder,
			classes: [ 'formWizard-element' ]
		} );
	}

	/**
	 * Create a CheckboxMultiselectInputWidget.
	 *
	 * @param {Object} dict The dictionary of configurations.
	 * @return {Object} The LabelText.
	 */
	function makeCheckboxMultiselect( dict ) {
		return new OO.ui.CheckboxMultiselectInputWidget( {
			value: dict.value,
			options: dict.options,
			classes: [ 'formWizard-element' ]
		} );
	}

	/**
	 * Create a LabelWidget.
	 *
	 * @param {Object} dict The dictionary of configurations.
	 * @return {Object} The LabelText.
	 */
	function makeLabelText( dict ) {
		return new OO.ui.LabelWidget( {
			label: dict.label,
			classes: [ 'formWizard-label' ]
		} );
	}

	/**
	 * Return a promise from the api call.
	 *
	 * @param {Object} api instance of the mediaWiki api.
	 * @return {Object} The promise.
	 */
	function setConfigData( api ) {
		return api.get( {
			action: 'query',
			titles: mw.config.get( 'formWizardConfig' ),
			format: 'json',
			formatversion: 2,
			prop: 'revisions',
			rvslots: 'main',
			rvprop: 'content'
		} );
	}

	/**
	 * Create elements from data from config data.
	 *
	 * @param {Object} data The json data from the api request.
	 * @return {Object} The set of elements in a schema.
	 */
	function createElementsFromSchema( data ) {
		var elementSet = [],
			smallTextBox,
			multilineText,
			comboBoxInputWidget,
			checkboxMultiselect,
			numberInputWidget,
			labelText,
			radioSelectInputWidget,
			dropdownInputWidget,
			selectFileWidget;

		// eslint-disable-next-line no-jquery/no-each-util
		$.each( data.schema, function ( key, value ) {
			switch ( value.type ) {
				case 'smallTextBox':
					smallTextBox = makesmallTextBox( value );
					elementSet.push( smallTextBox );
					break;
				case 'MultilineText':
					multilineText = makeMultilineText( value );
					elementSet.push( multilineText );
					break;
				case 'ComboBoxInputWidget':
					comboBoxInputWidget = makeComboBoxInputWidget( value );
					elementSet.push( comboBoxInputWidget );
					break;
				case 'CheckboxMultiselect':
					checkboxMultiselect = makeCheckboxMultiselect( value );
					elementSet.push( checkboxMultiselect );
					break;
				case 'LabelText':
					labelText = makeLabelText( value );
					elementSet.push( labelText );
					break;
				case 'NumberInputWidget':
					numberInputWidget = makeNumberInputWidget( value );
					elementSet.push( numberInputWidget );
					break;
				case 'RadioSelectInputWidget':
					radioSelectInputWidget = makeRadioSelectInputWidget( value );
					elementSet.push( radioSelectInputWidget );
					break;
				case 'DropdownInputWidget':
					dropdownInputWidget = makeDropdownInputWidget( value );
					elementSet.push( dropdownInputWidget );
					break;
				case 'SelectFileWidget':
					selectFileWidget = makeSelectFileWidget( value );
					elementSet.push( selectFileWidget );
					break;
			}
		} );
		return elementSet;
	}

	/**
	 * Create a FieldsetLayout.
	 *
	 * @param {Object} contentElements The elements added to the fielset.
	 * @return {Object} The FieldsetLayout.
	 */
	function createFieldSet( contentElements ) {
		var fieldset = new OO.ui.FieldsetLayout( {
			classes: [ 'container' ],
			padded: true
		} );
		fieldset.addItems( contentElements );
		return fieldset;
	}

	/**
	 * Adds fieldset elements to  PanelLayout.
	 *
	 * @param {Object} fieldSetContentElements The elements of the fieldset.
	 * @return {Object} The panel containing elements.
	 */
	function AddPanelElementsToPanel( fieldSetContentElements ) {
		var fieldSet, panel;
		fieldSet = createFieldSet( fieldSetContentElements );
		panel = new OO.ui.PanelLayout( {
			padded: true,
			expanded: false,
			scrollable: true,
			classes: [ 'container' ]
		} );
		panel.$element.append( fieldSet.$element );
		return panel;
	}

	/**
	 * Create a StackLayout.
	 *
	 * @param {Object} stackPanels The panels to be added to the stack.
	 * @return {Object} The StackLayout containing panels.
	 */
	function makeStack( stackPanels ) {
		return new OO.ui.StackLayout( {
			classes: [ 'container' ],
			items: stackPanels,
			padded: true
		} );
	}

	/**
	 * Get data from a fieldset by their label and value.
	 *
	 * @param {Object} fieldset the fielset where the data is obtained.
	 * @return {Object} The fieldset data.
	 */
	function getFieldSetData( fieldset ) {
		var fieldData = [];
		fieldset.forEach( function ( field ) {
			if ( field.label ) {
				fieldData.push( field.label );
			} else {
				fieldData.push( field.value );
			}
		} );
		return fieldData;
	}

	/**
	 * Gets the data from an object holding fieldsets.
	 *
	 * @param {Object} fieldsetContainer The container of fieldsets.
	 * @return {Object} The content of the fieldset.
	 */
	function getFieldSetContendData( fieldsetContainer ) {
		var ContentData = [];
		fieldsetContainer.forEach( function ( fieldset ) {
			var fieldsetData = getFieldSetData( fieldset );
			ContentData.push( fieldsetData );
		} );
		return ContentData;
	}

	/**
	 * construct the rapid grant page content using data.
	 *
	 * @return {string} The probox to be added to the rapid grant page.
	 */
	// eslint-disable-next-line no-unused-vars
	function getRapidGrantsProbox() {
		var div, endDiv, probox;
		div = '\n<div style="float:right; width:24em">';
		endDiv = '</div>\n';
		probox = div +
			'\n{{Probox\n' +
			'<!--The status on this should be set to "proposed" when your request is ready for review.' +
			'Please contact rapidgrants@wikimedia.org when you\'re ready to' +
			'move your request from "draft" to "proposed".-->\n' +
			'|status=\n' +
			'|grantee=\n' +
			'|grantee2=\n' +
			'|contact=\n' +
			'|project=\n' +
			'|summary=\n' +
			'|target=\n' +
			'<!--Add the MONTH and DAY you expect to begin spending funds for this project. ' +
			'The start date should be at least 6 weeks after you submit your grant request ' +
			'to allow time for review, discussion, and revision. -->\n' +
			'|start_date=\n' +
			'<!--Enter a start year-->\n' +
			'|start_year=\n' +
			'<!--Add the MONTH and DAY you expect to finish work on your project.-->\n' +
			'|end_date=\n' +
			'<!--Enter an end year-->\n' +
			'|end_year=2018\n' +
			'<!--Enter the amount requested in your local currency-->' +
			'|amount_local=\n' +
			'<!--Please provide an equivalent amount in US$,' +
			'using the exchange rate provided by [http://www.oanda.com/ Oanda]' +
			'on the date you open this request-->\n' +
			'|amount=\n' +
			'<!--Is this grant being requested by an organization, a group, or an individual?-->\n' +
			'|grant_type=\n' +
			'<!--IF THIS GRANT IS TO A GROUP OR ORGANIZATION: Provide the email address ' +
			'(or username) of a secondary contact. You don\'t need to disclose your legal name publicly.-->\n' +
			'|organization=\n' +
			'|contact2=\n' +
			'|contact3=\n' +
			'<!--IF THIS GRANT IS TO A GROUP OR ORGANIZATION: Link to your organization website, ' +
			'or any relevant online resources.-->\n' +
			'|website=\n' +
			'<!--IF THIS GRANT IS TO AN ORGANIZATION: Are you an incorporated organization able to ' +
			'provide local proof of nonprofit status within your country? ' +
			'(For-profit organizations are ineligible to receive grants through the PEG program.)-->\n' +
			'|nonprofit=\n' +
			'<!-- YOU DON\'T NEED TO EDIT THINGS BETWEEN THESE LINES -->\n' +
			'|portal=Rapid\n' +
			'|translations=Probox/Rapid/Content\n' +
			'}}\n\n' +
			'{{Rapid/button/report}}\n' +
			endDiv +
			'\nPlease see the sample' +
			'[[Grants:Project/Rapid/Plan/SampleApplication/Editathon|Editathon/Training application] ' +
			'before drafting your application.\n';
		return probox;
	}

	/**
	 * construct the page content using data.
	 *
	 * @param {Object} pageContentData The data for the page.
	 * @return {string} The content to be appended to page.
	 */
	function constructPageContent( pageContentData ) {
		var subContent, i;
		subContent = '\n';
		pageContentData.forEach( function ( contentData ) {
			for ( i = 0; i < contentData.length; i++ ) {
				if ( i % 2 === 0 ) {
					subContent += '\n== ' + contentData[ i ] + ' == \n' + contentData[ i + 1 ] + '\n';
				}
			}
		} );
		return subContent;
	}

	/**
	 * An api request to edit a edit/create a page.
	 *
	 * @param {Object} api Instance of the `mw.api()`.
	 * @param {Object} fieldsetContentData The data used to create page.
	 * @param {string} baseUrl Project base url.
	 * @param {string} targetMode The target mode.
	 * @param {string} pageName The name of the page not a subpage.
	 * @param {string} targetRootName The name of the target root page.
	 */
	function createPage( api, fieldsetContentData, baseUrl, targetMode, pageName, targetRootName ) {
		var date, pageTitle;
		if ( targetMode === 'subpage' ) {
			// eslint-disable-next-line no-jquery/no-global-selector
			pageTitle = targetRootName + $( '#subpage-name' ).val();
		} else {
			pageTitle = pageName;
		}
		date = new Date();
		api.postWithToken( 'csrf', {
			action: 'edit',
			summary: mw.msg( 'formwizard-page-edit-summary', mw.config.get( 'formWizardProject' ) ),
			title: pageTitle,
			appendtext: constructPageContent( fieldsetContentData ),
			basetimestamp: date.toISOString()
		} ).done( function () {
			window.location.replace( location.origin + '/' + baseUrl + '/' + pageTitle );
			mw.loader.using( 'mediawiki.notify', function () {
				mw.notify( mw.msg( 'formwizard-page-action-complete', mw.config.get( 'formWizardProject' ) ),
					{ type: 'info' } );
			} );
		} );
	}

	/**
	 * Create an instance of a dialog.
	 *
	 * @param {Object} config dialog configuration.
	 * Note: Changing this name FormWizardDialog means changing the dialog
	 * below.
	 */
	function FormWizardDialog( config ) {
		FormWizardDialog.parent.call( this, config );
	}

	/**
	 * Add TextField above button on setup page.
	 *
	 * @param {string} parentElementID The id of the parent element.
	 */
	function addTextFieldToPage( parentElementID ) {
		$( parentElementID ).prepend(
			'<strong>' + mw.msg( 'formwizard-subpage-request-text' ) + '</strong>' +
			'<br/><input type="text" required="true" id="subpage-name">'
		);
	}
	// get the page mode and check if textfield should be added
	mode = mw.config.get( 'formWizardPageMode' );
	if ( mode === 'subpage' ) {
		addTextFieldToPage( '#formwizard-init-form' );
	}

	// When the launch button is clicked
	// eslint-disable-next-line no-jquery/no-global-selector
	$( '#formwizard-launch' ).on( 'click', function () {
		// {Object} fieldsetElements stores step elements from data schema
		// {Object} fieldsetContent Holds the contents of eachfieldset
		// {Object} fieldsetContainer Stores fielsets
		// {Object} stackPanels Holds the panels to be added to the stack
		// {Object} fieldsetData Holds data from the panel fieldset elements
		var fieldsetElements = [],
			fieldsetContent = [],
			fieldsetContainer = [],
			stackPanels = [],
			fieldsetContentData = [],
			configData,
			queryData,
			baseUrl,
			targetMode,
			pageName,
			targetRootName;

		// eslint-disable-next-line no-jquery/no-global-selector
		if ( mw.config.get( 'formWizardPageMode' ) && $( '#subpage-name' ).val() === '' ) {
			OO.ui.alert( mw.msg( 'formwizard-no-subpage-name-alert' ),
				{ size: 'medium' } );
		} else {
			setConfigData( api ).done( function ( data ) {
				// Windows manager and ProcessDialog instances
				var windowManager,
					ProcessDialog,
					dialog;
				queryData = JSON.parse( data.query.pages[ 0 ].revisions[ 0 ].content );
				configData = queryData.steps;
				baseUrl = queryData.target.baseUrl;
				targetMode = queryData.target.mode;
				pageName = queryData.target.pagename;
				targetRootName = queryData.target.rootname;
				// Display a dialog for undefined JSON
				if ( configData === undefined || configData === '' ) {
					// alert user of poor configuration file
					OO.ui.alert( mw.msg( 'formwizard-wrong-config-file-alert' ),
						{ size: 'medium' } );
				} else {
					// getting schema and creating ooui elements and storing in container
					// eslint-disable-next-line no-jquery/no-each-util
					$.each( configData, function ( step, schema ) {
						fieldsetElements = createElementsFromSchema( schema, targetMode );
						fieldsetContainer.push( fieldsetElements );
					} );
					OO.inheritClass( FormWizardDialog, OO.ui.ProcessDialog );
					FormWizardDialog.static.name = 'formWizardDialog';
					FormWizardDialog.static.title = mw.config.get( 'formWizardProject' );
					FormWizardDialog.static.actions = [
						{ action: 'continue',
							modes: 'edit',
							label: mw.msg( 'formwizard-dialog-label-next' ),
							flags: [ 'primary', 'constructive' ]
						},
						{ modes: [ 'edit', 'final' ],
							label: mw.msg( 'formwizard-dialog-label-cancel' ),
							flags: 'safe'
						},
						{ modes: 'final',
							action: 'save',
							label: mw.msg( 'formwizard-dialog-label-done' ),
							flags: 'primary'
						}
					];
					FormWizardDialog.prototype.initialize = function () {
						var panel, stack;
						FormWizardDialog.parent.prototype.initialize.apply( this, arguments );
						// get elements from the fieldset container
						fieldsetContainer.forEach( function ( elt ) {
							fieldsetContent.push( elt );
						} );
						fieldsetContent.forEach( function ( content ) {
							panel = AddPanelElementsToPanel( content );
							stackPanels.push( panel );
						} );
						// create a new stack with items araray of panels
						stack = makeStack( stackPanels );
						this.stackLayout = stack;
						this.$body.append( this.stackLayout.$element );
					};
					// Set up the initial mode of the window ('edit', in this example.)
					FormWizardDialog.prototype.getSetupProcess = function ( data ) {
						return FormWizardDialog.super.prototype.getSetupProcess.call( this, data )
							.next( function () {
								this.actions.setMode( 'edit' );
							}, this );
					};
					FormWizardDialog.prototype.getActionProcess = function ( action ) {
						var dialog;
						// The Done button has been clicked
						if ( action === 'save' ) {
							// we get the fieldsetContentData from the container of fieldsets
							fieldsetContentData = getFieldSetContendData( fieldsetContainer );
							// We make an API request to create a page
							createPage(
								api, fieldsetContentData, baseUrl,
								targetMode, pageName, targetRootName
							);
							// Here we close the dialog after processing
							dialog = this;
							return new OO.ui.Process( function () {
								// do something about the edit
								dialog.close();
							} );
						} else if ( action === 'continue' && viewControl <
							( stackPanels.length - 1 ) ) {
							this.stackLayout.setItem( stackPanels[ viewControl + 1 ] );
							viewControl++;
							if ( viewControl === ( stackPanels.length - 1 ) ) {
								this.actions.setMode( 'final' );
							}
						} else {
							window.location.reload();
						}
						return FormWizardDialog.parent.prototype.getActionProcess
							.call( this, action );
					};
					// set the height of the dialog box
					FormWizardDialog.prototype.getBodyHeight = function () {
						return 600;
					};
					// create new windowManager
					windowManager = new OO.ui.WindowManager();
					// eslint-disable-next-line no-jquery/no-global-selector
					$( 'body' ).append( windowManager.$element );
					// set the width of the dialog
					ProcessDialog = new FormWizardDialog( { } );
					ProcessDialog.size = 'medium';
					dialog = new FormWizardDialog();
					windowManager.addWindows( [ dialog ] );
					windowManager.openWindow( dialog );
				}
			} );
		}
	} );
} );
