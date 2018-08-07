( function ( mw ) {
	$( function () {
		// {api} instance of mediaWiki api.``
		// {object} configData data from the parsed wikitext.
		// {int} viewControl variable used to control the stack views.
		var api, viewControl = 0;
		api = new mw.Api();

		/**
			* Create a SelectFileWidget.
			* @param {object} dict - The dictionary of configurations.
			* @return {object} - The SelectFileWidget.
			*/

		function makeSelectFileWidget( dict ) {
			var selectFileWidget = new OO.ui.SelectFileWidget( {
				accept: dict.accept,
				showDropTarget: dict.showDropTargets,
				classes: [ dict.class ]
			} );
			return selectFileWidget;
		}

		/**
			* Create a DropdownInputWidget.
			* @param {object} dict - The dictionary of configurations.
			* @return {object} - The DropdownInputWidget.
			*/

		function makeDropdownInputWidget( dict ) {
			var dropdownInputWidget = new OO.ui.DropdownInputWidget( {
				value: dict.value,
				options: dict.options,
				classes: [ dict.class ]
			} );
			return dropdownInputWidget;
		}

		/**
			* Create a NumberInputWidget.
			* @param {object} dict - The dictionary of configurations.
			* @return {object} - The NumberInputWidget.
			*/

		function makeNumberInputWidget( dict ) {
			var numberInputWidget = new OO.ui.NumberInputWidget( {
				isInteger: dict.isInteger,
				min: dict.min,
				max: dict.max,
				classes: [ dict.class ]
			} );
			return numberInputWidget;
		}

		/**
			* Create a RadioSelectInputWidget.
			* @param {object} dict - The dictionary of configurations.
			* @return {object} - The RadioSelectInputWidget.
			*/

		function makeRadioSelectInputWidget( dict ) {
			var radioSelectInputWidget = new OO.ui.RadioSelectInputWidget( {
				value: dict.value,
				options: dict.options,
				classes: [ dict.class ]
			} );
			return radioSelectInputWidget;
		}

		/**
			* Create a TextInputWidget.
			* @param {object} dict - The dictionary of configurations.
			* @return {object} - The TextInputWidget.
			*/

		function makesmallTextBox( dict ) {
			var smallTextBox = new OO.ui.TextInputWidget( {
				placeholder: dict.placeholder,
				title: dict.title,
				characterLength: dict.characterLength,
				required: dict.required,
				classes: [ dict.class ]
			} );
			return smallTextBox;
		}

		/**
			* Create a ComboBoxInputWidget.
			* @param {object} dict - The dictionary of configurations.
			* @return {object} - The ComboBoxInputWidget.
			*/

		function makeComboBoxInputWidget( dict ) {
			var comboBoxInputWidget = new OO.ui.ComboBoxInputWidget( {
				options: dict.options,
				label: dict.label,
				menu: dict.menu.filterFromInput,
				classes: [ dict.class ]
			} );
			return comboBoxInputWidget;
		}

		/**
			* Create a MultilineTextInputWidget.
			* @param {object} dict - The dictionary of configurations.
			* @return {object} - The MultilineTextInputWidget.
			*/

		function makeMultilineText( dict ) {
			var largeTextbox = new OO.ui.MultilineTextInputWidget( {
				rows: dict.rows,
				value: dict.value,
				autosize: dict.autosize,
				placeholder: dict.placeholder,
				classes: [ dict.class ]
			} );
			return largeTextbox;
		}

		/**
			* Create a CheckboxMultiselectInputWidget.
			* @param {object} dict - The dictionary of configurations.
			* @return {object} - The LabelText.
			*/

		function makeCheckboxMultiselect( dict ) {
			var checkboxMultiselect = new OO.ui.CheckboxMultiselectInputWidget( {
				value: dict.value,
				options: dict.options,
				classes: [ dict.class ]
			} );
			return checkboxMultiselect;
		}

		/**
			* Create a LabelWidget.
			* @param {object} dict - The dictionary of configurations.
			* @return {object} - The LabelText.
			*/

		function makeLabelText( dict ) {
			var labelText = new OO.ui.LabelWidget( {
				label: dict.label,
				classes: [ dict.class ],
				align: 'left'
			} );
			return labelText;
		}

		/**
			* Return a promise from the api call.
			* @param {object} api - instance of the mediaWiki api.
			* @return {object} - The promise.
			*/

		function setConfigData( api ) {
			var pr = api.get( {
				action: 'parse',
				page: mw.config.get( 'formWizardConfig' ),
				format: 'json',
				formatversion: 2,
				prop: 'wikitext'
			} );
			return pr;
		}

		/**
			* Create elements from data from config data.
			* @param {object} data - The json data from the api request.
			* @return {object} - The set of elements in a schema.
			*/

		function createElementsFromSchema( data ) {
			var elementSet = [], smallTextBox, multilineText, comboBoxInputWidget,
				checkboxMultiselect, numberInputWidget, labelText,
				radioSelectInputWidget, dropdownInputWidget, selectFileWidget;
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
			* @param {object} contentElements - The elements added to the fielset.
			* @return {object} - The FieldsetLayout.
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
			* @param {object} fieldSetContentElements - The elmentments of the fieldset.
			* @return {object} - The panel containing elements.
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
			* @param {object} stackPanels - The panels to be added to the stack.
			* @return {object} - The StackLayout containing panels.
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
			* @param {object} fieldset - the fielset where the data is obtained.
			* @return {object} - The fieldset data.
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
			* @param {object} fieldsetContainer - The container of fieldsets.
			* @return {object} - The content of the fieldset.
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
			* @param {object} pageContentData - The data for the page.
			* @return {string} - The content to be appended to page.
			*/

		function constructPageContent( pageContentData ) {
			var pageContent, i;
			pageContentData.forEach( function ( contentData ) {
				for ( i = 0; i < contentData.length; i++ ) {
					if ( i % 2 === 0 ) {
						pageContent += '\n== ' + contentData[ i ] + ' == \n' + contentData[ i + 1 ] + '\n';
					}
				}
			} );
			return pageContent;
		}

		/**
			* An api request to edit a edit/create a page.
			* @param {object} api - instance of the mw.api().
			* @param {object} fieldsetContentData - The data used to create page.
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
						'Complete', { type: 'info' } );
				} );
			} );
		}

		/**
			* Create an instance of a dialog.
			* @param {object} config - dialog configuration.
			* Note: Changing this name FormWizardDialog means changing the dialog
			* 	name name below.
			*/

		function FormWizardDialog( config ) {
			FormWizardDialog.parent.call( this, config );
		}

		// When the launch button is clicked
		$( '#formwizard-launch' ).click( function () {
			// {object} fieldsetElements stores step elements from data schema
			// {object} fieldsetContent Holds the contents of eachfieldset
			// {object} fieldsetContainer stores fielsets
			// {object stackPanels }Holds the panels to be added to the stack
			// {object} fieldsetContentData Holds data from the panel fieldset elements
			var fieldsetElements = [],
				fieldsetContent = [], fieldsetContainer = [], stackPanels = [],
				fieldsetContentData = [], configData;
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
