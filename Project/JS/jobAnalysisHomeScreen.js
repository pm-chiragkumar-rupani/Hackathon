
PubMatic.JobAnalysisProduct.Functions.getHomeScreen = function() {
	Ext.onReady(function() {
		
		var readDataMask = new Ext.LoadMask(Ext.getBody(), {msg:"Reading Data..."});
		readDataMask.show();
		
		d3.json(PubMatic.JobAnalysisProduct.FileNames.DataCenter)
			.get(function(error, dataCenterData) {
			d3.json(PubMatic.JobAnalysisProduct.FileNames.WorldMap, function(worldMapData) {
			
			
				readDataMask.hide();
				
				var rawData = {};
				
				rawData.dataCenterData = dataCenterData;
				
				Ext.create('Ext.container.Viewport', {
		            id: 'app-viewport',
		            layout: {
		                type: 'border',
		                padding: '0 5 5 5' // pad the layout from the window edges
		            },
		            items: [{
		                id: 'app-header',
		                xtype: 'container',
		                region: 'north',
		                height: 50,
		                layout: {
		        			type: 'hbox',
		        			align: 'stretch'
		        		},
		                items: [{
		        			id: 'pubmaticJobAnalysisProductHeaderPanelId',
		        			xtype: 'box',
		        			flex: 0.25,
		        			border: false,
		        			html: '<img src="./IMAGE/logo_pubmatic_new.png">'
		        		}]
		            },{
		            	id: 'pubmaticJobAnalysisProductContentContainerId',
		                xtype: 'container',
		                region: 'center',
		                layout: 'border',
		                items: [{
		                    id: 'app-portal',
		                    xtype: 'panel',
		                    region: 'center',
		                    layout: {
		                    	type: 'hbox',
		                    	align: 'stretch'
		                    },
		                    items: [{
		                		id: 'jobAnalysisProductAnalysisDetailsTabPanelId',
		                		xtype: 'tabpanel',
		                		layout: 'fit',
		                		enableTabScroll: true,
		                		defaults: {
						            autoScroll: true
						        },
		                		flex: 0.75,
		                		title: '',
		                		items: [{
			                		id: 'jobAnalysisProductDataCentersPanelId',
			                		xtype: 'panel',
			                		layout: 'fit',
			                		title: 'Data-Centers',
						            bodyPadding: 5
			                	}],
						        plugins: Ext.create('Ext.ux.TabCloseMenu', {
						            extraItemsTail: [
						                '-',
						                {
						                    text: 'Closable',
						                    checked: true,
						                    hideOnClick: true,
						                    handler: function (item) {
						                        currentItem.tab.setClosable(item.checked);
						                    }
						                },
						                '-',
						                {
						                    text: 'Enabled',
						                    checked: true,
						                    hideOnClick: true,
						                    handler: function(item) {
						                        currentItem.tab.setDisabled(!item.checked);
						                    }
						                }
						            ],
						            listeners: {
						                aftermenu: function () {
						                    currentItem = null;
						                },
						                beforemenu: function (menu, item) {
						                    menu.child('[text="Closable"]').setChecked(item.closable);
						                    menu.child('[text="Enabled"]').setChecked(!item.tab.isDisabled());

						                    currentItem = item;
						                }
						            }
						        })
		                	}, {
		                		id: 'jobAnalysisProductViewInformationPanelId',
		                		xtype: 'panel',
		                		flex: 0.25,
		                		layout: {
		                			type: 'vbox',
		                			align: 'stretch'
		                		},
		                		title: '',
		                		items: [{
			                		id: 'jobAnalysisProductViewInformationServersPanelId',
			                		xtype: 'panel',
			                		flex: 0.5,
			                		border: false,
			                		layout: 'fit',
			                		title: ''
			                	}, {
			                		id: 'jobAnalysisProductViewInformationCronsPanelId',
			                		xtype: 'panel',
			                		flex: 0.5,
			                		border: false,
			                		layout: 'fit',
			                		title: ''
			                	}]
		                	}]
		                }]
		            }]
		        });
				
				Ext.getCmp('jobAnalysisProductDataCentersPanelId').show();
				
				PubMatic.JobAnalysisProduct.Functions.getPubMaticDataCentersPanel('jobAnalysisProductDataCentersPanelId', worldMapData, dataCenterData);
				PubMatic.JobAnalysisProduct.Functions.getPubMaticServersPanel('jobAnalysisProductViewInformationServersPanelId');
				PubMatic.JobAnalysisProduct.Functions.getPubMaticCronsPanel('jobAnalysisProductViewInformationCronsPanelId');
			});

		});
		
	});
}