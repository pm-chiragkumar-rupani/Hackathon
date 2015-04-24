
PubMatic.JobAnalysisProduct.Functions.getJobAnalysisCoOccurrenceAnalysisGraphPanel = function(panelId, streamName, jobName, jobCoOccurrenceAnalysisGraphDashboardData, runData) {
	
	var containerPanel = Ext.getCmp(panelId);
	
	containerPanel.removeAll();
	
	containerPanel.add([{
		id: 'jobAnalysisProductJobAnalysisCoOccurrenceSignatureInputPanelId',
		xtype: 'panel',
		border: false,
		flex: 0.065,
		layout: 'fit'
	}, {
		id: 'jobAnalysisProductJobAnalysisCoOccurrenceSignatureGraphPanelId',
		xtype: 'panel',
		flex: 0.935,
		layout: 'fit'
	}]);
	containerPanel.doLayout();
	
	var activeTab = Ext.getCmp('jobAnalysisProductJobAnalysisDetailsTabPanelId').getActiveTab();
	Ext.getCmp('jobAnalysisProductJobAnalysisCoOccurrenceSignaturePanelId').show();
	Ext.getCmp('jobAnalysisProductJobAnalysisDetailsTabPanelId').setActiveTab(activeTab);
	
	var panel = Ext.getCmp('jobAnalysisProductJobAnalysisCoOccurrenceSignatureInputPanelId');
	panel.removeAll();
	
	var searchField = Ext.create('Ext.form.field.Text', {
		xtype: 'textfield', 
		id: "jobAnalysisCoOccurrenceInputPanelSeachFieldId",
        fieldLabel: 'Search',
        margin: '0 50 0 0'
    });
	
	searchField.on('change', function(txtfield, event, eOpts) {
	    var searchTerm;
	    searchTerm = txtfield.getValue();
	    updateGraphForSearchedTerm(searchTerm);
	  });
	
	var streamAnalysisInputForm = Ext.widget({
        xtype: 'form',
        layout: 'form',
        id: 'jobAnalysisCoOccurrenceInputPanelFormId',
        frame: true,
        border: false,
        bodyPadding: '0 0 0 250',
        items: [{
        	xtype: 'fieldcontainer',
        	layout: {
        		type: 'hbox',
        		align: 'stretch'
        	},
        	items: [searchField]
        }]
    });
	
	panel.add(streamAnalysisInputForm);
	panel.doLayout();
	
	var element = "#jobAnalysisProductJobAnalysisCoOccurrenceSignatureGraphPanelId-body";
	
	var maxDepth = jobCoOccurrenceAnalysisGraphDashboardData.maxDepth;
	var nodes = jobCoOccurrenceAnalysisGraphDashboardData.nodes;
	var links = jobCoOccurrenceAnalysisGraphDashboardData.links;
	
	var numberOfCoOccurringJobs = 0;
	nodes.forEach(function(eachNode) {
		if(eachNode.isItCoOccurring) {
			numberOfCoOccurringJobs++;
		}
	});
	
	var width, height, radius;
	
	width = d3.select(element).style("width").replace(/px$/, "");
	height = d3.select(element).style("height").replace(/px$/, "");
	
	radius = 3;
	
	if(links.length != 0) {
		
		var force = d3.layout.force()
		    .nodes(nodes)
		    .links(links)
		    .size([width, height])
		    .linkDistance(25)
		    .charge(-100)
		    .on("tick", tick)
		    .start();
		
		var tipContent = "<strong>Job:</strong> <span id='jobNameId'>Temp</span><br>";
		tipContent += "<strong>Similarity:</strong> <span id='similarityCoefficientId'>100</span><br>";
		
		var tooltip = d3.select(element).append('div')
						.attr('id', 'jobAnalysisGraphTooltipId')
						.attr('class', 'hidden')
							.append('p')
								.html(tipContent)
		
		var svg = d3.select(element).append("svg")
		    .attr("width", width)
		    .attr("height", height);
		
		// build the arrow.
		svg.append("svg:defs").selectAll("marker")
		    .data(["coOccurrenceJobConnectionsMarkerId"])
		  .enter().append("svg:marker")
		    .attr("id", String)
		    .attr("viewBox", "0 -5 10 10")
		    .attr("refX", 12)
		    .attr("refY", -0.8)
		    .attr("markerWidth", 7)
		    .attr("markerHeight", 7)
		    .attr("orient", "auto")
		    .style("fill", '#E4E4E4')
		  .append("svg:path")
		    .attr("d", "M0,-5L10,0L0,5");
		
		svg.append('text')
			.attr('x', 10)
			.attr('y', 20)
			.style("font", "Calibri")
	      	.style("font-weight", "bold")
	      	.style("font-size", "12px")
	      	.style('fill', 'blue')
			.text(numberOfCoOccurringJobs + ' jobs correlate with the alerts of current job.');
		
		var legendGroup = svg.append('g').attr('transform', "translate(" + (width-150) + ", 20)");
		
		legendGroup.append('circle')
			.attr('cx', 0)
			.attr('cy', 0)
			.attr('r', 4)
			.style('fill', '#009DE6');
		
		legendGroup.append('text')
			.text('Current Job')
			.style("font", "Calibri")
	      	.style("font-weight", "bold")
	      	.style("font-size", "12px")
			.attr('x', 10)
			.attr('y', 4)
			.style('fill', '#009DE6');
		
		legendGroup.append('circle')
			.attr('cx', 0)
			.attr('cy', 15)
			.attr('r', 4)
			.style('fill', '#F46D43');
		
		legendGroup.append('text')
			.text('Alert Co-Occurring Job')
			.style("font", "Calibri")
	      	.style("font-weight", "bold")
	      	.style("font-size", "12px")
			.attr('x', 10)
			.attr('y', 19)
			.style('fill', '#F46D43');
		
		legendGroup.append('circle')
			.attr('cx', 0)
			.attr('cy', 30)
			.attr('r', 4)
			.style('fill', '#A0A0A0');
		
		legendGroup.append('text')
			.text('Normal Job')
			.style("font", "Calibri")
	      	.style("font-weight", "bold")
	      	.style("font-size", "12px")
			.attr('x', 10)
			.attr('y', 34)
			.style('fill', '#A0A0A0');
		
		legendGroup.append('input')
			.attr('type', 'text')
			.attr('size', 100);
		
		// add the links and the arrows
		var path = svg.append("svg:g").selectAll("path")
		    .data(force.links())
		  .enter().append("svg:path")
		    .attr("class", "link")
		    .attr("marker-end", "url(#coOccurrenceJobConnectionsMarkerId)")
		    .style("fill", "none")
		    .style("stroke", "#E4E4E4")
		    .style("stroke-width", "1px");

		// define the nodes
		var node = svg.selectAll(".node")
		    .data(force.nodes())
		  .enter().append("g")
		    .attr("class", "node");

		// add the nodes
		node.append("circle")
		    .attr("r", radius)
		    .style("fill", function(d) {
		    	if(d.name.toLowerCase() === jobName.toLowerCase()) {
		    		return "#009DE6";
		    	} else if(d.isItCoOccurring) {
		    		return "#F46D43";
		    	} else {
	    			return "#A0A0A0";
		    	}
		    })
		    .style("stroke", function(d) {
		    	if(d.name.toLowerCase() === jobName.toLowerCase()) {
		    		return "#009DE6";
		    	} else if(d.isItCoOccurring) {
		    		return "#F46D43";
		    	} else {
	    			return "#A0A0A0";
		    	}
		    })
		    .style("stroke-width", "1.5px")
		    .on("mouseover", function(d) {

				//Get this bar's x/y values, then augment for the tooltip
		    	var parentNodeTransform = d3.select(this.parentNode).attr("transform");
		    	parentNodeTransform = parentNodeTransform.replace('translate','');
		    	parentNodeTransform = parentNodeTransform.replace('(','');
		    	parentNodeTransform = parentNodeTransform.replace(')','');
		    	var positions = parentNodeTransform.split(',');
		    	
				var xPosition = parseFloat(positions[0]);
				var yPosition = parseFloat(positions[1]);
				
				if(xPosition+d.name.length*8 > width) {
					xPosition = width - d.name.length*8;
				}
				if(yPosition+120 > height) {
					yPosition = height - 120;
				}
				
				//Update the tooltip position and value
				var tip = d3.select(element).select("#jobAnalysisGraphTooltipId")
				  .style("left", xPosition + "px")
				  .style("top", yPosition + "px")
				  .style("width", d.name.length*8 + "px");
				
				tip.select("#jobNameId")
				  	.text(d.name);
				
				tip.select("#similarityCoefficientId")
			  		.text(d.similarityCoefficient);
				
				//Show the tooltip
				tip.classed("hidden", false);
				
			})
			.on("mouseout", function() {
				//Hide the tooltip
				d3.select(element).select("#jobAnalysisGraphTooltipId").classed("hidden", true);
			})
			.on('click', function(d) {
				if(d.isItCoOccurring) {
					PubMatic.JobAnalysisProduct.Functions.coOccurrenceGraphNodeClickHandler(streamName, d.name, jobName, runData);
				}
			})
		    .call(force.drag);
	
	} else {
		
		var svg = d3.select(element).append("svg")
	    .attr("width", width)
	    .attr("height", height);
		
		svg.append("text")
		.attr("x", 10)
		.attr("y", 15)
		.style({"fill":"red", "font-weight":"bold", "font-size":"12px"})
		.text("Data is not available for this job.");
	}
	
	// add the curvy lines
	function tick() {
	    path.attr("d", function(d) {
	    	var sourceNodeDepth = d.source.depth;
	    	var targetNodeDepth = d.target.depth;
        	var sourceHeightScale = d3.scale.linear().range([(sourceNodeDepth-1)*(height/maxDepth), sourceNodeDepth*(height/maxDepth)]).domain([0, height]);
        	var targetHeightScale = d3.scale.linear().range([(targetNodeDepth-1)*(height/maxDepth), targetNodeDepth*(height/maxDepth)]).domain([0, height]);
        	var sourceY = sourceHeightScale(d.source.y) + (radius/2);
        	var targetY = targetHeightScale(d.target.y) - (radius/2);
        	var sourceX = d.source.x + (radius/2);
        	var targetX = d.target.x + (radius/2);
	        var dx = targetX - sourceX,
	            dy = targetY - sourceY,
	            dr = Math.sqrt(dx * dx + dy * dy);
	        return "M" + 
	        	sourceX + "," + 
	            sourceY + "L" + 
	            targetX + "," + 
	            targetY;
	    }).style("stroke", '#E4E4E4');

	    node
	        .attr("transform", function(d) { 
	        	var nodeDepth = d.depth; 
	        	var heightScale = d3.scale.linear().range([(nodeDepth-1)*(height/maxDepth), nodeDepth*(height/maxDepth)]).domain([0, height]);
	            return "translate(" + d.x + "," + heightScale(d.y) + ")"; });
	}
	
	function updateGraphForSearchedTerm(searchTerm) {
		var searchRegEx;
	    searchRegEx = new RegExp(searchTerm.toLowerCase());
	    
	    node.each(function(d) {
	    	var element, match;
	    	element = d3.select(this).select('circle');
	    	match = d.name.toLowerCase().search(searchRegEx);
	    	if (searchTerm.length > 0 && match >= 0) {
	    		if(d.isItCoOccurring) {
	    			return element.attr('r', 4).style("stroke-width", 2.0).style("stroke", "#555");
	    		} else {
	    			return element.attr('r', 4).style("stroke-width", 2.0).style("stroke", "#555");
	    		}
	    	} else {
	    		return element.attr('r', radius).style("fill", function(d) {
	    			if(d.name.toLowerCase() === jobName.toLowerCase()) {
			    		return "#009DE6";
			    	} else if(d.isItCoOccurring) {
			    		return "#F46D43";
			    	} else {
		    			return "#A0A0A0";
			    	}
	    		}).style("stroke", function(d) {
	    			if(d.name.toLowerCase() === jobName.toLowerCase()) {
			    		return "#009DE6";
			    	} else if(d.isItCoOccurring) {
			    		return "#F46D43";
			    	} else {
		    			return "#A0A0A0";
			    	}
	    		}).style("stroke-width", 1.5);
	    	}
	    });
	    
	}
		
};

