
PubMatic.JobAnalysisProduct.Functions.getJobAnalysisForecastingAnalysisTimeseriesPanel = function(panelId, jobForecastSummaryDashboardData, jobForecastingAnalysisTimeseriesDashboardData) {
	
	var element = "#" + panelId + "-body";
	
	var runTimeData = [];
	var forecastingData = [];
	var runTimeNormalizedData = [];
	var forecastingNormalizedData = [];
	
	var margin, width, height, xScale, yScale, xAxis, yAxis, svg, parseDate, runtimeLine, forecastedLine, runtimeNormalizedLine, forecastedNormalizedLine, legendGroup;

	margin = {top: 70, right: 30, bottom: 100, left: 90};
	
	width = Number(d3.select(element).style("width").replace(/px$/, "")) - margin.left - margin.right;
	height = Number(d3.select(element).style("height").replace(/px$/, "")) - margin.top - margin.bottom;
	
	parseDate = d3.time.format(PubMatic.JobAnalysisProduct.Constants.TimestampFormat).parse;

	xScale = d3.time.scale().range([0, width]);
	yScale = d3.scale.linear().range([height, 0]);
	
	xAxis = d3.svg.axis()
	    .scale(xScale)
	    .ticks(10)
	    .orient("bottom");
	
	yAxis = d3.svg.axis()
	    .scale(yScale)
	    .orient("left");
	
	runtimeLine = d3.svg.line()
	    .x(function(d) { return xScale(d.timeStamp); })
	    .y(function(d) { return yScale(d.runTime); });
	
	forecastedLine = d3.svg.line()
	    .x(function(d) { return xScale(d.timeStamp); })
	    .y(function(d) { return yScale(d.runTime); });
	
	runtimeNormalizedLine = d3.svg.line()
	    .x(function(d) { return xScale(d.timeStamp); })
	    .y(function(d) { return yScale(d.normalizedRuntime); });
	
	forecastedNormalizedLine = d3.svg.line()
	    .x(function(d) { return xScale(d.timeStamp); })
	    .y(function(d) { return yScale(d.normalizedForecastedRuntime); });
	
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
	      	.call(yAxis)
		      	.append("text")
		      	.attr("transform", "rotate(-90)")
		      	.attr("x", -height/3)
		      	.attr("y", -65)
		      	.attr("dy", ".71em")
		      	.style("text-anchor", "end")
		      	.style("font", "Calibri")
		      	.style("font-weight", "bold")
		      	.style("font-size", "14px")
		      	.attr("fill", "black")
				.attr("opacity", 0.8)
			    .attr("text-anchor", "middle")
		      	.text("Run-Time (Secs)");
		
		legendGroup = svg.append('g').attr('transform', "translate(100, " + (height+margin.top-20) + ")");
		
		legendGroup.append('line')
			.attr('x1', 0)
			.attr('y1', 2)
			.attr('x2', 30)
			.attr('y2', 2)
			.style('stroke', 'black')
			.style('stroke-width', '4px')
			.style('stroke-opacity', 0.8);
		
		legendGroup.append('text')
			.text('Runtime')
			.style("font", "Calibri")
	      	.style("font-weight", "bold")
	      	.style("font-size", "12px")
			.attr('x', 40)
			.attr('y', 4)
			.style('fill', 'black')
			.style('opacity', 0.8);
		
		legendGroup.append('line')
			.attr('x1', 0)
			.attr('y1', 17)
			.attr('x2', 30)
			.attr('y2', 17)
			.style('stroke', '#5E4FA2')
			.style('stroke-width', '4px');
		
		legendGroup.append('text')
			.text('Runtime Trend')
			.style("font", "Calibri")
	      	.style("font-weight", "bold")
	      	.style("font-size", "12px")
			.attr('x', 40)
			.attr('y', 19)
			.style('fill', '#5E4FA2');
		
		legendGroup.append('line')
			.attr('x1', 250)
			.attr('y1', 2)
			.attr('x2', 280)
			.attr('y2', 2)
			.style('stroke', '#94AE0A')
			.style('stroke-width', '4px');
		
		legendGroup.append('text')
			.text('Forecasted Runtime')
			.style("font", "Calibri")
	      	.style("font-weight", "bold")
	      	.style("font-size", "12px")
			.attr('x', 290)
			.attr('y', 4)
			.style('fill', '#94AE0A');
		
		legendGroup.append('line')
			.attr('x1', 250)
			.attr('y1', 17)
			.attr('x2', 280)
			.attr('y2', 17)
			.style('stroke', '#9E0142')
			.style('stroke-width', '4px');
		
		legendGroup.append('text')
			.text('Forecasted Runtime Trend')
			.style("font", "Calibri")
	      	.style("font-weight", "bold")
	      	.style("font-size", "12px")
			.attr('x', 290)
			.attr('y', 19)
			.style('fill', '#9E0142');
		
		svg.append('text')
			.attr('id', 'weekAfterForecastId')
			.attr('x', 0)
			.attr('y', -20)
			.style("font", "Calibri")
	      	.style("font-weight", "bold")
	      	.style("font-size", "12px")
	      	.attr("fill", "blue")
			.attr("opacity", 0.8)
			.text('');
		
		svg.append('text')
			.attr('id', 'monthAfterForecastId')
			.attr('x', 350)
			.attr('y', -20)
			.style("font", "Calibri")
	      	.style("font-weight", "bold")
	      	.style("font-size", "12px")
	      	.attr("fill", "blue")
			.attr("opacity", 0.8)
			.text('');
		
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
		
		svg.append("path")
	      	.datum(runTimeNormalizedData)
	      	.attr("class", "runtimeNormalizedLine")
	      	.attr("d", runtimeNormalizedLine)
		    .style({"fill": "none", "stroke": "#5E4FA2","stroke-width": "2px"});
		
		svg.append("path")
	      	.datum(forecastingNormalizedData)
	      	.attr("class", "forecastedNormalizedLine")
	      	.attr("d", forecastedNormalizedLine)
		    .style({"fill": "none", "stroke": "#9E0142","stroke-width": "2px"});
		
		svg.append('line')
			.attr('id', 'weekAfterForecastLineId')
			.attr('x1', 0)
			.attr('y1', 0)
			.attr('x2', 0)
			.attr('y2', 0)
			.style({"fill": "none", "stroke": "blue","stroke-width": "2px", "opacity" : "0.8"});
		
		svg.append('line')
			.attr('id', 'monthAfterForecastLineId')
			.attr('x1', 0)
			.attr('y1', 0)
			.attr('x2', 0)
			.attr('y2', 0)
			.style({"fill": "none", "stroke": "blue","stroke-width": "2px", "opacity" : "0.8"});
		
	}  else {
		svg = d3.select(element).select("svg").select('g');
		
		var maxRuntime = 0;
		runTimeData = jobForecastSummaryDashboardData.runTimeData;
		forecastingData = jobForecastSummaryDashboardData.forecastingData;
		runTimeNormalizedData = jobForecastingAnalysisTimeseriesDashboardData.runTimeNormalizedData;
		forecastingNormalizedData = jobForecastingAnalysisTimeseriesDashboardData.forecastingNormalizedData;
		
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
		var runTimeNormalizedMax = d3.max(runTimeNormalizedData, function(d) { return d.normalizedRuntime;});
		var forcastNormalizedMax = d3.max(forecastingNormalizedData, function(d) { return d.normalizedForecastedRuntime;});
		var forcastMin = d3.min(forecastingData, function(d) { return d.runTime;}); 
		var forcastNormalizedMin = d3.min(forecastingNormalizedData, function(d) { return d.normalizedForecastedRuntime;});
		var weekAfterForecast = jobForecastingAnalysisTimeseriesDashboardData.weekAfterForecast;
		var monthAfterForecast = jobForecastingAnalysisTimeseriesDashboardData.monthAfterForecast;
		
		if(forecastingData.length != 0) {
			maxRuntime = d3.max([runTimeMax, forcastMax, runTimeNormalizedMax, forcastNormalizedMax], function(d) { return d; });
		} else {
			maxRuntime = d3.max([runTimeMax, runTimeNormalizedMax], function(d) { return d; });
		}
		
		if(forcastMin < 0 || forcastNormalizedMin < 0) {
			if(forcastMin < forcastNormalizedMin) {
				yScale.domain([forcastMin, maxRuntime]);
			} else {
				yScale.domain([forcastNormalizedMin, maxRuntime]);
			}
		} else {
			yScale.domain([0, maxRuntime]);
		}
		
		svg.select(".y.axis")
			.transition()
			.duration(1000)
			.call(yAxis);
		
		svg.select('#weekAfterForecastLineId')
			.transition()
			.attr('x1', xScale(weekAfterForecast.timeStamp))
			.attr('y1', 0)
			.attr('x2', xScale(weekAfterForecast.timeStamp))
			.attr('y2', height);
		
		svg.select('#weekAfterForecastId')
			.transition()
			.attr('x', xScale(weekAfterForecast.timeStamp) - 100)
			.attr('y', -5)
			.text('Week: ' + weekAfterForecast.value + " sec");
		
		svg.select('#monthAfterForecastLineId')
			.transition()
			.attr('x1', xScale(monthAfterForecast.timeStamp))
			.attr('y1', 0)
			.attr('x2', xScale(monthAfterForecast.timeStamp))
			.attr('y2', height);
		
		svg.select('#monthAfterForecastId')
			.transition()
			.attr('x', xScale(monthAfterForecast.timeStamp) - 100)
			.attr('y', -5)
			.text('Month: ' + monthAfterForecast.value + " sec");
		
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
		
		svg.select('.runtimeNormalizedLine')
			.datum(runTimeNormalizedData)
	      	.transition()
	      	.duration(500)
	      		.attr('d', runtimeNormalizedLine);
		
		svg.select('.forecastedNormalizedLine')
			.datum(forecastingNormalizedData)
	      	.transition()
	      	.duration(500)
	      		.attr('d', forecastedNormalizedLine);
	
	}
};