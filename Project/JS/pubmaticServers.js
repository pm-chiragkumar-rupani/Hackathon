
PubMatic.JobAnalysisProduct.Functions.getPubMaticServersPanel = function (panelId, dataCenterId, dcName) {

	var panel = Ext.getCmp(panelId),
		element,
		margin, width, height, xScale, yScale, xAxis, yAxis, svg, title, healthScale;

	if(!dataCenterId && !dcName) {
		panel.add({
			id: 'serversGridPanelId',
			xtype: 'panel',
			title: 'Servers',
			border: false,
			layout: 'fit'
		});

		panel.doLayout();

	}

	element = "#serversGridPanelId-body";
	
	margin = {top: 20, right: 10, bottom: 25, left: 50};
	
	width = Number(d3.select(element).style("width").replace(/px$/, "")) - margin.left - margin.right;
	height = Number(d3.select(element).style("height").replace(/px$/, "")) - margin.top - margin.bottom;

	xScale = d3.scale.ordinal().rangeRoundBands([0, width], 0.5);
	yScale = d3.scale.linear().range([height, 0]).domain([0, 100]);
	healthScale = d3.scale.quantile().domain([0, 100]).range(['red', 'orange', 'green']);
	
	xAxis = d3.svg.axis()
	    .scale(xScale)
	    .tickFormat(function (d) {
	    	return "S" + d;
	    })
	    .orient("bottom");

	yAxis = d3.svg.axis()
	    .scale(yScale)
	    .ticks(2)
	    .orient("left");
	
	if(!dataCenterId && !dcName) {
		
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
		      	.attr("x", -75)
		      	.attr("y", -40)
		      	.attr("dy", ".71em")
		      	.style("text-anchor", "end")
		      	.style("font", "Calibri")
		      	.style("font-weight", "bold")
		      	.style("font-size", "14px")
		      	.attr("fill", "black")
				.attr("opacity", 0.8)
			    .attr("text-anchor", "middle")
		      	.text("Server Load");;
		
		
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

		var readDataMask = new Ext.LoadMask(Ext.getCmp('serversGridPanelId'), {msg:"Loading Servers"});
		readDataMask.show();

		d3.json(PubMatic.JobAnalysisProduct.FileNames.Server + "/dc/" + dataCenterId)
		.get(function(error, serverData) {

			readDataMask.hide();
			
			var maxThreshold = d3.max(serverData, function (d) { return Number(d.serverHealth); });
			serverData.sort(function(a,b) { return d3.ascending(Number(a.serverHealth), Number(b.serverHealth)); });

			svg = d3.select(element).select("svg").select('g');
			
			xScale.domain(serverData.map(function(d) { return d.id; }));
			svg.select(".x.axis")
				.transition()
				.duration(1000)
				.call(xAxis);
			
			yScale.domain([0, 100]);
			svg.select(".y.axis")
				.transition()
				.duration(1000)
				.call(yAxis);
			
			svg.selectAll('rect')
			.data(serverData)
			.exit()
				.transition()
				.remove();
			
			svg.selectAll('rect')
			.data(serverData)
			.enter()
				.append('rect')
				.attr('class', 'bar')
				.attr('x', width)
				.attr("y", height)
				.attr('width', 0)
				.attr("height", 0)
				.on("click", function (thisServer) {
					PubMatic.JobAnalysisProduct.Functions.loadCronsForThisServer(thisServer.id, thisServer.serverIP);
				})
				.append('title')
					.text(function(d) {
						return d.description;
					});
			
			svg.selectAll('rect')
				.data(serverData)
				.transition()
				.duration(1000)
				.attr('x', function(d) {
					return xScale(d.id);
				})
				.attr("y", function(d) {
					return yScale(Number(d.serverHealth)); //Height minus data value
				})
				.style("fill", function (d) {
					return healthScale(Number(d.serverHealth));
				})
				.attr('width', xScale.rangeBand())
				.attr("height", function(d) {
					return height- yScale(Number(d.serverHealth)); //Just the data value
				})
				.select('title')
					.text(function(d) {
						return d.description;
					});

			Ext.getCmp('serversGridPanelId').setTitle("Servers in " + dcName + " (" + serverData.length + ")");
		});	
	}
};