PubMatic.JobAnalysisProduct.Functions.coOccurrenceGraphNodeClickHandler = function(streamName, causeJob, effectJob, runData) {
	
	var correlationTimeseriesPanel = Ext.create('Ext.panel.Panel', {
		id: 'jobCoOccurrenceCorrelationTimeseriesPanelId',
		border: false,
		layout: {
			type: 'vbox',
			align: 'stretch'
		},
		height: 800,
		width: 600,
		items: [{
			id: 'effectAlertTimeseriesPanelId',
			xtype: 'panel',
			title: effectJob,
			titleAlign: 'center',
			flex: 0.5,
			layout: 'fit'
		}, {
			id: 'causeAlertTimeseriesPanelId',
			xtype: 'panel',
			title: causeJob,
			titleAlign: 'center',
			flex: 0.5,
			layout: 'fit'
		}]
	}); 
	
	var popUpWindow = Ext.create('Ext.Window', {
		id: 'popUpWindowId',
        width: 800,
        height: 600,
        title: causeJob + ' - Correlation',
        renderTo: Ext.getBody(),
        modal: true,
        layout: 'fit',
        closeAction: 'destroy',
        items: correlationTimeseriesPanel
    });
	
	popUpWindow.show();
	
	PubMatic.JobAnalysisProduct.Functions.getJobAnalysisCoOccurrenceAnalysisEffectTimeseriesPanel('effectAlertTimeseriesPanelId', streamName, effectJob, runData);
	PubMatic.JobAnalysisProduct.Functions.getJobAnalysisCoOccurrenceAnalysisCauseTimeseriesPanel('causeAlertTimeseriesPanelId', streamName, causeJob, runData);
}

