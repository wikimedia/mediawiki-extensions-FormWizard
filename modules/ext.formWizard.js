$( document ).ready( function( e ) {
	$( function() {
			// When the launch button is clicked
			$( '#formwizard-launch' ).click( function( e ) {
				getDataSchema( 'parse', mw.config.get('formWizardconfig')	, 'json', 2 );
			} );
			var api = new mw.Api();

			/**
			 * Get data from through the api.
			 * @param {string} action - The api action.
			 * @param {string} page - The page on which the action is performed.
			 * @param {string} format = The format of the result.
			 * @param {version} version - the api version.
			 */
			function getDataSchema( action, page, format, version ) {
				api.get( {
					action: action,
					page: page,
					format: format,
					formatversion: version,
					prop: 'wikitext'
				} ).done( function ( data ) {

					var data = JSON.parse( data.parse.wikitext ).steps;
					// variable used to control the stack views
					var viewControl = 0;
					// stores step elements set from createElementsFromSchema
					var fieldsetElements = [];
					// Holds the contents of eachfieldset
					let fieldsetContent = [];
					//stores fielsets
					var fieldsetContainer = [];
					//holds the panels to be added to the stack
					var stackPanels = [];
					//Holds data from the panel fieldset elements
					var fieldsetContentData = [];

					// Display a dialog for undefined JSON
					if ( data == undefined || data == '' ) {
						// alert user of poor configuration file
						OO.ui.alert( 'Please Check the configuration settings!', { size: 'medium' } );
					} else {

						// getting schema and creating ooui elements and storing in container
						$.each( data, function( step,schema ) {
							fieldsetElements = createElementsFromSchema( schema );
									fieldsetContainer.push( fieldsetElements );
						} )

						/**
						 * Create an instance of the ProcessDialog.
						 * @param {object} config - The processDialog configurations.
						 */
						function FormWizardDialog( config ) {
							FormWizardDialog.parent.call( this, config );
						}
						OO.inheritClass( FormWizardDialog, OO.ui.ProcessDialog );

						FormWizardDialog.static.name = 'formWizardDialog';
						FormWizardDialog.static.title = mw.config.get('formWizardProject');
						FormWizardDialog.static.actions = [
							{ action: 'continue', modes: 'edit', label: 'Next', flags: [ 'primary', 'constructive' ] },
							{ modes: ['edit', 'final'], label: 'Cancel', flags: 'safe' },
							{ modes: 'final', action: 'save', label: 'Done', flags: 'primary' }
						];

						FormWizardDialog.prototype.initialize = function () {
							FormWizardDialog.parent.prototype.initialize.apply( this, arguments );

							// get elements from the fieldset container
							fieldsetContainer.forEach( function( elt ) {
								fieldsetContent.push( elt );
							} );

							fieldsetContent.forEach( function( content ){
								panel = AddPanelElementsToPanel( content );
								stackPanels.push( panel );
							} );

							//create a new stack with items araray of panels
							var stack = makeStack( stackPanels );
								this.stackLayout = stack;
								this.$body.append( this.stackLayout.$element );
							};

							// Set up the initial mode of the window ('edit', in this example.)
						FormWizardDialog.prototype.getSetupProcess = function ( data ) {
							return FormWizardDialog.super.prototype.getSetupProcess.call( this, data )
								.next( function() {
									this.actions.setMode( 'edit' );
								}, this );
						};

						FormWizardDialog.prototype.getActionProcess = function ( action ) {
							//The Done button has been clicked
							if ( action === 'save' ) {

									// we get the fieldsetContentData from the container of fieldsets
								fieldsetContentData = getFieldSetContendData( fieldsetContainer );

								 // We make an API request to create a page

								createPage(api, fieldsetContentData);
									// Here we close the dialog after processing
							  var dialog = this;
								return new OO.ui.Process( function () {
										// do something about the edit
										dialog.close();
								} );
							} //the continue button was clicked
							else if ( action === 'continue'  && viewControl < ( stackPanels.length - 1 )  ) {

								// console.log('fieldsetContentData ->', fieldsetContentData);

								this.stackLayout.setItem( stackPanels[ viewControl + 1 ] );
								viewControl++;
								if( viewControl == ( stackPanels.length - 1 ) ) {
									this.actions.setMode( 'final' );
								}
							} // the Cancel button was clicked
							else if ( action === 'safe' ) {
								var dialog = this;
								return new OO.ui.Process( function () {
									dialog.close();
								} );
							}
							return FormWizardDialog.parent.prototype.getActionProcess.call( this, action );
						};

						// set the height of the dialog box
						FormWizardDialog.prototype.getBodyHeight = function () {
							return 600;
						};
							// create new windowManager
						var windowManager = new OO.ui.WindowManager();
						$( 'body' ).append( windowManager.$element );
						// set the width of the dialog
						var ProcessDialog = new FormWizardDialog( {
							size: 'large'
						} );

						var dialog = new FormWizardDialog();
						windowManager.addWindows( [ dialog ] );
						windowManager.openWindow( dialog );
					}
				} );
			}

			/**
			 * Create a SelectFileWidget.
			 * @param {object} dict - The dictionary of configurations.
			 */
			function makeSelectFileWidget( dict ) {
				var SelectFileWidget = new OO.ui.SelectFileWidget( {
				    accept: dict.accept,
				    showDropTarget: dict.showDropTargets,
						classes: [ dict.class ]
				} );
				return SelectFileWidget;
			}

			/**
			 * Create a DropdownInputWidget.
			 * @param {object} dict - The dictionary of configurations.
			 */
			function makeDropdownInputWidget( dict ) {
				var DropdownInputWidget = new OO.ui.DropdownInputWidget( {
				    value: dict.value,
				    options: dict.options,
						classes: [ dict.class ]
				} );
				return DropdownInputWidget;
			}

			/**
			 * Create a NumberInputWidget.
			 * @param {object} dict - The dictionary of configurations.
			 */
			function makeNumberInputWidget( dict ) {
				var NumberInputWidget = new OO.ui.NumberInputWidget( {
				    isInteger: dict.isInteger,
				    min: dict.min,
				    max: dict.max,
						classes: [ dict.class ]
				} );
				return NumberInputWidget;
			}

			/**
			 * Create a RadioSelectInputWidget.
			 * @param {object} dict - The dictionary of configurations.
			 */
			function makeRadioSelectInputWidget( dict ) {
				var RadioSelectInputWidget = new OO.ui.RadioSelectInputWidget( {
				    value: dict.value,
				    options: dict.options,
						classes: [ dict.class ]
				} );
				return RadioSelectInputWidget;
			}

			/**
			 * Create a TextInputWidget.
			 * @param {object} dict - The dictionary of configurations.
			 */
			function makesmallTextBox( dict ) {
				var smallTextBox = new OO.ui.TextInputWidget( {
					placeholder: dict.placeholder,
					title: dict.title,
					characterLength : dict.characterLength,
					required: dict.required,
					classes: [dict.class]
				} );
				return smallTextBox;
			}

			/**
			 * Create a ComboBoxInputWidget.
			 * @param {object} dict - The dictionary of configurations.
			 */
			function makeComboBoxInputWidget( dict ) {
				var ComboBoxInputWidget =  new OO.ui.ComboBoxInputWidget( {
					options: dict.options,
					label: dict.label,
					menu: dict.menu.filterFromInput,
					classes: [dict.class]
				});
				return ComboBoxInputWidget;
			}

			/**
			 * Create a MultilineTextInputWidget.
			 * @param {object} dict - The dictionary of configurations.
			 */
			function makeMultilineText( dict ) {
				var LargeTextbox = new OO.ui.MultilineTextInputWidget( {

					rows: dict.rows,
					value: dict.value,
					rows: dict.rows,
					autosize: dict.autosize,
					placeholder: dict.placeholder,
					classes: [dict.class]
				} );
				return LargeTextbox;
			}

			/**
			 * Create a CheckboxMultiselectInputWidget.
			 * @param {object} dict - The dictionary of configurations.
			 */
			function makeCheckboxMultiselect( dict ) {
				var checkboxMultiselect = new OO.ui.CheckboxMultiselectInputWidget( {
					value: dict.value,
					options: dict.options,
					classes: [dict.class]
				} );
				return checkboxMultiselect;
			}

			/**
			 * Create a LabelWidget.
			 * @param {object} dict - The dictionary of configurations.
			 */
			function makeLabelText( dict ) {
				var labelText =  new OO.ui.LabelWidget( {
					label: dict.label,
					classes: [dict.class],
					align: 'left'
				} );
				return labelText;
			}

			/**
			 * Create a StackLayout.
			 * @param {object} stackPanels - The panels to be added to the stack.
			 */
			function makeStack( stackPanels ) {
				var stack = new OO.ui.StackLayout( {
						classes: ['container'],
						items: stackPanels,
						padded: true
				} );
				return stack;
			}

			/**
			 * Create a FieldsetLayout.
			 * @param {object} contentElements - The elements added to the fielset.
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
			 */
			function AddPanelElementsToPanel( fieldSetContentElements ) {
				var fieldSet = createFieldSet( fieldSetContentElements );
				var panel = new OO.ui.PanelLayout( {
					padded: true,
					expanded: false,
					scrollable: true,
					classes: [ 'container' ]
				} );
				panel.$element.append(fieldSet.$element);
				return panel;
			}

			/**
			 * Create elements from data from config data.
			 * @param {object} data - The json data from the api request.
			 */
			function createElementsFromSchema( data ) {
				var elementSet = [];
				$.each( data.schema, function( key, value ) {
					switch( value.type ) {
						case 'smallTextBox':
							var smallTextBox = makesmallTextBox( value );
							elementSet.push( smallTextBox );
							break;
						case 'MultilineText':
							var MultilineText = makeMultilineText( value );
							elementSet.push( MultilineText );
							break;
						case 'ComboBoxInputWidget':
							var ComboBoxInputWidget = makeComboBoxInputWidget( value );
							elementSet.push( ComboBoxInputWidget );
							break;
						case 'CheckboxMultiselect':
							var checkboxMultiselect = makeCheckboxMultiselect( value );
							elementSet.push( checkboxMultiselect );
							break;
						case 'LabelText':
							labelText = makeLabelText( value );
							elementSet.push( labelText );
							break;
						case 'NumberInputWidget':
							var numberInputWidget = makeNumberInputWidget( value );
							elementSet.push( numberInputWidget );
							break;
						case 'RadioSelectInputWidget':
							var radioSelectInputWidget = makeRadioSelectInputWidget( value );
							elementSet.push( radioSelectInputWidget );
							break;
						case 'DropdownInputWidget':
							var dropdownInputWidget = makeDropdownInputWidget( value );
							elementSet.push( dropdownInputWidget );
							break;
						case 'SelectFileWidget':
							var selectFileWidget = makeSelectFileWidget( value );
							elementSet.push( selectFileWidget );
							break;
					}
				} )
				return elementSet;
			}

			/**
			 * Get data from a fieldset.
			 * @param {object} fieldset - the fielset where the data is obtained.
			 */
			function getFieldSetData( fieldset ) {
				var fieldData = [];
				fieldset.forEach( function( field ) {
					if ( field.label ) {
						fieldData.push( field.label );
					}else {
						fieldData.push( field.value );
					}
				} );
				return fieldData;
			}

			/**
			 * Gets the data from an object holding fieldsets.
			 * @param {object} fieldsetContainer - The container of fieldsets.
			 */
			function getFieldSetContendData( fieldsetContainer ) {
				var ContentData = [];
				fieldsetContainer.forEach( function( fieldset ) {
					var fieldsetData = getFieldSetData( fieldset );
					ContentData.push( fieldsetData );
				} );
				return ContentData;
			}

			/**
			 * construct the page content using data.
			 * @param {object} pageContentData - The data for the page.
			 */
			function constructPageConten( pageContentData ) {
				console.log( ' pageContentData ',pageContentData );
				var pageContent;
				pageContentData.forEach( function( contentData ) {
					for ( var i = 0; i < contentData.length; i++) {
						if ( i % 2 == 0 ) {
							pageContent += '\n== ' + contentData[i] + ' == \n' +  contentData[i + 1] + '\n';
						}
					}
				} );
				return pageContent;
			}

			/**
			 * An api request to edit a edit/create a page.
			 * @param {object} api - instance of the mw.api()
			 * @param {object} pageContentData - The data for the page.
			 */
			function createPage( api, fieldsetContentData ) {
				var date = new Date();
				api.postWithToken( 'csrf', {
					action: 'edit',
					title: mw.config.get( 'formWizardPageName' ),
					appendtext: constructPageConten( fieldsetContentData ),
					basetimestamp: date.toISOString()
				} ).done( function() {
					mw.loader.using( 'mediawiki.notify', function() {
						mw.notify( mw.config.get( 'formWizardProject' )+' \n\n'+'Complete', { type: 'info' } );
					} );
				} );
			}
	});
});
