
PubMatic.JobAnalysisProduct.Functions.getJobAnalysisRuntimeProfileHistogramPanel = function(panelId, jobRuntimeProfileHistogramDashboardData) {
	
	var element = "#" + panelId + "-body";
		
	var dataset = [];
	var margin, width, height, xScale, yScale, xAxis, yAxis, svg, title, colors, colorScale;
	
	margin = {top: 30, right: 10, bottom: 45, left: 50};
	
	colors = ['#5E4FA2', '#3288BD', '#66C2A5', '#ABDDA4', '#E6F598', '#F6FAAA', '#FEE08B', '#FDAE61', '#F46D43', '#D53E4F', '#9E0142'];
	
	width = Number(d3.select(element).style("width").replace(/px$/, "")) - margin.left - margin.right;
	height = Number(d3.select(element).style("height").replace(/px$/, "")) - margin.top - margin.bottom;
	
	xScale = d3.scale.ordinal().rangeRoundBands([0, width], 0.5);
	yScale = d3.scale.linear().range([height, 0]);
	colorScale = d3.scale.quantile().range(colors);
	
	xAxis = d3.svg.axis()
	    .scale(xScale)
	    .ticks(5)
	    .orient("bottom");

	yAxis = d3.svg.axis()
	    .scale(yScale)
	    .ticks(5)
	    .orient("left");
	
	if(jobRuntimeProfileHistogramDashboardData === '') {
		
		svg = d3.select(element).append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		svg.append("g")
	      	.attr("class", "x axis")
	      	.attr("transform", "translate(0," + height + ")")
	      	.call(xAxis)
	      	.append("text")
	      	.attr("x", width/1.5)
	      	.attr("y", 35)
	      	.style("text-anchor", "end")
	      	.style("font", "Calibri")
	      	.style("font-weight", "bold")
	      	.style("font-size", "14px")
	      	.attr("fill", "black")
			.attr("opacity", 0.8)
		    .attr("text-anchor", "middle")
	      	.text("Runtime (Sec)");
	
		svg.append("g")
	      	.attr("class", "y axis")
	      	.call(yAxis)
	      	.append("text")
	      	.attr("transform", "rotate(-90)")
	      	.attr("x", -60)
	      	.attr("y", -45)
	      	.attr("dy", ".71em")
	      	.style("text-anchor", "end")
	      	.style("font", "Calibri")
	      	.style("font-weight", "bold")
	      	.style("font-size", "14px")
	      	.attr("fill", "black")
			.attr("opacity", 0.8)
		    .attr("text-anchor", "middle")
	      	.text("Frequency");
		
	} else {
		
		svg = d3.select(element).select("svg").select('g');
		
		dataset = jobRuntimeProfileHistogramDashboardData.dataset;
		var maxValue = jobRuntimeProfileHistogramDashboardData.maxValue;
		
		xScale.domain(dataset.map(function(d) { return d.value; }));
		svg.select(".x.axis")
			.transition()
			.call(xAxis);
		
		yScale.domain([0, d3.max(dataset, function(d) { return d.frequency; })]);
		svg.select(".y.axis")
			.transition()
			.call(yAxis);
		
		colorScale.domain([0, maxValue]);
		
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
				.text(function(d) { return d.value + ", " + d.frequency;});
		
		svg.selectAll('rect')
			.data(dataset)
			.transition()
			.duration(1000)
			.attr('x', function(d) {
				return xScale(d.value);
			})
			.attr("y", function(d) {
				return yScale(Number(d.frequency)); //Height minus data value
			})
			.attr('width', xScale.rangeBand())
			.attr("height", function(d) {
				return height- yScale(Number(d.frequency)); //Just the data value
			})
			.style("fill", function(d) { return colorScale(d.value); })
			.select('title')
				.text(function(d) { return d.value + ", " + d.frequency;});
		
	}
}