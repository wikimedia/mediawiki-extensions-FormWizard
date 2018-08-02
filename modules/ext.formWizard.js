$( document ).ready( function( e ) {
	$( function() {
			// When the launch button is clicked
			$( '#formwizard-launch' ).click( function( e ) {
				getDataSchema( 'parse', mw.config.get('formWizardconfig')	, 'json', 2 );
			} );
			var api = new mw.Api();

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

			function makeDropdown( dict ) {
				var dropdown =  new OO.ui.ComboBoxInputWidget( {
					options: dict.options,
					label: dict.label,
					menu: dict.menu.filterFromInput,
					classes: [dict.class]
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
					placeholder: dict.placeholder,
					classes: [dict.class]
				} );
				return LargeTextbox;
			}

			function makeCheckboxMultiselect( dict ) {
				var checkboxMultiselect = new OO.ui.CheckboxMultiselectInputWidget( {
					value: dict.value,
					options: dict.options,
					classes: [dict.class]
				} );
				return checkboxMultiselect;
			}

			function makeSelectFile( dict ) {
				var selectFileWidget = new OO.ui.SelectFileWidget( {
					showDropTarget: dict.showDropTarget,
					classes: [dict.class]
				} );
				return selectFileWidget;
			}

			function makeLabelText( dict ) {
				var labelText =  new OO.ui.LabelWidget( {
					label: dict.label,
					classes: [dict.class],
					align: 'left'
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

			function createElementsFromSchema( data ) {

				var elementSet = [];
				$.each( data.schema, function( key, value ) {
					switch( value.type ){
						case 'smallTextBox':
							var smallTextBox = makesmallTextBox( value );
							elementSet.push( smallTextBox );
							break;
						case 'MultilineText':
							var MultilineText = makeMultilineText( value );
							elementSet.push( MultilineText );
							break;
						case 'button':
							var button = makeButton( value );
							elementSet.push( button );
							break;
						case 'dropdown':
							var dropdown = makeDropdown(value);
							elementSet.push(dropdown);
							break;
						case 'CheckboxMultiselect':
							var checkboxMultiselect = makeCheckboxMultiselect( value );
							elementSet.push( checkboxMultiselect );
							break;
						case 'SelectFileWidget':
							var selectFileWidget = makeSelectFile( value );
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

			function getFieldSetContendData( fieldsetContainer ) {
				var ContentData = [];
				fieldsetContainer.forEach( function( fieldset ) {
					var fieldsetData = getFieldSetData( fieldset );
					ContentData.push( fieldsetData );
				} );
				return ContentData;
			}

			function constructPageConten( pageContentData ) {
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

			function createPage( api, fieldsetContentData ) {
				var date = new Date();
				api.postWithToken( 'csrf', {
					action: 'edit',
					title: mw.config.get( 'formWizardPageName' ),
					appendtext: constructPageConten( fieldsetContentData ),
					basetimestamp: date.toISOString()
				} ).done( function() {
					mw.loader.using( 'mediawiki.notify', function() {
						mw.notify( mw.config.get( 'formWizardProject' )+' \n\n'+'Complete', { type: 'info' }  );
					} );
				} );
			}
	});
});
