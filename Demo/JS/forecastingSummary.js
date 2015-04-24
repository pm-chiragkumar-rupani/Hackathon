
PubMatic.JobAnalysisProduct.Functions.getJobAnalysisSummaryForecastingPanel = function(panelId, jobForecastSummaryDashboardData) {
	
	var element = "#" + panelId + "-body";
	
	var runTimeData = [];
	var forecastingData = [];
	var margin, width, height, xScale, yScale, xAxis, yAxis, svg, parseDate, runtimeLine, forecastedLine;
	
	margin = {top: 10, right: 10, bottom: 20, left: 45};
	
	width = Number(d3.select(element).style("width").replace(/px$/, "")) - margin.left - margin.right;
	height = Number(d3.select(element).style("height").replace(/px$/, "")) - margin.top - margin.bottom;
	
	parseDate = d3.time.format(PubMatic.JobAnalysisProduct.Constants.TimestampFormat).parse;

	xScale = d3.time.scale().range([0, width]);
	yScale = d3.scale.linear().range([height, 0]);
	
	xAxis = d3.svg.axis()
	    .scale(xScale)
	    .ticks(5)
	    .orient("bottom");
	
	yAxis = d3.svg.axis()
	    .scale(yScale)
	    .ticks(5)
	    .orient("left");
	
	runtimeLine = d3.svg.line()
	    .x(function(d) { return xScale(d.timeStamp); })
	    .y(function(d) { return yScale(d.runTime); });
	
	forecastedLine = d3.svg.line()
	    .x(function(d) { return xScale(d.timeStamp); })
	    .y(function(d) { return yScale(d.runTime); });
	
	if(jobForecastSummaryDashboardData === '') {
		
		svg = d3.select(element).append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		svg.append("g")
	      	.attr("class", "x axis")
	      	.attr("transform", "translate(0," + height + ")")
	      	.call(xAxis);

		svg.append("g")
	      	.attr("class", "y axis")
	      	.call(yAxis);
		
		svg.append("path")
	      	.datum(runTimeData)
	      	.attr("class", "runtimeLine")
	      	.attr("d", runtimeLine)
		    .style({"fill": "none", "stroke": "black","stroke-width": "2px", "stroke-opacity": "0.8"});
		
		svg.append("path")
	      	.datum(forecastingData)
	      	.attr("class", "forecastingLine")
	      	.attr("d", forecastedLine)
		    .style({"fill": "none", "stroke": "#94AE0A","stroke-width": "2px"});
		
	}  else {
		svg = d3.select(element).select("svg").select('g');
		
		var maxRuntime = 0;
		runTimeData = jobForecastSummaryDashboardData.runTimeData;
		forecastingData = jobForecastSummaryDashboardData.forecastingData;
		
		if(forecastingData.length != 0) {
			xScale.domain([d3.min(runTimeData, function(d) { return d.timeStamp; }), d3.max(forecastingData, function(d) { return d.timeStamp; })]);
		} else {
			xScale.domain(d3.extent(runTimeData, function(d) { return d.timeStamp; }));
		}
		
		svg.select(".x.axis")
			.transition()
			.duration(1000)
			.call(xAxis);
		
		var runTimeMax = d3.max(runTimeData, function(d) { return d.runTime;});
		var forcastMax = d3.max(forecastingData, function(d) { return d.runTime;});
		var forcastMin = d3.min(forecastingData, function(d) { return d.runTime;});
		
		if(forecastingData.length != 0) {
			maxRuntime = runTimeMax > forcastMax ? runTimeMax : forcastMax;
		} else {
			maxRuntime = runTimeMax;
		}
		
		if(forcastMin < 0) {
			yScale.domain([forcastMin, maxRuntime]);
		} else {
			yScale.domain([0, maxRuntime]);
		}
		svg.select(".y.axis")
			.transition()
			.duration(1000)
			.call(yAxis);
		
		svg.select('.runtimeLine')
			.datum(runTimeData)
	      	.transition()
	      	.duration(500)
	      		.attr('d', runtimeLine);
		
		svg.select('.forecastingLine')
			.datum(forecastingData)
	      	.transition()
	      	.duration(500)
	      		.attr('d', forecastedLine);
	
	}
};