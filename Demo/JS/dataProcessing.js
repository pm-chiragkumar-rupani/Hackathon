
PubMatic.JobAnalysisProduct.Functions.generateJobAnalysisDashboardDataAndPopulate = function(panelId, rawData, analogClockStart, analogClockEnd, streamName, jobName) {
	
//	var processDataMask = new Ext.LoadMask(Ext.getCmp(panelId), {msg:"Generating Dashboard..."});
//	processDataMask.show();
								
	var jobThresholdData = rawData.jobThresholdData;
	var jobStatsData = rawData.jobStatsData;
	var cooccurrenceData = rawData.cooccurrenceData;
	var runData = rawData.runData;
	var forecastData = rawData.forecastData;
	var jobHeatmapData = rawData.jobHeatmapData;
	var jobHistogramData = rawData.jobHistogramData;
	var jobDependencyData = rawData.jobDependencyData;

	var parseDate = d3.time.format(PubMatic.JobAnalysisProduct.Constants.TimestampFormat).parse;
	
	// Data processing block for Threshold Summary Column Chart.
	var jobThresholdMetricBehaviorDashboardData = {};
	var jobThresholdUserBehaviorDashboardData = {};
	var maxThreshold = 0;
	var metricBehaviorDataset = [];
	var userBehaviorDataset = [];
	jobThresholdData.forEach(function(eachData) {
		if(eachData.streamName.toLowerCase() == streamName.toLowerCase() && eachData.jobName.toLowerCase() == jobName.toLowerCase()) {
			var eachThresholdValue = eachData.thresholdValue.replace("metricBehavior:", "\"metricBehavior\":\"").replace(",userBehavior:", "\",\"userBehavior\":\"").replace(",startSLA:", "\",\"startSLA\":\"").replace(",endSLA:", "\",\"endSLA\":\"").replace("}", "\"}");
			var eachThresholdValueJson = JSON.parse(eachThresholdValue);
			
			if(Number(eachThresholdValueJson.metricBehavior) > maxThreshold) {
				maxThreshold = Number(eachThresholdValueJson.metricBehavior);
			}
			if(Number(eachThresholdValueJson.userBehavior) > maxThreshold) {
				maxThreshold = Number(eachThresholdValueJson.userBehavior);
			}
			
			var metricBehavior = {};
			var scheduleName = ' ';
			if(eachData.scheduleName !== PubMatic.JobAnalysisProduct.Constants.FullDataSchedule) {
				if(eachData.scheduleName === PubMatic.JobAnalysisProduct.Constants.WeekdaySchedule) {
					scheduleName = 'WD';
				} else if(eachData.scheduleName === PubMatic.JobAnalysisProduct.Constants.WeekendSchedule) {
					scheduleName = 'WE';
				} else if(eachData.scheduleName === PubMatic.JobAnalysisProduct.Constants.DaytimeSchedule) {
					scheduleName = 'D';
				} else if(eachData.scheduleName === PubMatic.JobAnalysisProduct.Constants.NighttimeSchedule) {
					scheduleName = 'N';
				}
			}
			metricBehavior.schedule = scheduleName;
			metricBehavior.threshold = Math.round(Number(eachThresholdValueJson.metricBehavior)*100)/100;
			metricBehaviorDataset.push(metricBehavior);
			
			var userBehavior = {};
			userBehavior.schedule = scheduleName;
			userBehavior.threshold = Math.round(Number(eachThresholdValueJson.userBehavior)*100)/100;
			userBehaviorDataset.push(userBehavior);
		}
	});
	
	jobThresholdMetricBehaviorDashboardData.maxThreshold = maxThreshold;
	jobThresholdMetricBehaviorDashboardData.dataset = metricBehaviorDataset;
	jobThresholdUserBehaviorDashboardData.maxThreshold = maxThreshold;
	jobThresholdUserBehaviorDashboardData.dataset = userBehaviorDataset;
	
	PubMatic.JobAnalysisProduct.Functions.getJobAnalysisSummaryThresholdPanel('jobAnalysisProductJobAnalysisSummaryMetricThresholdsPanelId', 'metricBehavior', jobThresholdMetricBehaviorDashboardData);
	PubMatic.JobAnalysisProduct.Functions.getJobAnalysisSummaryThresholdPanel('jobAnalysisProductJobAnalysisSummaryUserThresholdsPanelId', 'userBehavior', jobThresholdUserBehaviorDashboardData);
	
	// Data processing block for SLA Summary Clocks.
	var jobStartSLASummaryDashboardData = {};
	var jobEndSLASummaryDashboardData = {};
	var startSLA;
	var endSLA;
	jobStatsData.forEach(function(eachData) {
		if(eachData.streamName.toLowerCase() === streamName.toLowerCase() && eachData.jobName.toLowerCase() === jobName.toLowerCase()) {
			startSLA = eachData.startSLA;
			endSLA = eachData.endSLA;
		}
	});
	
	jobStartSLASummaryDashboardData.currentTime = startSLA;
	jobEndSLASummaryDashboardData.currentTime = endSLA;
	
	PubMatic.JobAnalysisProduct.Functions.getJobAnalysisSummarySLAPanel('jobAnalysisProductJobAnalysisSummarySLAStartPanelId', analogClockStart, 'Start', jobStartSLASummaryDashboardData);
	PubMatic.JobAnalysisProduct.Functions.getJobAnalysisSummarySLAPanel('jobAnalysisProductJobAnalysisSummarySLAEndPanelId', analogClockEnd, 'End', jobEndSLASummaryDashboardData);
	
	// Data processing block for Co-Occurrence Summary bubble chart.
	var jobCoOccurrenceSummaryDashboardData = {};
	var allJobs = [];
	var allCooccurringJobs = [];
	dataset = [];
	
	cooccurrenceData.forEach(function(eachJob) {
		if(eachJob.streamName.toLowerCase() == streamName.toLowerCase() && eachJob.jobName.toLowerCase() == jobName.toLowerCase()) {
			var temp = {};
			temp.jobName = eachJob.coOccurringJob;
			temp.similarityCoefficient = Number(eachJob.similarityCoefficient);
			allCooccurringJobs.push(temp);
		}
	});
	
	if(allCooccurringJobs.length != 0) {
		allCooccurringJobs.sort(function(a,b) { return d3.descending(a.similarityCoefficient, b.similarityCoefficient); });
		
		if(allCooccurringJobs.length > 3) {
			for(var index=0; index<3; index++) {
				allJobs.push(allCooccurringJobs[index].jobName.toLowerCase());
			}
		} else {
			for(var index=0; index<allCooccurringJobs.length; index++) {
				allJobs.push(allCooccurringJobs[index].jobName.toLowerCase());
			}
		}
	}
	
	runData.forEach(function(eachData) {
		if(eachData.streamName.toLowerCase() == streamName.toLowerCase() && allJobs.contains(eachData.jobName.toLowerCase())) {
			var temp = {};
			temp.jobName = eachData.jobName;
			temp.timeStamp = parseDate(eachData.startTime);
			temp.alertGenerating = eachData.alertStatus.toLowerCase();
			dataset.push(temp);
		}
	});
	
	runData.forEach(function(eachData) {
		if(eachData.streamName.toLowerCase() == streamName.toLowerCase() && eachData.jobName.toLowerCase() === jobName.toLowerCase()) {
			var temp = {};
			temp.jobName = eachData.jobName;
			temp.timeStamp = parseDate(eachData.startTime);
			temp.alertGenerating = eachData.alertStatus.toLowerCase();
			dataset.push(temp);
		}
	});
	
	jobCoOccurrenceSummaryDashboardData.dataset = dataset;
	jobCoOccurrenceSummaryDashboardData.numberOfCoOccurringJobs = allCooccurringJobs.length;
	
	PubMatic.JobAnalysisProduct.Functions.getJobAnalysisSummaryCooccurrencePanel('jobAnalysisProductJobAnalysisSummaryCoOccurrencePanelId', jobName, jobCoOccurrenceSummaryDashboardData);
	
	// Data processing block for Forecast Summary line Chart.
	var jobForecastSummaryDashboardData = {};
	var runTimeData = [];
	var forecastingData = [];
	runData.forEach(function(eachData) {
		if(eachData.streamName.toLowerCase() == streamName.toLowerCase() && eachData.jobName.toLowerCase() == jobName.toLowerCase()) {
			var timeseriesData = {};
			timeseriesData.timeStamp = parseDate(eachData.startTime);
			timeseriesData.runTime = Number(eachData.runTime);
			runTimeData.push(timeseriesData);
		}
	});
	
	forecastData.forEach(function(eachData) {
		if(eachData.streamName.toLowerCase() == streamName.toLowerCase() && eachData.jobName.toLowerCase() == jobName.toLowerCase()) {
			var timeseriesData = {};
			timeseriesData.timeStamp = parseDate(eachData.startTime);
			timeseriesData.runTime = Number(eachData.forecastedRuntime);
			forecastingData.push(timeseriesData);
		}
	});
	
	runTimeData.sort(function(a,b){ return d3.ascending(a.timeStamp, b.timeStamp); });
	forecastingData.sort(function(a,b){ return d3.ascending(a.timeStamp, b.timeStamp); });
	
	jobForecastSummaryDashboardData.runTimeData = runTimeData;
	jobForecastSummaryDashboardData.forecastingData = forecastingData;
	
	PubMatic.JobAnalysisProduct.Functions.getJobAnalysisSummaryForecastingPanel('jobAnalysisProductJobAnalysisSummaryForecastPanelId', jobForecastSummaryDashboardData);
	
	// Data processing block for Runtime profiling heatmap and historgram.
	var jobRuntimeProfileHeatmapDashboardData = {};
	var jobRuntimeProfileHistogramDashboardData = {};
	var maxValue = 0;

	dataset = [];
	jobHeatmapData.forEach(function(eachData) {
		if(eachData.streamName.toLowerCase() == streamName.toLowerCase() && eachData.jobName.toLowerCase() == jobName.toLowerCase()) {
			var temp = {};
			temp.dayOfWeek = Number(eachData.dayOfWeek);
			temp.hourOfDay = Number(eachData.hourOfDay);
			temp.avgRunTime = Number(eachData.avgRunTime);
			dataset.push(temp);
		}
	});
	
	maxValue = d3.max(dataset, function (d) { return d.avgRunTime; });
	
	jobRuntimeProfileHeatmapDashboardData.dataset = dataset;
	
	dataset = [];
	jobHistogramData.forEach(function(eachData) {
		if(eachData.streamName.toLowerCase() == streamName.toLowerCase() && eachData.jobName.toLowerCase() == jobName.toLowerCase()) {
			var temp = {};
			temp.value = Number(eachData.runtimeRangeValue);
			temp.frequency = Number(eachData.frequency);
			dataset.push(temp);
		}
	});
	
	if(maxValue < d3.max(dataset, function (d) { return d.avgRunTime; })) {
		maxValue = d3.max(dataset, function (d) { return d.avgRunTime; });
	}
	jobRuntimeProfileHistogramDashboardData.dataset = dataset;
	
	jobRuntimeProfileHeatmapDashboardData.maxValue = maxValue;
	jobRuntimeProfileHistogramDashboardData.maxValue = maxValue;
	
	PubMatic.JobAnalysisProduct.Functions.getJobAnalysisRuntimeProfileHeatmapPanel('jobAnalysisProductJobAnalysisRuntimeHeatmapPanelId', jobRuntimeProfileHeatmapDashboardData);
	PubMatic.JobAnalysisProduct.Functions.getJobAnalysisRuntimeProfileHistogramPanel('jobAnalysisProductJobAnalysisRuntimeHistogramPanelId', jobRuntimeProfileHistogramDashboardData);
	
	// Data processing block for runtime profiling timeseries.
	var jobRuntimeProfileTimeseriesDashboardData = {};
	var allRuns = [];
	var threhsoldMappedRuns = [];
	maxThreshold = 0;
	var metricBehaviourThresholdText = ' (';
	var userBehaviourThresholdText = ' (';
	
	runData.forEach(function(eachData) {
		if(eachData.streamName.toLowerCase() == streamName.toLowerCase() && eachData.jobName.toLowerCase() == jobName.toLowerCase()) {
			allRuns.push(eachData);
		}
	});
	
	jobThresholdData.forEach(function(eachThreshold) {
		if(eachThreshold.streamName.toLowerCase() == streamName.toLowerCase() && eachThreshold.jobName.toLowerCase() == jobName.toLowerCase()) {
			if(maxThreshold != 0) {
				metricBehaviourThresholdText = metricBehaviourThresholdText + ', ';
				userBehaviourThresholdText = userBehaviourThresholdText  + ', ';
			}
			var eachThresholdValue = eachThreshold.thresholdValue.replace("metricBehavior:", "\"metricBehavior\":\"").replace(",userBehavior:", "\",\"userBehavior\":\"").replace(",startSLA:", "\",\"startSLA\":\"").replace(",endSLA:", "\",\"endSLA\":\"").replace("}", "\"}");
			var eachThresholdValueJson = JSON.parse(eachThresholdValue);
			
			if(Number(eachThresholdValueJson.metricBehavior) > maxThreshold) {
				maxThreshold = Number(eachThresholdValueJson.metricBehavior);
			}
			if(Number(eachThresholdValueJson.userBehavior) > maxThreshold) {
				maxThreshold = Number(eachThresholdValueJson.userBehavior);
			}
			
			if(eachThresholdValueJson.metricBehavior == 'NA') {
				if(eachThreshold.scheduleName === PubMatic.JobAnalysisProduct.Constants.FullDataSchedule) {
					metricBehaviourThresholdText += eachThresholdValueJson.metricBehavior;
				} else {
					var scheduleName = '';
					if(eachThreshold.scheduleName === PubMatic.JobAnalysisProduct.Constants.WeekdaySchedule) {
						scheduleName = 'WD';
					} else if(eachThreshold.scheduleName === PubMatic.JobAnalysisProduct.Constants.WeekendSchedule) {
						scheduleName = 'WE';
					} else if(eachThreshold.scheduleName === PubMatic.JobAnalysisProduct.Constants.DaytimeSchedule) {
						scheduleName = 'D';
					} else if(eachThreshold.scheduleName === PubMatic.JobAnalysisProduct.Constants.NighttimeSchedule) {
						scheduleName = 'N';
					}
					metricBehaviourThresholdText += scheduleName + ': ' + eachThresholdValueJson.metricBehavior;
				}
			} else {
				if(eachThreshold.scheduleName === PubMatic.JobAnalysisProduct.Constants.FullDataSchedule) {
					metricBehaviourThresholdText += Math.round(Number(eachThresholdValueJson.metricBehavior)*100)/100 + ' sec';
				} else {
					var scheduleName = '';
					if(eachThreshold.scheduleName === PubMatic.JobAnalysisProduct.Constants.WeekdaySchedule) {
						scheduleName = 'WD';
					} else if(eachThreshold.scheduleName === PubMatic.JobAnalysisProduct.Constants.WeekendSchedule) {
						scheduleName = 'WE';
					} else if(eachThreshold.scheduleName === PubMatic.JobAnalysisProduct.Constants.DaytimeSchedule) {
						scheduleName = 'D';
					} else if(eachThreshold.scheduleName === PubMatic.JobAnalysisProduct.Constants.NighttimeSchedule) {
						scheduleName = 'N';
					}
					metricBehaviourThresholdText += scheduleName + ': ' + Math.round(Number(eachThresholdValueJson.metricBehavior)*100)/100 + ' sec';
				}
			}
			
			if(eachThresholdValueJson.userBehavior == 'NA') {
				if(eachThreshold.scheduleName === PubMatic.JobAnalysisProduct.Constants.FullDataSchedule) {
					userBehaviourThresholdText += eachThresholdValueJson.userBehavior;
				} else {
					var scheduleName = '';
					if(eachThreshold.scheduleName === PubMatic.JobAnalysisProduct.Constants.WeekdaySchedule) {
						scheduleName = 'WD';
					} else if(eachThreshold.scheduleName === PubMatic.JobAnalysisProduct.Constants.WeekendSchedule) {
						scheduleName = 'WE';
					} else if(eachThreshold.scheduleName === PubMatic.JobAnalysisProduct.Constants.DaytimeSchedule) {
						scheduleName = 'D';
					} else if(eachThreshold.scheduleName === PubMatic.JobAnalysisProduct.Constants.NighttimeSchedule) {
						scheduleName = 'N';
					}
					userBehaviourThresholdText += scheduleName + ': ' + eachThresholdValueJson.userBehavior;
				}
			} else {
				if(eachThreshold.scheduleName === PubMatic.JobAnalysisProduct.Constants.FullDataSchedule) {
					userBehaviourThresholdText += Math.round(Number(eachThresholdValueJson.userBehavior)*100)/100 + ' sec';
				} else {
					var scheduleName = '';
					if(eachThreshold.scheduleName === PubMatic.JobAnalysisProduct.Constants.WeekdaySchedule) {
						scheduleName = 'WD';
					} else if(eachThreshold.scheduleName === PubMatic.JobAnalysisProduct.Constants.WeekendSchedule) {
						scheduleName = 'WE';
					} else if(eachThreshold.scheduleName === PubMatic.JobAnalysisProduct.Constants.DaytimeSchedule) {
						scheduleName = 'D';
					} else if(eachThreshold.scheduleName === PubMatic.JobAnalysisProduct.Constants.NighttimeSchedule) {
						scheduleName = 'N';
					}
					userBehaviourThresholdText += scheduleName + ': ' + Math.round(Number(eachThresholdValueJson.userBehavior)*100)/100 + ' sec';
				}
			}
			
			allRuns.forEach(function(eachData) {
				var timeseriesData = {};
				var metricBehaviorThreshold, userBehaviorThreshold;
				
				timeseriesData.timeStamp = parseDate(eachData.startTime);
				timeseriesData.runTime = Number(eachData.runTime);
				timeseriesData.alertGenerating = eachData.alertStatus.toLowerCase();
				timeseriesData.ticketGenerating = eachData.ticketStatus.toLowerCase();
				
				if(Number(eachData.runTime) > maxThreshold) {
					maxThreshold = Number(eachData.runTime);
				}
				if(eachThresholdValueJson.metricBehavior === 'NA') {
					metricBehaviorThreshold = null;
				} else {
					metricBehaviorThreshold = Number(eachThresholdValueJson.metricBehavior);
				}
				if(eachThresholdValueJson.userBehavior === 'NA') {
					userBehaviorThreshold = null;
				} else {
					userBehaviorThreshold = Number(eachThresholdValueJson.userBehavior);
				}
				
				var dayOfWeek = timeseriesData.timeStamp.getDay();
				var hourOfDay = timeseriesData.timeStamp.getHours();
				
				if((eachThreshold.scheduleName === PubMatic.JobAnalysisProduct.Constants.WeekdaySchedule) && (dayOfWeek != 0 && dayOfWeek != 6)) {
					timeseriesData.metricBehavior = metricBehaviorThreshold;
					timeseriesData.userBehavior = userBehaviorThreshold;
					threhsoldMappedRuns.push(timeseriesData);
				} else if((eachThreshold.scheduleName === PubMatic.JobAnalysisProduct.Constants.WeekendSchedule) && (dayOfWeek == 0 || dayOfWeek == 6)) {
					timeseriesData.metricBehavior = metricBehaviorThreshold;
					timeseriesData.userBehavior = userBehaviorThreshold;
					threhsoldMappedRuns.push(timeseriesData);
				} else if((eachThreshold.scheduleName === PubMatic.JobAnalysisProduct.Constants.DaytimeSchedule) && (hourOfDay >= 8 && hourOfDay < 20)) {
					timeseriesData.metricBehavior = metricBehaviorThreshold;
					timeseriesData.userBehavior = userBehaviorThreshold;
					threhsoldMappedRuns.push(timeseriesData);
				} else if((eachThreshold.scheduleName === PubMatic.JobAnalysisProduct.Constants.NighttimeSchedule) && (hourOfDay < 8 || hourOfDay >= 20)) {
					timeseriesData.metricBehavior = metricBehaviorThreshold;
					timeseriesData.userBehavior = userBehaviorThreshold;
					threhsoldMappedRuns.push(timeseriesData);
				} else if(eachThreshold.scheduleName === PubMatic.JobAnalysisProduct.Constants.FullDataSchedule) {
					timeseriesData.metricBehavior = metricBehaviorThreshold;
					timeseriesData.userBehavior = userBehaviorThreshold;
					threhsoldMappedRuns.push(timeseriesData);
				}
			});
		}
	});
	
	metricBehaviourThresholdText += ')';
	userBehaviourThresholdText += ')';
	
	jobRuntimeProfileTimeseriesDashboardData.maxThreshold = maxThreshold;
	jobRuntimeProfileTimeseriesDashboardData.threhsoldMappedRuns = threhsoldMappedRuns;
	jobRuntimeProfileTimeseriesDashboardData.metricBehaviourThresholdText = metricBehaviourThresholdText;
	jobRuntimeProfileTimeseriesDashboardData.userBehaviourThresholdText = userBehaviourThresholdText;
	
	PubMatic.JobAnalysisProduct.Functions.getJobAnalysisRuntimeProfileTimeseriesPanel('jobAnalysisProductJobAnalysisRuntimeTimeseriesPanelId', jobRuntimeProfileTimeseriesDashboardData);
	
	// Data processing block for SLA analysis and Co-Occurrence analysis graph.
	var jobCoOccurrenceAndSLAAnalysisGraphDashboardData = {};
	var nodes = {};
	var newLinks = [];
	var nodeCount = 1;
	var downstreamCount = 0;
	
	jobDependencyData.forEach(function(eachData) {
//			if(eachData.streamName.toLowerCase() === streamName.toLowerCase()) {
			if(eachData.jobName.toLowerCase() === jobName.toLowerCase()) {
				var downstreamLinks = eachData.downstreamEdges.split(", ");
				downstreamLinks.forEach(function(eachDownstreamLinkString) {
					if(eachDownstreamLinkString !== "") {
						var newLink = {};
						eachDownstreamLinkString = eachDownstreamLinkString.replace("s:", "\"s\":\"").replace(",d:", "\",\"d\":\"").replace("}", "\"}");
						var eachDownstreamLink = JSON.parse(eachDownstreamLinkString);
						newLink.source = nodes[eachDownstreamLink.s] || 
					        (nodes[eachDownstreamLink.s] = {id: nodeCount++, name: eachDownstreamLink.s});
						newLink.target = nodes[eachDownstreamLink.d] || 
					        (nodes[eachDownstreamLink.d] = {id: nodeCount++, name: eachDownstreamLink.d});
						newLinks.push(newLink);
						downstreamCount += 1;
					}
				});
			}
//			}
	});
	
	d3.values(nodes).forEach(function(eachNode) {
		eachNode.isItCoOccurring = false;
		cooccurrenceData.forEach(function(eachJob) {
			if(jobName.toLowerCase() === eachJob.jobName.toLowerCase() && eachNode.name.toLowerCase() === eachJob.coOccurringJob.toLowerCase()) {
				eachNode.isItCoOccurring = true;
				eachNode.similarityCoefficient = parseFloat(eachJob.similarityCoefficient);
			}
		});
		
		jobStatsData.forEach(function(eachJob) {
			if(eachNode.name.toLowerCase() === eachJob.jobName.toLowerCase()) {
				eachNode.startSLA = eachJob.startSLA;
				eachNode.endSLA = eachJob.endSLA;
				eachNode.runTime = eachJob.runTime;
				eachNode.isBusinessCritical = eachJob.isBusinessCritical.toLowerCase();
			}
		});
		
		eachNode.depth = getDepthOfNode(eachNode.name, []);
	});
	
	var maxDepth = d3.max(d3.values(nodes), function(d) { return d.depth;});
	
	function getDepthOfNode(targetNode, traversedNodes) {
		var depth = 1;
		if(traversedNodes.contains(targetNode)) {
			return 0;
		} else {
			traversedNodes.push(targetNode);
			for(var linkIndex = 0; linkIndex < newLinks.length; linkIndex++) {
				var eachLink = newLinks[linkIndex];
				if(eachLink.target.name.toLowerCase() === targetNode.toLowerCase()) {
					depth = depth + getDepthOfNode(eachLink.source.name, traversedNodes);
				}
			}
			return depth;
		}
	}
	
	newLinks.forEach(function(eachLink) {
		d3.values(nodes).forEach(function(eachNode) {
			if(eachLink.source.name.toLowerCase() === eachNode.name.toLowerCase()) {
				eachLink.source = eachNode;
			}
			if(eachLink.target.name.toLowerCase() === eachNode.name.toLowerCase()) {
				eachLink.target = eachNode;
			}
		});
	});
	
	jobCoOccurrenceAndSLAAnalysisGraphDashboardData.nodes = d3.values(nodes);
	jobCoOccurrenceAndSLAAnalysisGraphDashboardData.links = newLinks;
	jobCoOccurrenceAndSLAAnalysisGraphDashboardData.maxDepth = maxDepth;
	
	PubMatic.JobAnalysisProduct.Functions.getJobAnalysisSLAAnalysisGraphPanel('jobAnalysisProductJobAnalysisSLAPanelId', jobName, jobCoOccurrenceAndSLAAnalysisGraphDashboardData);
	PubMatic.JobAnalysisProduct.Functions.getJobAnalysisCoOccurrenceAnalysisGraphPanel('jobAnalysisProductJobAnalysisCoOccurrenceSignaturePanelId', streamName, jobName, jobCoOccurrenceAndSLAAnalysisGraphDashboardData, runData);
	
	// Data processing block for Forecasting analysis timeseries.
	var jobForecastingAnalysisTimeseriesDashboardData = {};
	var runTimeNormalizedData = [];
	var forecastingNormalizedData = [];
	var forecastDayCount = 1;
	var weekAfterForecast;
	var monthAfterForecast;
	
	runData.forEach(function(eachData) {
		if(eachData.streamName.toLowerCase() == streamName.toLowerCase() && eachData.jobName.toLowerCase() == jobName.toLowerCase()) {
			var timeseriesData = {};
			timeseriesData.timeStamp = parseDate(eachData.startTime);
			timeseriesData.normalizedRuntime = Number(eachData.normalizedRuntime);
			runTimeNormalizedData.push(timeseriesData);
		}
	});
	
	forecastData.forEach(function(eachData) {
		if(eachData.streamName.toLowerCase() == streamName.toLowerCase() && eachData.jobName.toLowerCase() == jobName.toLowerCase()) {
			
			if(forecastDayCount == 7) {
				weekAfterForecast = {
					timeStamp: parseDate(eachData.startTime),
					value: Math.round(Number(eachData.normalizedForecastedRuntime)*100)/100
				};
			}
			if(forecastDayCount == 30) {
				monthAfterForecast = {
					timeStamp: parseDate(eachData.startTime),
					value: Math.round(Number(eachData.normalizedForecastedRuntime)*100)/100
				};
			}
			
			var timeseriesData = {};
			timeseriesData.timeStamp = parseDate(eachData.startTime);
			timeseriesData.normalizedForecastedRuntime = Number(eachData.normalizedForecastedRuntime);
			forecastingNormalizedData.push(timeseriesData);
			forecastDayCount++;
		}
	});
	
	runTimeNormalizedData.sort(function(a,b){ return d3.ascending(a.timeStamp, b.timeStamp); });
	forecastingNormalizedData.sort(function(a,b){ return d3.ascending(a.timeStamp, b.timeStamp); });
	
	jobForecastingAnalysisTimeseriesDashboardData.runTimeNormalizedData = runTimeNormalizedData;
	jobForecastingAnalysisTimeseriesDashboardData.forecastingNormalizedData = forecastingNormalizedData;
	jobForecastingAnalysisTimeseriesDashboardData.weekAfterForecast = weekAfterForecast;
	jobForecastingAnalysisTimeseriesDashboardData.monthAfterForecast = monthAfterForecast;
	
	PubMatic.JobAnalysisProduct.Functions.getJobAnalysisForecastingAnalysisTimeseriesPanel('jobAnalysisProductJobAnalysisForecastPanelId', jobForecastSummaryDashboardData, jobForecastingAnalysisTimeseriesDashboardData);
							
};