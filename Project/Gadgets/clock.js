
var VizGallery = {};
VizGallery.clock = {};

VizGallery.clock.getAnalogClock = function() {
	
	var analogClock = {};
	var dataset = [];
	var width, height, offsetX, offsetY, pi, scaleSecs, scaleMins, scaleHours, canvas, clockGroup, tickLabelGroup, clockLabelGroup, digitalGroup, hourArc, minuteArc, secondArc;;
	
	analogClock.render = function(element, time, title, radius) {
		
		var timeArray = time.split(':');
		var seconds = Number(timeArray[2]);
		var minutes = Number(timeArray[1]);
		var hours = Number(timeArray[0]) + minutes/60;
		
		dataset.push({
			unit: 'seconds',
			value: seconds
		});
		
		dataset.push({
			unit: 'minutes',
			value: minutes
		});
		
		dataset.push({
			unit: 'hours',
			value: hours
		});
		
		width = Number(d3.select(element).style("width").replace(/px$/, ""));
		height = Number(d3.select(element).style("height").replace(/px$/, ""));
		offsetX = width/2;
		offsetY = height/2;
		
		pi = Math.PI;
		scaleSecs = d3.scale.linear().domain([0, 59 + 999/1000]).range([0, 2 * pi]);
		scaleMins = d3.scale.linear().domain([0, 59 + 59/60]).range([0, 2 * pi]);
		scaleHours = d3.scale.linear().domain([0, 11 + 59/60]).range([0, 2 * pi]);
		
		canvas = d3.select(element)
				  	.append("svg")
				  	.attr("width", width)
				  	.attr("height", height);

		clockGroup = canvas.append("g");

		clockGroup.append("circle")
					.attr('cx', offsetX)
					.attr('cy', offsetY)
					.attr("r", radius)
					.attr("fill", "#94AE0A");

		clockGroup.append("circle")
					.attr('cx', offsetX)
					.attr('cy', offsetY)
				  	.attr("r", 4)
				  	.attr("fill", "black")
				    .attr("opacity", 0.8);
		
		tickLabelGroup = canvas.append("g").attr("transform", "translate(" + offsetX + "," + offsetY + ")");
		
		tickLabelGroup.selectAll("text")
		    .data(d3.range(12))
		    .enter()
		    	.append("text")
		    	.attr("x", function(d, i) {return ((radius - 10))*Math.cos(2*i*0.26-1.57); })
		    	.attr("y", function(d, i) {return 4+((radius - 10))*Math.sin(2*i*0.26-1.57); })
		    	.style('font', 'Calibri')
				.style('font-weight', 'bold')
				.style('font-size', '10px')
				.attr("fill", "black")
				.attr("opacity", 0.8)
				.attr("text-anchor", "middle")
				.text(function(d, i) { 
					if(d==0) 
						return 12;
		            else 
		            	return d;
		        });
		
		clockLabelGroup = canvas.append("g").attr("transform", "translate(" + offsetX + "," + offsetY + ")");
		
		clockLabelGroup
		     .append("text")
			    .style('font', 'Calibri')
				.style('font-weight', 'bold')
				.style('font-size', '12px')
			    .attr("x", 0)
			    .attr("y",radius+15)
			    .attr("fill", "black")
				.attr("opacity", 0.8)
			    .attr("text-anchor", "middle")
			    .text(title);

			
		digitalGroup = canvas.append("g").attr("transform", "translate(" + offsetX + "," + offsetY + ")");
		
		digitalGroup
		     .append("text")
		     	.style('font', 'Calibri')
				.style('font-weight', 'bold')
				.style('font-size', '12px')
				.attr("x", 0)
				.attr("y",-radius-5 )
				.attr("fill", "black")
				.attr("opacity", 0.8)
				.attr("text-anchor", "middle")
				.text(time);
		
		secondArc = d3.svg.arc()
					    .innerRadius(0)
					    .outerRadius(radius - 10)
					    .startAngle(function(d) {
					    	return scaleSecs(d.value);
					    })
					    .endAngle(function(d) {
					    	return scaleSecs(d.value);
					    });
		
		minuteArc = d3.svg.arc()
					    .innerRadius(0)
					    .outerRadius(radius - 10)
					    .startAngle(function(d) {
					    	return scaleMins(d.value);
					    })
					    .endAngle(function(d) {
					    	return scaleMins(d.value);
					    });
				
		hourArc = d3.svg.arc()
					    .innerRadius(0)
					    .outerRadius(radius - 30)
					    .startAngle(function(d) {
					    	return scaleHours(d.value % 12);
					    })
					    .endAngle(function(d) {
					    	return scaleHours(d.value % 12);
					    });
		
		clockGroup.selectAll('path')
				    .data(dataset)
				    .enter()
				    .append('path')
				    .attr('transform', "translate(" + offsetX + ", " + offsetY + ")")
				    .attr("d", function(d) {
				      if (d.unit === "seconds") {
				        return secondArc(d);
				      } else if (d.unit === "minutes") {
				        return minuteArc(d);
				      } else if (d.unit === "hours") {
				        return hourArc(d);
				      }
				    })
				    .attr("stroke", "black")
				    .attr("stroke-opacity", 0.8)
				    .attr("stroke-width", function(d) {
				      if (d.unit === "seconds") {
				        return 1;
				      } else if (d.unit === "minutes") {
				        return 2;
				      } else if (d.unit === "hours") {
				        return 2;
				      }
				    })
				    .attr("fill", "none");
	}
	
	analogClock.update = function(time) {
		
		dataset = [];
		
		var timeArray = time.split(':');
		var seconds = Number(timeArray[2]);
		var minutes = Number(timeArray[1]);
		var hours = Number(timeArray[0]) + minutes/60;
		
		dataset.push({
			unit: 'seconds',
			value: seconds
		});
		
		dataset.push({
			unit: 'minutes',
			value: minutes
		});
		
		dataset.push({
			unit: 'hours',
			value: hours
		});
		
		digitalGroup.select('text')
			.transition()
			.duration(1000)
			.text(time);
		
		clockGroup.selectAll('path')
		    .data(dataset)
		    .transition()
			.duration(1000)
		    .attr("d", function(d) {
		    	if (d.unit === "seconds") {
		    		return secondArc(d);
			    } else if (d.unit === "minutes") {
			        return minuteArc(d);
			    } else if (d.unit === "hours") {
			        return hourArc(d);
			    }
		    });
	}
	
	return analogClock;
}