
PubMatic.JobAnalysisProduct.Functions.getJobAnalysisSummaryThresholdPanel = function(panelId, thresholdType, jobThresholdDashboardData) {
	
	var element = "#" + panelId + "-body";
		
	var dataset = [];
	var margin, width, height, xScale, yScale, xAxis, yAxis, svg, title;
	
	if(thresholdType === 'metricBehavior') {
		title = 'Metric-Behaviour';
	} else {
		title = 'User-Behaviour';
	}
	
	margin = {top: 20, right: 10, bottom: 20, left: 45};
	
	width = Number(d3.select(element).style("width").replace(/px$/, "")) - margin.left - margin.right;
	height = Number(d3.select(element).style("height").replace(/px$/, "")) - margin.top - margin.bottom;

	xScale = d3.scale.ordinal().rangeRoundBands([0, width], 0.5);
	yScale = d3.scale.linear().range([height, 0]);
	
	xAxis = d3.svg.axis()
	    .scale(xScale)
	    .orient("bottom");

	yAxis = d3.svg.axis()
	    .scale(yScale)
	    .ticks(2)
	    .orient("left");
	
	if(jobThresholdDashboardData === '') {
		
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
		
		
		svg.append("g")
		     .append("text")
			    .style('font', 'Calibri')
				.style('font-weight', 'bold')
				.style('font-size', '12px')
			    .attr("x", width/2)
			    .attr("y", -8)
			    .attr("fill", "black")
				.attr("opacity", 0.8)
			    .attr("text-anchor", "middle")
			    .text(title);
		
	} else {
		
		svg = d3.select(element).select("svg").select('g');
		
		var maxThreshold = jobThresholdDashboardData.maxThreshold;
		dataset = jobThresholdDashboardData.dataset;
		
		xScale.domain(dataset.map(function(d) { return d.schedule; }));
		svg.select(".x.axis")
			.transition()
			.duration(1000)
			.call(xAxis);
		
		yScale.domain([0, maxThreshold]);
		svg.select(".y.axis")
			.transition()
			.duration(1000)
			.call(yAxis);
		
		svg.selectAll('rect')
		.data(dataset)
		.exit()
			.transition()
			.remove();
		
		svg.selectAll('rect')
		.data(dataset)
		.enter()
			.append('rect')
			.attr('class', 'bar')
			.attr('x', width)
			.attr("y", height)
			.attr('width', 0)
			.attr("height", 0)
			.append('title')
				.text(function(d) {
					if(d.schedule !== ' ') {
						return d.schedule + ", " + d.threshold;
					} else {
						return d.threshold;
					}
				});
		
		svg.selectAll('rect')
			.data(dataset)
			.transition()
			.duration(1000)
			.attr('x', function(d) {
				return xScale(d.schedule);
			})
			.attr("y", function(d) {
				return yScale(Number(d.threshold)); //Height minus data value
			})
			.attr('width', xScale.rangeBand())
			.attr("height", function(d) {
				return height- yScale(Number(d.threshold)); //Just the data value
			})
			.select('title')
				.text(function(d) { 
					if(d.schedule !== ' ') {
						return d.schedule + ", " + d.threshold;
					} else {
						return d.threshold;
					}
				});
	}
}