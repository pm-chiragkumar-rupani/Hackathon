
PubMatic.JobAnalysisProduct.Functions.getJobAnalysisRuntimeProfileTimeseriesPanel = function(panelId, cronId) {

	var readDataMask = new Ext.LoadMask(Ext.getCmp(panelId), {msg:"Loading"});
	readDataMask.show();

	d3.json(PubMatic.JobAnalysisProduct.FileNames.CronRunHistory + "/" + cronId)
	.get(function(error, cronRunData) {

		readDataMask.hide();

		var element = "#" + panelId + "-body",
			threhsoldMappedRuns = cronRunData.map(function(d) { 
				return {
					startTime: d.startTime, 
					runTime: d.runTime, 
					threshold: d.threshold
				}; 
			}),
			margin, width, height, xScale, yScale, xAxis, yAxis, 
			svg, parseDate, thresholdLine, legendGroup,
			maxThreshold = d3.max(threhsoldMappedRuns, function (d) { return Number(d.runTime)})
			threshold = 0;
		
		if(threhsoldMappedRuns.length !== 0) {
			threshold = threhsoldMappedRuns[0].threshold;
		}

		threhsoldMappedRuns.sort(function(a,b){ return d3.ascending(a.startTime, b.startTime); });

		margin = {top: 50, right: 30, bottom: 40, left: 70};
		
		width = Number(d3.select(element).style("width").replace(/px$/, "")) - margin.left - margin.right;
		height = Number(d3.select(element).style("height").replace(/px$/, "")) - margin.top - margin.bottom;
		
		parseDate = d3.time.format(PubMatic.JobAnalysisProduct.Constants.TimestampFormat).parse;

		xScale = d3.time.scale().range([0, width]).domain(d3.extent(threhsoldMappedRuns, function(d) { return parseDate(d.startTime); }));
		yScale = d3.scale.linear().range([height, 0]).domain([0, maxThreshold]);
		
		xAxis = d3.svg.axis()
		    .scale(xScale)
		    .orient("bottom");
		
		yAxis = d3.svg.axis()
		    .scale(yScale)
		    .orient("left");
		
		thresholdLine = d3.svg.line()
		    .x(function(d) { return xScale(parseDate(d.startTime)); })
		    .y(function(d) { return yScale(d.threshold); });

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
		
		legendGroup = svg.append('g').attr('id', 'legendGropuId').attr('transform', "translate(" + 250 + ", -35)");
			
		// legendGroup.append('circle')
		// 	.attr('cx', 0)
		// 	.attr('cy', 0)
		// 	.attr('r', 4)
		// 	.style('fill', '#3288BD');
		
		// legendGroup.append('text')
		// 	.text('Normal Run')
		// 	.style("font", "Calibri")
	 //      	.style("font-weight", "bold")
	 //      	.style("font-size", "12px")
		// 	.attr('x', 10)
		// 	.attr('y', 4)
		// 	.style('fill', '#3288BD');
		
		legendGroup.append('circle')
			.attr('cx', 0)
			.attr('cy', 0)
			.attr('r', 4)
			.style('fill', '#FDAE61');
		
		legendGroup.append('text')
			.text('Alert Generating Run')
			.style("font", "Calibri")
	      	.style("font-weight", "bold")
	      	.style("font-size", "12px")
			.attr('x', 10)
			.attr('y', 4)
			.style('fill', '#FDAE61');

		legendGroup.append('line')
			.attr('x1', 200)
			.attr('y1', 2)
			.attr('x2', 230)
			.attr('y2', 2)
			.style('stroke', '#94AE0A')
			.style('stroke-width', '4px');
		
		legendGroup.append('text')
			.text('Threshold (' + threshold + ')')
			.attr('id', 'thresholdText')
			.style("font", "Calibri")
	      	.style("font-weight", "bold")
	      	.style("font-size", "12px")
			.attr('x', 240)
			.attr('y', 4)
			.style('fill', '#94AE0A');
		
		svg.append("path")
	      	.datum(threhsoldMappedRuns)
	      	.attr("class", "thresholdLine")
	      	.attr("d", thresholdLine)
		    .style({"fill": "none", "stroke": "#94AE0A","stroke-width": "2px"});
		
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
		    	if(Number(d.runTime) > Number(d.threshold)) {
					return "#FDAE61";
				} else {
					return "#3288BD";
				}
			})
		    .style("stroke", function(d) {
		    	if(Number(d.runTime) > Number(d.threshold)) {
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
		    	return xScale(parseDate(d.startTime));
		    })
		    .attr('cy', function(d) {
		    	return yScale(Number(d.runTime));
		    })
		    .style("fill", function(d) {
		    	if(Number(d.runTime) > Number(d.threshold)) {
					return "#FDAE61";
				} else {
					return "#3288BD";
				}
			})
		    .style("stroke", function(d) {
		    	if(Number(d.runTime) > Number(d.threshold)) {
					return "#FDAE61";
				} else {
					return "#3288BD";
				}
			})
			.select('title')
				.text(function(d) { return d.runTime;});
			
	});
	
}