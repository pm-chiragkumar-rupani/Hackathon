
PubMatic.JobAnalysisProduct.Functions.getJobAnalysisSummarySLAPanel = function(panelId, analogClock, clockTitle, jobSLASummaryDashboardData) {
	
	var element = "#" + panelId + "-body";
		
	if(jobSLASummaryDashboardData === '') {
		analogClock.render(element, '00:00:00', clockTitle, 45);
	} else {
		analogClock.update(jobSLASummaryDashboardData.currentTime);
	}
}