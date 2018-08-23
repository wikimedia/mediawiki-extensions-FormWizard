( function ( mw ) {
	$( function () {
		// {api} instance of mediaWiki api.``
		// {Object} configData data from the parsed wikitext.
		// {int} viewControl variable used to control the stack views.
		var api, viewControl = 0,
			pageType;
		api = new mw.Api();

		/**
			* Create a SelectFileWidget.
			*
			* @param {Object} dict - The dictionary of configurations.
			* @return {Object} - The SelectFileWidget.
			*/

		function makeSelectFileWidget( dict ) {
			var selectFileWidget = new OO.ui.SelectFileWidget( {
				accept: dict.accept,
				classes: [ dict.classes ]
			} );
			return selectFileWidget;
		}

		/**
			* Create a DropdownInputWidget.
			*
			* @param {Object} dict - The dictionary of configurations.
			* @return {Object} - The DropdownInputWidget.
			*/

		function makeDropdownInputWidget( dict ) {
			var dropdownInputWidget = new OO.ui.DropdownInputWidget( {
				value: dict.value,
				options: dict.options,
				classes: [ dict.classeses ]
			} );
			return dropdownInputWidget;
		}

		/**
			* Create a NumberInputWidget.
			*
			* @param {Object} dict - The dictionary of configurations.
			* @return {Object} - The NumberInputWidget.
			*/

		function makeNumberInputWidget( dict ) {
			var numberInputWidget = new OO.ui.NumberInputWidget( {
				isInteger: dict.isInteger,
				min: dict.min,
				max: dict.max,
				classes: [ dict.classes ]
			} );
			return numberInputWidget;
		}

		/**
			* Create a RadioSelectInputWidget.
			*
			* @param {Object} dict - The dictionary of configurations.
			* @return {Object} - The RadioSelectInputWidget.
			*/

		function makeRadioSelectInputWidget( dict ) {
			var radioSelectInputWidget = new OO.ui.RadioSelectInputWidget( {
				value: dict.value,
				options: dict.options,
				classes: [ dict.classes ]
			} );
			return radioSelectInputWidget;
		}

		/**
			* Create a TextInputWidget.
			*
			* @param {Object} dict - The dictionary of configurations.
			* @return {Object} - The TextInputWidget.
			*/

		function makesmallTextBox( dict ) {
			var smallTextBox = new OO.ui.TextInputWidget( {
				placeholder: dict.placeholder,
				title: dict.title,
				characterLength: dict.characterLength,
				required: dict.required,
				classes: [ dict.classes ]
			} );
			return smallTextBox;
		}

		/**
			* Create a ComboBoxInputWidget.
			*
			* @param {Object} dict - The dictionary of configurations.
			* @return {Object} - The ComboBoxInputWidget.
			*/

		function makeComboBoxInputWidget( dict ) {
			var comboBoxInputWidget = new OO.ui.ComboBoxInputWidget( {
				options: dict.options,
				label: dict.label,
				classes: [ dict.classes ]
			} );
			return comboBoxInputWidget;
		}

		/**
			* Create a MultilineTextInputWidget.
			*
			* @param {Object} dict - The dictionary of configurations.
			* @return {Object} - The MultilineTextInputWidget.
			*/

		function makeMultilineText( dict ) {
			var largeTextbox = new OO.ui.MultilineTextInputWidget( {
				rows: dict.rows,
				value: dict.value,
				autosize: dict.autosize,
				placeholder: dict.placeholder,
				classes: [ dict.classes ]
			} );
			return largeTextbox;
		}

		/**
			* Create a CheckboxMultiselectInputWidget.
			*
			* @param {Object} dict - The dictionary of configurations.
			* @return {Object} - The LabelText.
			*/

		function makeCheckboxMultiselect( dict ) {
			var checkboxMultiselect = new OO.ui.CheckboxMultiselectInputWidget( {
				value: dict.value,
				options: dict.options,
				classes: [ dict.classes ]
			} );
			return checkboxMultiselect;
		}

		/**
			* Create a LabelWidget.
			*
			* @param {Object} dict - The dictionary of configurations.
			* @return {Object} - The LabelText.
			*/

		function makeLabelText( dict ) {
			var labelText = new OO.ui.LabelWidget( {
				label: dict.label,
				classes: [ dict.classes ],
				align: 'left'
			} );
			return labelText;
		}

		/**
			* Return a promise from the api call.
			*
			* @param {Object} api - instance of the mediaWiki api.
			* @return {Object} - The promise.
			*/

		function setConfigData( api ) {
			var promise = api.get( {
				action: 'parse',
				page: mw.config.get( 'formWizardConfig' ),
				format: 'json',
				formatversion: 2,
				prop: 'wikitext'
			} );
			return promise;
		}

		/**
			* Create elements from data from config data.
			*
			* @param {Object} data - The json data from the api request.
			* @return {Object} - The set of elements in a schema.
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
			* @param {Object} contentElements - The elements added to the fielset.
			* @return {Object} - The FieldsetLayout.
			*/

		function createFieldSet( contentElements ) {
			var fieldset = new OO.ui.FieldsetLayout( {
				classes: [ 'container' ]
			} );
			fieldset.addItems( contentElements );
			return fieldset;
		}

		/**
			* Adds fioelset elements to  PanelLayout.
			*
			* @param {Object} fieldSetContentElements - The elmentments of the fieldset.
			* @return {Object} - The panel containing elements.
			*/

		function AddPanelElementsToPanel( fieldSetContentElements ) {
			var fieldSet,
				panel;
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
			* @param {Object} stackPanels - The panels to be added to the stack.
			* @return {Object} - The StackLayout containing panels.
			*/

		function makeStack( stackPanels ) {
			var stack = new OO.ui.StackLayout( {
				classes: [ 'container' ],
				items: stackPanels,
				padded: true
			} );
			return stack;
		}

		/**
			* Get data from a fieldset by their label and value.
			*
			* @param {Object} fieldset - the fielset where the data is obtained.
			* @return {Object} - The fieldset data.
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
			* @param {Object} fieldsetContainer - The container of fieldsets.
			* @return {Object} - The content of the fieldset.
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
		* construct the page content using data.
		*
		* @return {string} - The probox to be added to the page.
		*/

		function getIdeaLabProbox() {
			var probox = '\n{{probox \n' +
			'|project=\n' +
			'|portal=\n' +
			'|summary=\n' +
			'|country=\n' +
			'|inspire_theme=\n' +
			'|contact1=\n' +
			'|advisor1=\n' +
			'|community_organizer1=\n' +
			'|designer1=\n' +
			'|developer1=\n' +
			'|developer2=\n' +
			'|project_manager1=\n' +
			'|researcher1=\n' +
			'|image=\n' +
			'|translations=\n' +
			'|more_participants=\n' +
			'|timestamp =\n' +
			'|creator =\n' +
			'}}';
			return probox;
		}

		/**
			* construct the page content using data.
			*
			* @param {Object} pageContentData - The data for the page.
			* @return {string} - The content to be appended to page.
			*/

		function constructPageContent( pageContentData ) {
			var pageContent, subContent, i;
			pageContent = '';
			subContent = '\n';
			pageType = mw.config.get( 'formWizardPageType' );
			pageContentData.forEach( function ( contentData ) {
				for ( i = 0; i < contentData.length; i++ ) {
					if ( i % 2 === 0 ) {
						subContent += '\n== ' + contentData[ i ] + ' == \n' + contentData[ i + 1 ] + '\n';
					}
				}
			} );
			switch ( pageType ) {
				case 'IdeaLab':
					pageContent = getIdeaLabProbox() + subContent;
					break;
				default:
					pageContent = subContent;
			}
			return pageContent;
		}

		/**
			* An api request to edit a edit/create a page.
			*
			* @param {Object} api - instance of the mw.api().
			* @param {Object} fieldsetContentData - The data used to create page.
			*/

		function createPage( api, fieldsetContentData ) {
			var date = new Date();
			api.postWithToken( 'csrf', {
				action: 'edit',
				summary: mw.config.get( 'formWizardPageName' ),
				text: mw.config.get( 'formWizardPageName' ),
				title: mw.config.get( 'formWizardPageName' ),
				appendtext: constructPageContent( fieldsetContentData ),
				basetimestamp: date.toISOString()
			} ).done( function () {
				mw.loader.using( 'mediawiki.notify', function () {
					mw.notify( mw.config.get( 'formWizardProject' ) +
						' Complete', { type: 'info' } );
				} );
				location.reload();
			} );
		}

		/**
			* Create an instance of a dialog.
			*
			* @param {Object} config - dialog configuration.
			* Note: Changing this name FormWizardDialog means changing the dialog
			* 	name name below.
			*/

		function FormWizardDialog( config ) {
			FormWizardDialog.parent.call( this, config );
		}

		// When the launch button is clicked
		$( '#formwizard-launch' ).click( function () {
			// {Object} fieldsetElements stores step elements from data schema
			// {Object} fieldsetContent Holds the contents of eachfieldset
			// {Object} fieldsetContainer stores fielsets
			// {Object} stackPanels }Holds the panels to be added to the stack
			// {Object} fieldsetContentData Holds data from the panel fieldset elements
			var fieldsetElements = [],
				fieldsetContent = [],
				fieldsetContainer = [],
				stackPanels = [],
				fieldsetContentData = [],
				configData;
			setConfigData( api ).done( function ( data ) {
				// Windows manager and ProcessDialog instances
				var windowManager, ProcessDialog, dialog;
				configData = JSON.parse( data.parse.wikitext ).steps;
				// Display a dialog for undefined JSON
				if ( configData === undefined || configData === '' ) {
					// alert user of poor configuration file
					OO.ui.alert( 'Please Check the configuration settings!',
						{ size: 'medium' } );
				} else {
					// getting schema and creating ooui elements and storing in container
					$.each( configData, function ( step, schema ) {
						fieldsetElements = createElementsFromSchema( schema );
						fieldsetContainer.push( fieldsetElements );
					} );
					OO.inheritClass( FormWizardDialog, OO.ui.ProcessDialog );
					FormWizardDialog.static.name = 'formWizardDialog';
					FormWizardDialog.static.title = mw.config.get( 'formWizardProject' );
					FormWizardDialog.static.actions = [
						{ action: 'continue', modes: 'edit', label: 'Next', flags: [ 'primary',
							'constructive' ] },
						{ modes: [ 'edit', 'final' ], label: 'Cancel', flags: 'safe' },
						{ modes: 'final', action: 'save', label: 'Done', flags: 'primary' }
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
							createPage( api, fieldsetContentData );
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
						return 550;
					};
					// create new windowManager
					windowManager = new OO.ui.WindowManager();
					$( 'body' ).append( windowManager.$element );
					// set the width of the dialog
					ProcessDialog = new FormWizardDialog( { } );
					ProcessDialog.size = 'medium';
					dialog = new FormWizardDialog();
					windowManager.addWindows( [ dialog ] );
					windowManager.openWindow( dialog );
				}
			} );
		} );
	} );
}( mediaWiki ) );
