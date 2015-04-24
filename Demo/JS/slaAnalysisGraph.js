
PubMatic.JobAnalysisProduct.Functions.getJobAnalysisSLAAnalysisGraphPanel = function(panelId, jobName, jobSLAAnalysisGraphDashboardData) {
	
	var containerPanel = Ext.getCmp(panelId);
	
	containerPanel.removeAll();
	
	containerPanel.add([{
		id: 'jobAnalysisProductJobAnalysisSLAInputPanelId',
		xtype: 'panel',
		border: false,
		flex: 0.065,
		layout: 'fit'
	}, {
		id: 'jobAnalysisProductJobAnalysisSLAGraphPanelId',
		xtype: 'panel',
		flex: 0.935,
		layout: 'fit'
	}]);
	containerPanel.doLayout();
	
	var activeTab = Ext.getCmp('jobAnalysisProductJobAnalysisDetailsTabPanelId').getActiveTab();
	Ext.getCmp('jobAnalysisProductJobAnalysisSLAPanelId').show();
	Ext.getCmp('jobAnalysisProductJobAnalysisDetailsTabPanelId').setActiveTab(activeTab);
	
	var panel = Ext.getCmp('jobAnalysisProductJobAnalysisSLAInputPanelId');
	panel.removeAll();
	
	var searchField = Ext.create('Ext.form.field.Text', {
		xtype: 'textfield', 
		id: "jobAnalysisSLAInputPanelSeachFieldId",
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
        id: 'jobAnalysisSLAInputPanelFormId',
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
	
	var element = "#jobAnalysisProductJobAnalysisSLAGraphPanelId-body";
	
	var maxDepth = jobSLAAnalysisGraphDashboardData.maxDepth;
	var nodes = jobSLAAnalysisGraphDashboardData.nodes;
	var links = jobSLAAnalysisGraphDashboardData.links;
	
	var numberOfBusinessCriticalJobs = 0;
	nodes.forEach(function(eachNode) {
		if(eachNode.isBusinessCritical === 'true') {
			numberOfBusinessCriticalJobs++;
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
		tipContent += "<strong>Runtime (Sec):</strong> <span id='runTimeId'>100</span><br>";
		tipContent += "<strong>Start SLA:</strong> <span id='startSLAId'>100</span><br>";
		tipContent += "<strong>End SLA:</strong> <span id='endSLAId'>100</span><br>";
		
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
		    .data(["slaJobConnectionsMarkerId"])
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
			.text(numberOfBusinessCriticalJobs + ' critical jobs found in downstream.');
		
		var legendGroup = svg.append('g').attr('transform', "translate(" + (width-125) + ", 20)");
		
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
			.style('fill', '#9E0142');
		
		legendGroup.append('text')
			.text('Critical Job')
			.style("font", "Calibri")
	      	.style("font-weight", "bold")
	      	.style("font-size", "12px")
			.attr('x', 10)
			.attr('y', 19)
			.style('fill', '#9E0142');
		
		legendGroup.append('circle')
			.attr('cx', 0)
			.attr('cy', 30)
			.attr('r', 4)
			.style('fill', '#A0A0A0');
		
		legendGroup.append('text')
			.text('Impacted Job')
			.style("font", "Calibri")
	      	.style("font-weight", "bold")
	      	.style("font-size", "12px")
			.attr('x', 10)
			.attr('y', 34)
			.style('fill', '#A0A0A0');
	
		legendGroup.append('circle')
			.attr('cx', 0)
			.attr('cy', 45)
			.attr('r', 4)
			.style("opacity", 0.3)
			.style('fill', '#A0A0A0');
		
		legendGroup.append('text')
			.text('Unchanged Job')
			.style("font", "Calibri")
		  	.style("font-weight", "bold")
		  	.style("font-size", "12px")
		  	.style("opacity", 0.3)
			.attr('x', 10)
			.attr('y', 49)
			.style('fill', '#A0A0A0');
		
		// add the links and the arrows
		var path = svg.append("svg:g").selectAll("path")
		    .data(force.links())
		  .enter().append("svg:path")
		    .attr("class", "link")
		    .attr("marker-end", "url(#slaJobConnectionsMarkerId)")
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
		    	} else {
		    		if(d.isBusinessCritical === 'true') {
		    			return '#9E0142';
		    		} else {
	    				return "#A0A0A0";
		    		}
		    	}
		    })
		    .style("stroke", function(d) {
		    	if(d.name.toLowerCase() === jobName.toLowerCase()) {
		    		if(d.isBusinessCritical === 'true') {
		    			return '#9E0142';
		    		} else {
		    			return "#009DE6";
		    		}
		    	} else {
		    		if(d.isBusinessCritical === 'true') {
		    			return '#9E0142';
		    		} else {
		    			return "#A0A0A0";
		    		}
		    	}
		    })
		    .style("stroke-width", "1.5px")
		    .style("opacity", function(d) {
		    	if(d.startSLA === d.endSLA && (d.startSLA === '23:59:00' || d.startSLA === undefined) && d.name.toLowerCase() !== jobName.toLowerCase()) {
    				return 0.3;
    			} else {
    				return 1;
    			}
		    })
		    .on("mouseover", function(d, i) {

//		    	showDetailsOfThisNode(this, d, i);
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
				
				tip.select("#runTimeId")
			  		.text(d.runTime);
				
				tip.select("#startSLAId")
			  		.text(d.startSLA);
				
				tip.select("#endSLAId")
			  		.text(d.endSLA);
				
				//Show the tooltip
				tip.classed("hidden", false);
				
			})
			.on("mouseout", function() {
				//Hide the tooltip
				d3.select(element).select("#jobAnalysisGraphTooltipId").classed("hidden", true);
			})
		    .call(force.drag);
		
//				node.append('text')
//					.attr('x', -60)
//					.attr('y', -radius)
//					.style("font", "Calibri")
//			      	.style("font-weight", "bold")
//			      	.style("font-size", "10px")
//			      	.style("fill", 'blue')
//					.text(function(d) { return d.startSLA;});
//				
//				node.append('text')
//					.attr('x', -60)
//					.attr('y', radius)
//					.style("font", "Calibri")
//			      	.style("font-weight", "bold")
//			      	.style("font-size", "10px")
//			      	.style("fill", 'green')
//					.text(function(d) { return d.endSLA;});
//				
//				node.append('text')
//					.attr('x', -radius/2 - 2)
//					.attr('y', 3)
//					.style("font", "Calibri")
//			      	.style("font-weight", "bold")
//			      	.style("font-size", "10px")
//			      	.style("fill", 'white')
//					.text(function(d) { return d.runTime;});
//				
//				node.append('text')
//					.attr('x', radius+5)
//					.attr('y', 2)
//					.style("font", "Calibri")
//			      	.style("font-weight", "bold")
//			      	.style("font-size", "10px")
//					.text(function(d) { return d.name;});
		
//				node.append("title")
//			      .text(function(d) { return d.name; });
		
	
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
	    	var widthScale = d3.scale.linear().range([0, width-40]).domain([0, width]);
        	var sourceHeightScale = d3.scale.linear().range([(sourceNodeDepth-1)*(height/maxDepth), sourceNodeDepth*(height/maxDepth)]).domain([0, height]);
        	var targetHeightScale = d3.scale.linear().range([(targetNodeDepth-1)*(height/maxDepth), targetNodeDepth*(height/maxDepth)]).domain([0, height]);
        	var sourceY = sourceHeightScale(d.source.y) + (radius/2);
        	var targetY = targetHeightScale(d.target.y) - (radius/2);
        	var sourceX = widthScale(d.source.x) + (radius/2);
        	var targetX = widthScale(d.target.x) + (radius/2);
	        var dx = targetX - sourceX,
	            dy = targetY - sourceY,
	            dr = Math.sqrt(dx * dx + dy * dy);
	        return "M" + 
	        	sourceX + "," + 
	            sourceY + "L" + 
	            targetX + "," + 
	            targetY;
	    }).style("stroke", function(d) {
	    	if((d.source.startSLA === d.source.endSLA) && (d.source.startSLA === '23:59:00' || d.source.startSLA === undefined)) {
	    		return "#E4E4E4";
	    	} else if((d.target.startSLA === d.target.endSLA) && (d.target.startSLA === '23:59:00' || d.target.startSLA === undefined)) {
	    		return "#E4E4E4";
	    	} else {
	    		return "grey";
	    	}
	    });

	    node
	        .attr("transform", function(d) { 
	        	var nodeDepth = d.depth; 
	        	var widthScale = d3.scale.linear().range([0, width-40]).domain([0, width]);
	        	var heightScale = d3.scale.linear().range([(nodeDepth-1)*(height/maxDepth), nodeDepth*(height/maxDepth)]).domain([0, height]);
	            return "translate(" + widthScale(d.x) + "," + heightScale(d.y) + ")"; });
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
	    		return element.attr('r', radius).style("stroke", function(d) {
	    			if(d.name.toLowerCase() === jobName.toLowerCase()) {
			    		if(d.isBusinessCritical === 'true') {
			    			return '#9E0142';
			    		} else {
			    			return "#009DE6";
			    		}
			    	} else {
			    		if(d.isBusinessCritical === 'true') {
			    			return '#9E0142';
			    		} else {
			    			return "#A0A0A0";
			    		}
			    	}
	    		}).style("stroke-width", 1.5);
	    	}
	    });
	    
	}
		
};