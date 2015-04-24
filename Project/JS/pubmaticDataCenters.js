
PubMatic.JobAnalysisProduct.Functions.getPubMaticDataCentersPanel = function(panelId, topology, dataCenterData) {
	
	var element = "#" + panelId + "-body",
		margin = {top: 0, right: 0, bottom: 0, left: 0}, 
		width, 
		height, 
		svg, 
		projection,
		path,
		graticule,
		gpoint,
		healthScale,
		sizeScale,
		colors = ['red', 'orange', 'green'];

	width = Number(d3.select(element).style("width").replace(/px$/, "")) - margin.left - margin.right;
	height = Number(d3.select(element).style("height").replace(/px$/, "")) - margin.top - margin.bottom;
	healthScale = d3.scale.quantile().domain([0, 100]).range(colors);
	sizeScale = d3.scale.quantile().domain([0, 100]).range([10, 4]);

	projection = d3.geo.mercator()
				    .scale((width + 1) / 2 / Math.PI)
				    .translate([width / 2, height / 2])
				    .precision(.1);

	// graticule = d3.geo.graticule();

	path = d3.geo.path()
	  .projection(projection);

	svg = d3.select(element).append("svg")
	  .attr("width", width)
	  .attr("height", height)
	  .style("background-color", "#222234");

	// svg.append("path")
	//     .datum(graticule)
	//     .attr("class", "graticule")
	//     .attr("d", path);
	
	svg.insert("path", ".graticule")
      .datum(topojson.feature(topology, topology.objects.land))
      .attr("class", "land")
      .attr("d", path);

  	svg.insert("path", ".graticule")
      .datum(topojson.mesh(topology, topology.objects.countries, function(a, b) { return a !== b; }))
      .attr("class", "boundary")
      .attr("d", path);

	// dataCenterData.forEach(function(server){

	gpoint = svg.append("g").attr("class", "gpoint");

	gpoint.selectAll("circle").data(dataCenterData)
		.enter()
		.append("circle")
	    .attr("cx", function (d) {
	    	return projection([d.longitude, d.latitude])[0];
	    })
	    .attr("cy", function (d) {
	    	return projection([d.longitude, d.latitude])[1];
	    })
	    .attr("class","point")
	    .attr("fill", function (d) {
	    	return healthScale(d.dcHealth);
	    })
	    .attr("stroke", "#0096D7")
	    .attr("stroke-width", 0)
	    .attr("r", 4)
	    .style("cursor", "pointer")
	    .on("click", function (thisDataCenter) {
	    	gpoint.selectAll("circle").attr("stroke", function (n) {
				if (thisDataCenter.id === n.id) {
					return "#FFFFFF";
				}
		    }).attr("stroke-width", function(n) {
				if (thisDataCenter.id === n.id) {
					return 2.0;
				} else {
					return 0;
				}
		    }).attr("r", function (n) {
				if (thisDataCenter.id === n.id) {
					return 6;
				} else {
					return 4;
				}
		    });

	    	PubMatic.JobAnalysisProduct.Functions.getPubMaticServersPanel('jobAnalysisProductViewInformationServersPanelId', thisDataCenter.id, thisDataCenter.dcName);
	    });

	gpoint.selectAll("text").data(dataCenterData)
		.enter().append("text")
	      .attr("x", function (d) {
				return projection([d.longitude, d.latitude])[0]+10;
			})
			.attr("y", function (d) {
				return projection([d.longitude, d.latitude])[1]+3;
			})
	      .attr("class","text")
	      .style("font", "Calibri")
	      .style("font-weight", "bold")
	      .style("font-size", "12px")
	      .text(function (d) {
	      		return d.dcName;
	      });

    // });
}