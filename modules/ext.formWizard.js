$( document ).ready( function( e ) {
		$( function() {
			// When the launch button is clicked
			$( '#formwizard-launch' ).click( function( e ) {
				getDataSchema( 'parse', mw.config.get('formWizardconfig')	, 'json', 2 );
			} );

				function getDataSchema( action, page, format, version ) {
					console.log(action, page , format, version );
					var api = new mw.Api();
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
						//stores fielsets
						var fieldsetContainer = [];
						//holds the panels to be added to the stack
						var stackPanels = [];

						// Display a dialog for undefined JSON
						if ( data == undefined || data == '' ) {
							//alert('invalid Steps in Configuration');
							OO.ui.alert( 'Please Check the configuration settings!', { size: 'medium' } );
						} else {

													// getting schema and creating ooui elements and storing in container
													$.each( data, function( step,schema ) {
														fieldsetElements = createElementsFromSchema( schema );
														fieldsetContainer.push( fieldsetElements );
													} )

												// starting a new dialog
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

														// Holds the contents of eachfieldset
														let fieldsetContent = [];
														// all fieldsets with elements already added
														var fielsetPageContent = [];

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
												  .next( function () {
												    this.actions.setMode( 'edit' );
												  }, this );
												};

												FormWizardDialog.prototype.getActionProcess = function ( action ) {
													//The Done button has been clicked
													if ( action === 'save' ) {
															alert( 'Done Filling form' );
															// Here we close the dialog after processing
															var dialog = this;
															return new OO.ui.Process( function () {
																// do something about the edit
																dialog.close();
															} );
													} //the continue button was clicked
													else if ( action === 'continue'  && viewControl < ( stackPanels.length - 1 )  ) {
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
												  return 500;
												};
												// create new windowManager
												var windowManager = new OO.ui.WindowManager();
												$( 'body' ).append( windowManager.$element );
												// set the width of the dialog
												var ProcessDialog = new FormWizardDialog({
												  size: 'large'
												});

												var dialog = new FormWizardDialog();
												windowManager.addWindows( [ dialog ] );
												windowManager.openWindow( dialog );
							}
					});
				}

				function makesmallTextBox( dict ) {
					var smallTextBox = new OO.ui.TextInputWidget( {
						placeholder: dict.placeholder,
						title: dict.title,
						characterLength : dict.characterLength,
						required: dict.required
					} );
					return smallTextBox;
				}

				function makeButton( dict ) {
					var button = new OO.ui.ButtonWidget( {
						label: dict.label,
						flags: [ dict.flags ],
						icon: dict.icon
					} );
					return button;
				}

				function makeDropdown( dict ) {
					var dropdown =  new OO.ui.ComboBoxInputWidget( {
						options: dict.options,
						label: dict.label,
						menu: dict.menu.filterFromInput
					});
					console.log(dict.menu.filterFromInput)
					return dropdown;
				}

				function makeMultilineText( dict ) {
					var LargeTextbox = new OO.ui.MultilineTextInputWidget( {
						rows: dict.rows,
						value: dict.value,
						rows: dict.rows,
						autosize: dict.autosize,
						placeholder: dict.placeholder
					} );
					return LargeTextbox;
				}

				function makeCheckboxMultiselect( dict ) {
					var checkboxMultiselect = new OO.ui.CheckboxMultiselectInputWidget( {
						value: dict.value,
						options: dict.options
					} );
					return checkboxMultiselect;
				}

				function makeSelectFile( dict ) {
					var selectFileWidget = new OO.ui.SelectFileWidget( {
						showDropTarget: dict.showDropTarget
					} );

					return selectFileWidget;
				}

				function makeLabelText( dict ) {
					var labelText =  new OO.ui.LabelWidget( {
						label: dict.label
					} );
					return labelText;
				}

				function makeStack( stackPanels ) {
					var stack = new OO.ui.StackLayout( {
							classes: ['container'],
							items: stackPanels,
							padded: true
					} );
					return stack;
				}

				function createFieldSet( contentElements ) {

					var fieldset = new OO.ui.FieldsetLayout( {
												classes: [ 'container' ]
					 							} );
					fieldset.addItems( contentElements );
					return fieldset;
				}

				function AddPanelElementsToPanel( fieldSetContentElements ) {
						fieldSet = createFieldSet( fieldSetContentElements );

						var panel = new OO.ui.PanelLayout( {
														padded: true,
														expanded: false,
														scrollable: true,
														classes: [ 'container' ]
												} );
						panel.$element.append(fieldSet.$element);
						return panel;
				}

				function createElementsFromSchema( data ) {
					var elementSet = [];
					$.each( data.schema, function( key, value ) {
						switch( value.type ){
							case 'smallTextBox':
								smallTextBox = makesmallTextBox( value );
								elementSet.push( smallTextBox );
								break;
							case 'MultilineText':
								 MultilineText = makeMultilineText( value );
								 elementSet.push( MultilineText );
								 break;
							case 'button':
								button = makeButton( value );
								elementSet.push( button );
								break;
							case 'dropdown':
								dropdown = makeDropdown(value);
								elementSet.push(dropdown);
								break;
							case 'CheckboxMultiselect':
								checkboxMultiselect = makeCheckboxMultiselect( value );
								elementSet.push( checkboxMultiselect );
								break;
							case 'SelectFileWidget':
								selectFileWidget = makeSelectFile( value );
								elementSet.push ( selectFileWidget );
								break;
							case 'Label':
								labelText = makeLabelText( value );
								elementSet.push( labelText );
								break;
						}
					})
					return elementSet;
				}
		});
});
