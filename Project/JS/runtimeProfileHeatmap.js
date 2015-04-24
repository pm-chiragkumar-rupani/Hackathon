
PubMatic.JobAnalysisProduct.Functions.getJobAnalysisRuntimeProfileHeatmapPanel = function(panelId, cronId) {

	var readDataMask = new Ext.LoadMask(Ext.getCmp(panelId), {msg:"Loading"});
	readDataMask.show();

	d3.json(PubMatic.JobAnalysisProduct.FileNames.CronRunHistory + "/" + cronId)
	.get(function(error, cronRunData) {

		readDataMask.hide();

		var element = "#" + panelId + "-body",
		dataset = [],
		margin, width, height, gridSize, legendElementWidth, svg, colors, colorScale, days, times, heatMap,
		parseDate = d3.time.format(PubMatic.JobAnalysisProduct.Constants.TimestampFormat).parse,
		distribution = {};

		margin = {top: 30, right: 10, bottom: 30, left: 45};
		
		colors = ['#5E4FA2', '#3288BD', '#66C2A5', '#ABDDA4', '#E6F598', '#F6FAAA', '#FEE08B', '#FDAE61', '#F46D43', '#D53E4F', '#9E0142'];
		days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
		times = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
		
		width = Number(d3.select(element).style("width").replace(/px$/, "")) - margin.left - margin.right;
		height = Number(d3.select(element).style("height").replace(/px$/, "")) - margin.top - margin.bottom;
		gridSize = Math.floor(width / 24);
	    legendElementWidth = gridSize*2;
		
		colorScale = d3.scale.quantile().range(colors);
		
		svg = d3.select(element).append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		svg.selectAll(".dayLabel")
            .data(days)
            .enter().append("text")
              	.text(function (d) { return d; })
              	.attr("x", 0)
              	.attr("y", function (d, i) { return i * gridSize; })
              	.style("text-anchor", "end")
              	.attr("transform", "translate(-6," + gridSize / 1.5 + ")")
              	.style('font', 'Calibri')
              	.style('font-weight', 'bold')
              	.style('font-size', '8px')
              	.attr("fill", "black")
              	.attr("opacity", function(d, i) {
              		if(i >= 0 && i <= 4)
              			return 0.8;
              		else
              			return 0.4;	
              	});
		
		svg.selectAll(".timeLabel")
            .data(times)
            .enter().append("text")
	        	.text(function(d) { return d; })
	            .attr("x", function(d, i) { return i * gridSize; })
	            .attr("y", 0)
	            .style("text-anchor", "middle")
	            .attr("transform", "translate(" + gridSize / 2 + ", -6)")
	            .style('font', 'Calibri')
              	.style('font-weight', 'bold')
              	.style('font-size', '8px')
              	.attr("fill", "black")
              	.attr("opacity", function(d, i) {
              		if(i >= 8 && i < 20)
              			return 0.8;
              		else
              			return 0.4;	
              	});
		
		heatMap = svg.append('g').attr('id', 'jobRuntimeHeatMapId_'+cronId);
		
		for(var dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
			for(var hourOfDay = 0; hourOfDay < 24; hourOfDay++) {
				var temp = {};
				temp.dayOfWeek = dayOfWeek;
				temp.hourOfDay = hourOfDay;
				temp.avgRunTime = 0;
				dataset.push(temp);
			}
		}
		
		heatMap.selectAll('rect')
			.data(dataset)
			.enter()
			.append("rect")
	            .attr("x", function(d) { return d.hourOfDay*gridSize; })
	            .attr("y", function(d) { return d.dayOfWeek*gridSize; })
	            .attr("rx", 2)
	            .attr("ry", 2)
	            .attr("width", gridSize)
	            .attr("height", gridSize)
	            .style("fill", 'black')
	            .style('fill-opacity', 0.4)
	            .style('stroke', 'white')
	            .style('stroke-width', 1)
	            .append('title')
	            	.text(function(d) { return d.avgRunTime; });
			
		var legendGroup = svg.append('g').attr('transform', "translate(" + width/5 + ", " + (height-20) + ")");
		
		legendGroup.append('rect')
			.attr('x', 0)
			.attr('y', 0)
			.attr('width', width/2)
			.attr('height', 40)
			.attr('rx', 4)
			.attr('ry', 4)
			.style("fill", "#F3F3F3");
		
		legendGroup.append('g').attr('transform', "translate(3.5,0)")
			.selectAll('.legends')
			.data(colors)
			.enter()
				.append('rect')
				.attr('x', function(d, i) { return i * (gridSize + 1);})
				.attr('y', 10)
				.attr('width', gridSize)
				.attr('height', gridSize)
				.attr('rx', 4)
				.attr('ry', 4)
				.style("fill", function(d) { return d;});
		
		legendGroup.append('text')
			.text('LOW')
			.attr('x', 10)
			.attr('y', 35)
			.style('font', 'Calibri')
          	.style('font-weight', 'bold')
          	.style('font-size', '8px')
          	.attr("fill", "black")
          	.attr("opacity", 0.8);
		
		legendGroup.append('text')
			.text('HIGH')
			.attr('x', width/2 - 30)
			.attr('y', 35)
			.style('font', 'Calibri')
          	.style('font-weight', 'bold')
          	.style('font-size', '8px')
          	.attr("fill", "black")
          	.attr("opacity", 0.8);
		
		cronRunData.forEach(function (run) {
			var dow = parseDate(run.startTime).getDay(),
				hod = parseDate(run.startTime).getHours(),
				key = dow+","+hod;

			if(distribution[key]) {
				distribution[key].value += Number(run.runTime);
				distribution[key].count += 1;
			} else {
				distribution[key] = {
					value: Number(run.runTime),
					count: 1
				};
			}
		});

		dataset.forEach(function (eachDay) {
			var key = eachDay.dayOfWeek + "," + eachDay.hourOfDay;
			if(distribution[key]) {
				eachDay.avgRunTime = Number(distribution[key].value/distribution[key].count);
			}
		});

		// Object.keys(distribution).forEach(function (eachDis) {
		// 	var dow = Number(eachDis.split(",")[0]),
		// 		hod = Number(eachDis.split(",")[1]);

		// 	dataset.push({
		// 		dayOfWeek: Number(dow),
		// 		hourOfDay: Number(hod),
		// 		avgRunTime: Number(distribution[eachDis].value/distribution[eachDis].count)
		// 	});
		// });

		var maxValue = d3.max(dataset, function(d) { return d.avgRunTime; });
		
		dataset.sort(function(a,b) {
			if(a.dayOfWeek == b.dayOfWeek) {
				return d3.ascending(a.hourOfDay, b.hourOfDay);
			} else {
				return d3.ascending(a.dayOfWeek, b.dayOfWeek);
			}
		});
		
		heatMap = d3.select(element).select('svg').select('#jobRuntimeHeatMapId_'+cronId)
		
		colorScale.domain([0, maxValue]);

		heatMap.selectAll('rect')
		.data(dataset)
		.exit()
		.transition()
			.style("fill", 'black')
            .style('fill-opacity', 0.4)
            .select('title')
	            	.text('0');
		
		heatMap.selectAll('rect')
			.data(dataset)
			.transition()
			.duration(1000)
				.style("fill", function(d) { 
					if(d.avgRunTime === 0) {
						return 'black';
					} else {
						return colorScale(d.avgRunTime);
					}
				})
	            .style('fill-opacity', function(d) {
	            	if(d.avgRunTime === 0) {
						return 0.4;
					} else {
						return 1;
					}
	            })
	            .select('title')
	            	.text(function(d) { return d.avgRunTime;});
			
	});
}