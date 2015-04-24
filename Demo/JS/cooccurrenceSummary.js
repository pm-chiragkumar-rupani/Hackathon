
PubMatic.JobAnalysisProduct.Functions.getJobAnalysisSummaryCooccurrencePanel = function(panelId, jobName, jobCoOccurrenceSummaryDashboardData) {
	
	var element = "#" + panelId + "-body";
	
	var dataset = [];
	var margin, width, height, xScale, yScale, xAxis, yAxis, svg, parseDate;
	
	margin = {top: 10, right: 10, bottom: 20, left: 45};
	
	width = Number(d3.select(element).style("width").replace(/px$/, "")) - margin.left - margin.right;
	height = Number(d3.select(element).style("height").replace(/px$/, "")) - margin.top - margin.bottom;
	
	parseDate = d3.time.format(PubMatic.JobAnalysisProduct.Constants.TimestampFormat).parse;
	
	xScale = d3.time.scale().range([0, width]);
	yScale = d3.scale.ordinal().rangeRoundBands([height, 0], 0.1);
	
	xAxis = d3.svg.axis()
	    .scale(xScale)
	    .ticks(5)
	    .orient("bottom");
	
	yAxis = d3.svg.axis()
	    .scale(yScale)
	    .tickFormat(function(d) { return d.substring(0,2) + ".." + d.substring(d.length-2, d.length); })
	    .orient("left");
	
	if(jobCoOccurrenceSummaryDashboardData === '') {
		
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
		
		svg.append('g').attr('class', 'plotArea');
		
	} else {
	
		svg = d3.select(element).select("svg").select('g');
		
		dataset = jobCoOccurrenceSummaryDashboardData.dataset;
		
		numberOfCoOccurringJobs = jobCoOccurrenceSummaryDashboardData.numberOfCoOccurringJobs;
		
		Ext.getCmp(panelId).setTitle("3. Co-occurrence Signature (" + numberOfCoOccurringJobs + ")");
		
		xScale.domain(d3.extent(dataset, function(d) { return d.timeStamp; }));
		svg.select(".x.axis")
			.transition()
			.duration(1000)
			.call(xAxis);
		
		yScale.domain(dataset.map(function(d) { return d.jobName; }).unique());
		svg.select(".y.axis")
			.transition()
			.duration(1000)
			.call(yAxis);
		
		svg.select('.plotArea').selectAll('circle')
		.data(dataset)
		.exit()
			.transition()
			.remove();
		
		svg.select('.plotArea').selectAll('circle')
		.data(dataset)
		.enter()
			.append('circle')
			.attr('cx', function(d) {
		    	return width;
		    })
		    .attr('cy', function(d) {
		    	return height;
		    })
		    .attr('r', 2)
		    .style("fill", "#94AE0A")
		    .style("stroke", "#94AE0A")
			.style("stroke-width", "1.5px")
			.append('title')
				.text(function(d) { return d.jobName;});
		
		svg.select('.plotArea').selectAll('circle')
		.data(dataset)
		.transition()
		.duration(1000)
			.attr('cx', function(d) {
		    	return xScale(d.timeStamp);
		    })
		    .attr('cy', function(d) {
		    	return yScale(d.jobName);
		    })
		    .style("fill", function(d) {
		    	if(d.jobName.toLowerCase() === jobName.toLowerCase()) {
					return "#333333";
				} else {
					return "#94AE0A";
				}
			})
		    .style("stroke", function(d) {
		    	if(d.jobName.toLowerCase() === jobName.toLowerCase()) {
					return "#333333";
				} else {
					return "#94AE0A";
				}
			})
		    .style("opacity", function(d) {
		    	if(d.alertGenerating === "true") {
					return 1;
		    	} else {
		    		return 0;
		    	}
			})
			.select('title')
				.text(function(d) { return d.jobName;});
		
	}
};