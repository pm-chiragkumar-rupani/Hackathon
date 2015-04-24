
PubMatic.JobAnalysisProduct.Functions.getHomeScreen = function() {
	Ext.onReady(function() {
		
		var readDataMask = new Ext.LoadMask(Ext.getBody(), {msg:"Reading Data..."});
		readDataMask.show();
		
		d3.csv(PubMatic.JobAnalysisProduct.FileNames.StreamJobMap, function(streamJobsData) {
			d3.csv(PubMatic.JobAnalysisProduct.FileNames.JobThresholdStatistics, function(jobThresholdData) {
				d3.csv(PubMatic.JobAnalysisProduct.FileNames.AllJobStatistics, function(jobStatsData) {
					d3.csv(PubMatic.JobAnalysisProduct.FileNames.JobCooccurrence, function(cooccurrenceData) {
						d3.csv(PubMatic.JobAnalysisProduct.FileNames.JobRunsStatistics, function(runData) {
							d3.csv(PubMatic.JobAnalysisProduct.FileNames.JobForecastingRuntime, function(forecastData) {
								d3.csv(PubMatic.JobAnalysisProduct.FileNames.JobRuntimeHeatmap, function(jobHeatmapData) {
									d3.csv(PubMatic.JobAnalysisProduct.FileNames.JobRuntimeDistribution, function(jobHistogramData) {
										d3.csv(PubMatic.JobAnalysisProduct.FileNames.JobSlaDependencies, function(error, jobDependencyData) {
			
											readDataMask.hide();
											
											var streamNameCombobox = getStreamNameCombobox(streamJobsData);
											var jobNameCombobox = getJobNameCombobox();
											var rawData = {};
											
											rawData.jobThresholdData = jobThresholdData;
											rawData.jobStatsData = jobStatsData;
											rawData.cooccurrenceData = cooccurrenceData;
											rawData.runData = runData;
											rawData.forecastData = forecastData;
											rawData.jobHeatmapData = jobHeatmapData;
											rawData.jobHistogramData = jobHistogramData;
											rawData.jobDependencyData = jobDependencyData;
											
											var analogClockStart = VizGallery.clock.getAnalogClock();
											var analogClockEnd = VizGallery.clock.getAnalogClock();
											
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
									        		}, {
									        			id: 'pubmaticJobAnalysisProductHeaderInputFormPanelId',
									        			xtype: 'fieldcontainer',
									        			layout: {
									        				type: 'hbox',
									        				align: 'middle',
									        				pack: 'end'
									        			},
									        			flex: 0.75,
									        			items: [streamNameCombobox, jobNameCombobox, {
									        				xtype: 'button',
									        				text: 'Show',
									        				handler: function () {
									        					var streamName = Ext.getCmp('pubmaticJobAnalysisProductHeaderStreamNameInputComboId').getValue();
									        					var jobName = Ext.getCmp('pubmaticJobAnalysisProductHeaderJobNameInputComboId').getValue();
									        					if(streamName == undefined || streamName == '' || jobName == undefined || jobName == '') {
									        						alert('Please select any stream !!!');
									        					} else {
									        						PubMatic.JobAnalysisProduct.Functions.generateJobAnalysisDashboardDataAndPopulate('app-portal', rawData, analogClockStart, analogClockEnd, streamName, jobName);
									        					}
									        				}
									        			}]
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
									                		id: 'jobAnalysisProductJobAnalysisSummaryPanelId',
									                		xtype: 'panel',
									                		flex: 0.3,
									                		bodyPadding: '10 10 10 10',
									                		layout: {
									                			type: 'vbox',
									                			align: 'stretch'
									                		},
									                		title: '',
									                		items: [{
									                			id: 'jobAnalysisProductJobAnalysisSummaryThresholdsPanelId',
									                			xtype: 'fieldset',
									                			cls: 'summaryPageFieldSet',
									                			title: '1. Runtime Thresholds',
									                			style: 'padding: 0 0 0 10px;',
									                			flex: 0.25,
									                			layout: {
									                				type: 'hbox',
									                				align: 'stretch'
									                			},
									                			items: [{
									            					id: 'jobAnalysisProductJobAnalysisSummaryMetricThresholdsPanelId',
									            					xtype: 'panel',
									            					border: false,
									            					flex: 0.5,
									            					layout: 'fit'
									            				}, {
									            					id: 'jobAnalysisProductJobAnalysisSummaryUserThresholdsPanelId',
									            					xtype: 'panel',
									            					border: false,
									            					flex: 0.5,
									            					layout: 'fit'
									            				}]
									                		}, {
									                			id: 'jobAnalysisProductJobAnalysisSummarySLAPanelId',
									                			xtype: 'fieldset',
									                			cls: 'summaryPageFieldSet',
									                			style: 'padding: 0 0 0 10px;',
									                			title: '2. Start/End Time Thresholds',
									                			flex: 0.25,
									                			layout: {
									                				type: 'hbox',
									                				align: 'stretch'
									                			},
									                			items: [{
									            					id: 'jobAnalysisProductJobAnalysisSummarySLAStartPanelId',
									            					xtype: 'panel',
									            					border: false,
									            					flex: 0.5,
									            					layout: 'fit'
									            				}, {
									            					id: 'jobAnalysisProductJobAnalysisSummarySLAEndPanelId',
									            					xtype: 'panel',
									            					border: false,
									            					flex: 0.5,
									            					layout: 'fit'
									            				}]
									                		}, {
									                			id: 'jobAnalysisProductJobAnalysisSummaryCoOccurrencePanelId',
									                			xtype: 'fieldset',
									                			cls: 'summaryPageFieldSet',
									                			title: '3. Co-occurence Signature',
									                			flex: 0.25,
									                			layout: 'fit'
									                		}, {
									                			id: 'jobAnalysisProductJobAnalysisSummaryForecastPanelId',
									                			xtype: 'fieldset',
									                			cls: 'summaryPageFieldSet',
									                			title: '4. Forecasting',
									                			flex: 0.25,
									                			layout: 'fit'
									                		}]
									                	}, {
									                		id: 'jobAnalysisProductJobAnalysisDetailsTabPanelId',
									                		xtype: 'tabpanel',
									                		layout: 'fit',
									                		flex: 0.7,
									                		title: '',
									                		items: [{
										                		id: 'jobAnalysisProductJobAnalysisRunTimeProfilePanelId',
										                		xtype: 'panel',
										                		layout: {
										                			type: 'vbox',
										                			align: 'stretch'
										                		},
										                		title: 'Runtime Thresholds',
										                		items: [{
									            					id: 'jobAnalysisProductJobAnalysisRunTimeProfileStatisticsPanelId',
									            					xtype: 'panel',
									            					border: false,
									            					flex: 0.4,
									            					layout: {
											                			type: 'hbox',
											                			align: 'stretch'
											                		},
											                		items: [{
										            					id: 'jobAnalysisProductJobAnalysisRuntimeHeatmapPanelId',
										            					xtype: 'panel',
										            					flex: 0.5,
										            					layout: 'fit',
										            					title: 'Runtime Heatmap',
										            					titleAlign: 'center'
										            				}, {
										            					id: 'jobAnalysisProductJobAnalysisRuntimeHistogramPanelId',
										            					xtype: 'panel',
										            					flex: 0.5,
										            					layout: 'fit',
										            					title: 'Runtime(Secs) Histogram',
										            					titleAlign: 'center'
										            				}]
									            				}, {
									            					id: 'jobAnalysisProductJobAnalysisRuntimeTimeseriesPanelId',
									            					xtype: 'panel',
									            					flex: 0.6,
									            					layout: 'fit',
									            					title: 'Runtime Timeseries',
									            					titleAlign: 'center'
									            				}]
										                	}, {
										                		id: 'jobAnalysisProductJobAnalysisSLAPanelId',
										                		xtype: 'panel',
										                		layout: {
										                			type: 'vbox',
										                			align: 'stretch'
										                		},
										                		title: 'Start/End Time Thresholds'
										                	}, {
										                		id: 'jobAnalysisProductJobAnalysisCoOccurrenceSignaturePanelId',
										                		xtype: 'panel',
										                		layout: {
										                			type: 'vbox',
										                			align: 'stretch'
										                		},
										                		title: 'Co-Occurrence Signature'
										                	}, {
										                		id: 'jobAnalysisProductJobAnalysisForecastPanelId',
										                		xtype: 'panel',
										                		layout: 'fit',
										                		title: 'Forecasting'
										                	}]
									                	}]
									                }]
									            }]
									        });
											
											Ext.getCmp('jobAnalysisProductJobAnalysisSLAPanelId').show();
											Ext.getCmp('jobAnalysisProductJobAnalysisCoOccurrenceSignaturePanelId').show();
											Ext.getCmp('jobAnalysisProductJobAnalysisForecastPanelId').show();											
											Ext.getCmp('jobAnalysisProductJobAnalysisRunTimeProfilePanelId').show();
											
											PubMatic.JobAnalysisProduct.Functions.getJobAnalysisSummaryThresholdPanel('jobAnalysisProductJobAnalysisSummaryMetricThresholdsPanelId', 'metricBehavior', '');
											PubMatic.JobAnalysisProduct.Functions.getJobAnalysisSummaryThresholdPanel('jobAnalysisProductJobAnalysisSummaryUserThresholdsPanelId', 'userBehavior', '');
											
											PubMatic.JobAnalysisProduct.Functions.getJobAnalysisSummarySLAPanel('jobAnalysisProductJobAnalysisSummarySLAStartPanelId', analogClockStart, 'Start', '');
											PubMatic.JobAnalysisProduct.Functions.getJobAnalysisSummarySLAPanel('jobAnalysisProductJobAnalysisSummarySLAEndPanelId', analogClockEnd, 'End', '');
											
											PubMatic.JobAnalysisProduct.Functions.getJobAnalysisSummaryCooccurrencePanel('jobAnalysisProductJobAnalysisSummaryCoOccurrencePanelId', '', '');
											PubMatic.JobAnalysisProduct.Functions.getJobAnalysisSummaryForecastingPanel('jobAnalysisProductJobAnalysisSummaryForecastPanelId', '');
											
											PubMatic.JobAnalysisProduct.Functions.getJobAnalysisRuntimeProfileHeatmapPanel('jobAnalysisProductJobAnalysisRuntimeHeatmapPanelId', '');
											PubMatic.JobAnalysisProduct.Functions.getJobAnalysisRuntimeProfileHistogramPanel('jobAnalysisProductJobAnalysisRuntimeHistogramPanelId', '');
											PubMatic.JobAnalysisProduct.Functions.getJobAnalysisRuntimeProfileTimeseriesPanel('jobAnalysisProductJobAnalysisRuntimeTimeseriesPanelId', '');
											
											PubMatic.JobAnalysisProduct.Functions.getJobAnalysisForecastingAnalysisTimeseriesPanel('jobAnalysisProductJobAnalysisForecastPanelId', '', '');
											
											function getStreamNameCombobox(streamJobsData) {
												var allStreams = [];
												
												streamJobsData.forEach(function(eachData) {
													allStreams.push(eachData.streamName);
												});
												
												allStreams = allStreams.unique();
												
												var allStreamsJsonData = [];
												
												allStreams.forEach(function(eachData) {
													var temp = {};
													temp.streamName = eachData;
													allStreamsJsonData.push(temp);
												});
												
												allStreamsJsonData.sort(function(d) { return d.streamName;});
												
												Ext.define('Streams', {
												    extend: 'Ext.data.Model',
												    fields: [
												        {name:'streamName', type:'string'}
												    ]
												});
												
												var streamNameStore = Ext.create('Ext.data.Store', {
											        model: 'Streams',
											        data : allStreamsJsonData,
											        autoLoad: true
											    });
												
												var streamNameCombo = Ext.create('Ext.form.ComboBox', {
													id: "pubmaticJobAnalysisProductHeaderStreamNameInputComboId",
											        store: streamNameStore,
											        queryMode: 'local',
											        emptyText: 'Select Stream',
											        displayField: 'streamName',
											        margin: '0 10 0 0',
											        typeAhead: true,
											        valueField: 'streamName'
											    });
												
												streamNameCombo.on('change', function(combo, newValue, oldValue, eOpts) {
													var streamName = newValue;
													
													if(streamName != null) {
														var allJobsJsonData = [];
														
														streamJobsData.forEach(function(eachData) {
															if(eachData.streamName.toLowerCase() === streamName.toLowerCase()) {
																var temp = {};
																temp.jobName = eachData.jobName;
																allJobsJsonData.push(temp);
															}
														});
														
														allJobsJsonData.sort(function(d) { return d.jobName;});
														
														Ext.getCmp('pubmaticJobAnalysisProductHeaderJobNameInputComboId').getStore().loadData(allJobsJsonData);
													}
												});
												
												return streamNameCombo;
											}
											
											function getJobNameCombobox() {
												
												Ext.define('Jobs', {
												    extend: 'Ext.data.Model',
												    fields: [
												        {name:'jobName', type:'string'}
												    ]
												});
												
												var jobNameStore = Ext.create('Ext.data.Store', {
											        model: 'Jobs',
											        data : [],
											        autoLoad: true
											    });
												
												var jobNameCombo = Ext.create('Ext.form.ComboBox', {
													id: "pubmaticJobAnalysisProductHeaderJobNameInputComboId",
											        store: jobNameStore,
											        queryMode: 'local',
											        typeAhead: true,
											        margin: '0 10 0 0',
											        emptyText: 'Select Job',
											        displayField: 'jobName',
											        valueField: 'jobName'
											    });
												
//												jobNameCombo.on('change', function(combo, newValue, oldValue, eOpts) {
//													var streamName = Ext.getCmp('pubmaticJobAnalysisProductHeaderStreamNameInputComboId').getValue();
//													var jobName = newValue;
//													
//													
//													
//								//					PubMatic.JobAnalysisProduct.Functions.getJobAnalysisSummaryThresholdPanel('jobAnalysisProductJobAnalysisSummaryMetricThresholdsPanelId', 'metricBehavior', streamName, jobName);
//								//					PubMatic.JobAnalysisProduct.Functions.getJobAnalysisSummaryThresholdPanel('jobAnalysisProductJobAnalysisSummaryUserThresholdsPanelId', 'userBehavior', streamName, jobName);
//								//					PubMatic.JobAnalysisProduct.Functions.getJobAnalysisSummarySLAPanel('jobAnalysisProductJobAnalysisSummarySLAStartPanelId', analogClockStart, 'Start', streamName, jobName);
//								//					PubMatic.JobAnalysisProduct.Functions.getJobAnalysisSummarySLAPanel('jobAnalysisProductJobAnalysisSummarySLAEndPanelId', analogClockEnd, 'End', streamName, jobName);
//								//					PubMatic.JobAnalysisProduct.Functions.getJobAnalysisSummaryCooccurrencePanel('jobAnalysisProductJobAnalysisSummaryCoOccurrencePanelId', streamName, jobName);
//								//					PubMatic.JobAnalysisProduct.Functions.getJobAnalysisSummaryForecastingPanel('jobAnalysisProductJobAnalysisSummaryForecastPanelId', streamName, jobName);
//								//					
//								//					PubMatic.JobAnalysisProduct.Functions.getJobAnalysisRuntimeProfileHeatmapPanel('jobAnalysisProductJobAnalysisRuntimeHeatmapPanelId', streamName, jobName);
//								//					PubMatic.JobAnalysisProduct.Functions.getJobAnalysisRuntimeProfileHistogramPanel('jobAnalysisProductJobAnalysisRuntimeHistogramPanelId', streamName, jobName);
//								//					PubMatic.JobAnalysisProduct.Functions.getJobAnalysisRuntimeProfileTimeseriesPanel('jobAnalysisProductJobAnalysisRuntimeTimeseriesPanelId', streamName, jobName);
//								//					PubMatic.JobAnalysisProduct.Functions.getJobAnalysisSLAAnalysisGraphPanel('jobAnalysisProductJobAnalysisSLAPanelId', streamName, jobName);
//								//					PubMatic.JobAnalysisProduct.Functions.getJobAnalysisCoOccurrenceAnalysisGraphPanel('jobAnalysisProductJobAnalysisCoOccurrenceSignaturePanelId', streamName, jobName);
//												});
												
												return jobNameCombo;
											}
										});
									});
								});
							});
						});
					});
				});
			});
		});
		
	});
}