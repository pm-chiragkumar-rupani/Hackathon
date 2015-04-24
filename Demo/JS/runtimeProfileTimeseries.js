
PubMatic.JobAnalysisProduct.Functions.getJobAnalysisRuntimeProfileTimeseriesPanel = function(panelId, jobRuntimeProfileTimeseriesDashboardData) {
	
	var element = "#" + panelId + "-body";
			
	var threhsoldMappedRuns = [];
	var margin, width, height, xScale, yScale, xAxis, yAxis, svg, parseDate, metricBehaviorLine, userBehaviorLine, legendGroup;
	
	margin = {top: 50, right: 30, bottom: 40, left: 70};
	
	width = Number(d3.select(element).style("width").replace(/px$/, "")) - margin.left - margin.right;
	height = Number(d3.select(element).style("height").replace(/px$/, "")) - margin.top - margin.bottom;
	
	parseDate = d3.time.format(PubMatic.JobAnalysisProduct.Constants.TimestampFormat).parse;

	xScale = d3.time.scale().range([0, width]);
	yScale = d3.scale.linear().range([height, 0]);
	
	xAxis = d3.svg.axis()
	    .scale(xScale)
	    .orient("bottom");
	
	yAxis = d3.svg.axis()
	    .scale(yScale)
	    .orient("left");
	
	metricBehaviorLine = d3.svg.line()
	    .x(function(d) { return xScale(d.timeStamp); })
	    .y(function(d) { return yScale(d.metricBehavior); });
	
	userBehaviorLine = d3.svg.line()
	    .x(function(d) { return xScale(d.timeStamp); })
	    .y(function(d) { return yScale(d.userBehavior); });
	
	if(jobRuntimeProfileTimeseriesDashboardData === '') {
		
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
		      	.attr("x", -70)
		      	.attr("y", -55)
		      	.attr("dy", ".71em")
		      	.style("text-anchor", "end")
		      	.style("font", "Calibri")
		      	.style("font-weight", "bold")
		      	.style("font-size", "14px")
		      	.attr("fill", "black")
				.attr("opacity", 0.8)
			    .attr("text-anchor", "middle")
		      	.text("Run-Time (Secs)");
		
		svg.append('g').attr('class', 'plotArea');
		
		legendGroup = svg.append('g').attr('id', 'legendGropuId').attr('transform', "translate(" + 20 + ", -35)");
			
		legendGroup.append('circle')
			.attr('cx', 0)
			.attr('cy', 0)
			.attr('r', 4)
			.style('fill', '#9E0142');
		
		legendGroup.append('text')
			.text('Ticket Generating Run')
			.style("font", "Calibri")
	      	.style("font-weight", "bold")
	      	.style("font-size", "12px")
			.attr('x', 10)
			.attr('y', 4)
			.style('fill', '#9E0142');
		
		legendGroup.append('circle')
			.attr('cx', 0)
			.attr('cy', 15)
			.attr('r', 4)
			.style('fill', '#FDAE61');
		
		legendGroup.append('text')
			.text('Alert Generating Run')
			.style("font", "Calibri")
	      	.style("font-weight", "bold")
	      	.style("font-size", "12px")
			.attr('x', 10)
			.attr('y', 19)
			.style('fill', '#FDAE61');
		
		legendGroup.append('line')
			.attr('x1', 200)
			.attr('y1', 2)
			.attr('x2', 230)
			.attr('y2', 2)
			.style('stroke', '#94AE0A')
			.style('stroke-width', '4px');
		
		legendGroup.append('text')
			.text('Metric-Behavior Threshold')
			.attr('id', 'metricBehaviourThresholdText')
			.style("font", "Calibri")
	      	.style("font-weight", "bold")
	      	.style("font-size", "12px")
			.attr('x', 240)
			.attr('y', 4)
			.style('fill', '#94AE0A');
		
		legendGroup.append('line')
			.attr('x1', 200)
			.attr('y1', 17)
			.attr('x2', 230)
			.attr('y2', 17)
			.style('stroke', '#333333')
			.style('stroke-width', '4px');
		
		legendGroup.append('text')
			.text('User-Behavior Threshold')
			.attr('id', 'userBehaviourThresholdTextId')
			.style("font", "Calibri")
	      	.style("font-weight", "bold")
	      	.style("font-size", "12px")
			.attr('x', 240)
			.attr('y', 19)
			.style('fill', '#333333');
		
		svg.append("path")
	      	.datum(threhsoldMappedRuns)
	      	.attr("class", "metricBehaviorLine")
	      	.attr("d", metricBehaviorLine)
		    .style({"fill": "none", "stroke": "#94AE0A","stroke-width": "2px"});
		
		svg.append("path")
	      	.datum(threhsoldMappedRuns)
	      	.attr("class", "userBehaviorLine")
	      	.attr("d", userBehaviorLine)
		    .style({"fill": "none", "stroke": "#333333","stroke-width": "2px"});
		
	} else {
				
		svg = d3.select(element).select("svg").select('g');
		
		var maxThreshold = jobRuntimeProfileTimeseriesDashboardData.maxThreshold;
		threhsoldMappedRuns = jobRuntimeProfileTimeseriesDashboardData.threhsoldMappedRuns;
		var metricBehaviourThresholdText = jobRuntimeProfileTimeseriesDashboardData.metricBehaviourThresholdText;
		var userBehaviourThresholdText = jobRuntimeProfileTimeseriesDashboardData.userBehaviourThresholdText;
		
		legendGroup = svg.select('g #legendGropuId');
		
		legendGroup.select("#metricBehaviourThresholdText").text('Metric-Behavior Threshold' + metricBehaviourThresholdText);
		legendGroup.select("#userBehaviourThresholdTextId").text('User-Behavior Threshold' + userBehaviourThresholdText);
		
		threhsoldMappedRuns.sort(function(a,b){ return d3.ascending(a.timeStamp, b.timeStamp); });
		
		xScale.domain(d3.extent(threhsoldMappedRuns, function(d) { return d.timeStamp; }));
		svg.select(".x.axis")
			.transition()
			.call(xAxis);
		
		yScale.domain([0, maxThreshold]);
		svg.select(".y.axis")
			.transition()
			.call(yAxis);
		
		svg.select('.plotArea').selectAll('circle')
		.data(threhsoldMappedRuns)
		.exit()
			.transition()
			.remove();
		
		svg.select('.plotArea').selectAll('circle')
		.data(threhsoldMappedRuns)
		.enter()
			.append('circle')
			.attr('cx', function(d) {
		    	return width;
		    })
		    .attr('cy', function(d) {
		    	return height;
		    })
		    .attr('r', 4)
		    .style("fill", function(d) {
		    	if(d.alertGenerating === "true" && d.ticketGenerating === "true") {
					return "#9E0142";
				} else if(d.alertGenerating === "true" && d.ticketGenerating === "false") {
					return "#FDAE61";
				} else {
					return "#3288BD";
				}
			})
		    .style("stroke", function(d) {
		    	if(d.alertGenerating === "true" && d.ticketGenerating === "true") {
					return "#9E0142";
				} else if(d.alertGenerating === "true" && d.ticketGenerating === "false") {
					return "#FDAE61";
				} else {
					return "#3288BD";
				}
			})
			.style("stroke-width", "1.5px")
			.style("opacity", 1)
			.append('title')
				.text(function(d) { return d.runTime;});
		
		svg.select('.plotArea').selectAll('circle')
		.data(threhsoldMappedRuns)
		.transition()
		.duration(1000)
			.attr('cx', function(d) {
		    	return xScale(d.timeStamp);
		    })
		    .attr('cy', function(d) {
		    	return yScale(d.runTime);
		    })
		    .style("fill", function(d) {
		    	if(d.alertGenerating === "true" && d.ticketGenerating === "true") {
					return "#9E0142";
				} else if(d.alertGenerating === "true" && d.ticketGenerating === "false") {
					return "#FDAE61";
				} else {
					return "#3288BD";
				}
			})
		    .style("stroke", function(d) {
		    	if(d.alertGenerating === "true" && d.ticketGenerating === "true") {
					return "#9E0142";
				} else if(d.alertGenerating === "true" && d.ticketGenerating === "false") {
					return "#FDAE61";
				} else {
					return "#3288BD";
				}
			})
			.select('title')
				.text(function(d) { return d.runTime;});
		
		svg.select('.metricBehaviorLine')
			.datum(threhsoldMappedRuns)
	      	.transition()
	      	.duration(1000)
	      		.attr('d', metricBehaviorLine);
		
		svg.select('.userBehaviorLine')
			.datum(threhsoldMappedRuns)
			.transition()
			.duration(1000)
				.attr('d', userBehaviorLine);
		
	}
}