PubMatic.JobAnalysisProduct.Functions.getJobAnalysisCoOccurrenceAnalysisCauseTimeseriesPanel = function(panelId, streamName, causeJob, runData) {
	var dataset = [];
	var parseDate = d3.time.format(PubMatic.JobAnalysisProduct.Constants.TimestampFormat).parse;
	
	runData.forEach(function(eachData) {
		if(eachData.streamName.toLowerCase() == streamName.toLowerCase() && eachData.jobName.toLowerCase() === causeJob.toLowerCase()) {
			var temp = {};
			temp.jobName = '';
			temp.timeStamp = parseDate(eachData.startTime);
			temp.alertGenerating = eachData.alertStatus.toLowerCase();
			dataset.push(temp);
		}
	});
	
	var element = "#" + panelId + "-body";
	
	var margin, width, height, xScale, yScale, xAxis, yAxis, svg, parseDate;
	
	margin = {top: 20, right: 20, bottom: 30, left: 55};
	
	width = Number(d3.select(element).style("width").replace(/px$/, "")) - margin.left - margin.right;
	height = Number(d3.select(element).style("height").replace(/px$/, "")) - margin.top - margin.bottom;
	
	parseDate = d3.time.format(PubMatic.JobAnalysisProduct.Constants.TimestampFormat).parse;
	
	xScale = d3.time.scale().range([0, width]).domain(d3.extent(dataset, function(d) { return d.timeStamp; }));
	yScale = d3.scale.ordinal().rangeRoundBands([height, 0], 0.1).domain(dataset.map(function(d) { return d.jobName; }).unique());
	
	xAxis = d3.svg.axis()
	    .scale(xScale)
	    .orient("bottom");
	
	yAxis = d3.svg.axis()
	    .scale(yScale)
	    .orient("left");
	
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
	
	svg.append('g').selectAll('circle')
	.data(dataset)
	.enter()
		.append('circle')
		.attr('cx', function(d) {
			return xScale(d.timeStamp);
	    })
	    .attr('cy', function(d) {
	    	return yScale(d.jobName);
	    })
	    .attr('r', 3)
	    .style("fill", function(d) {
			return "#94AE0A";
		})
	    .style("stroke", function(d) {
			return "#94AE0A";
		})
	    .style("opacity", function(d) {
	    	if(d.alertGenerating === "true") {
				return 1;
	    	} else {
	    		return 0;
	    	}
		})
		.style("stroke-width", "1.5px")
		.append('title')
			.text(function(d) { return d.jobName;});
};

PubMatic.JobAnalysisProduct.Functions.getJobAnalysisCoOccurrenceAnalysisEffectTimeseriesPanel = function(panelId, streamName, effectJob, runData) {
	var dataset = [];
	var parseDate = d3.time.format(PubMatic.JobAnalysisProduct.Constants.TimestampFormat).parse;
	
	runData.forEach(function(eachData) {
		if(eachData.streamName.toLowerCase() == streamName.toLowerCase() && eachData.jobName.toLowerCase() === effectJob.toLowerCase()) {
			var temp = {};
			temp.jobName = '';
			temp.timeStamp = parseDate(eachData.startTime);
			temp.alertGenerating = eachData.alertStatus.toLowerCase();
			dataset.push(temp);
		}
	});
	
	var element = "#" + panelId + "-body";
	
	var margin, width, height, xScale, yScale, xAxis, yAxis, svg, parseDate;
	
	margin = {top: 20, right: 20, bottom: 30, left: 55};
	
	width = Number(d3.select(element).style("width").replace(/px$/, "")) - margin.left - margin.right;
	height = Number(d3.select(element).style("height").replace(/px$/, "")) - margin.top - margin.bottom;
	
	parseDate = d3.time.format(PubMatic.JobAnalysisProduct.Constants.TimestampFormat).parse;
	
	xScale = d3.time.scale().range([0, width]).domain(d3.extent(dataset, function(d) { return d.timeStamp; }));
	yScale = d3.scale.ordinal().rangeRoundBands([height, 0], 0.1).domain(dataset.map(function(d) { return d.jobName; }).unique());
	
	xAxis = d3.svg.axis()
	    .scale(xScale)
	    .orient("bottom");
	
	yAxis = d3.svg.axis()
	    .scale(yScale)
	    .orient("left");
	
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
	
	svg.append('g').selectAll('circle')
	.data(dataset)
	.enter()
		.append('circle')
		.attr('cx', function(d) {
			return xScale(d.timeStamp);
	    })
	    .attr('cy', function(d) {
	    	return yScale(d.jobName);
	    })
	    .attr('r', 3)
	    .style("fill", function(d) {
			return "#333333";
		})
	    .style("stroke", function(d) {
			return "#333333";
		})
	    .style("opacity", function(d) {
	    	if(d.alertGenerating === "true") {
				return 1;
	    	} else {
	    		return 0;
	    	}
		})
		.style("stroke-width", "1.5px")
		.append('title')
			.text(function(d) { return d.jobName;});
};