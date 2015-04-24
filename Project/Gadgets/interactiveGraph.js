
var InteractiveGraph = {};

InteractiveGraph.RadialPalcement = function() {
	
	var center, current, increment, place, placement, radialLocation, radius, setKeys, start, values;
	values = d3.map();
	increment = 20;
	radius = 200;
	center = {
		"x": 0,
		"y": 0
	};
	start = -120;
	current = start;
	
	function radialLocation(center, angle, radius) {
		var x, y;
		x = center.x + radius * Math.cos(angle * Math.PI / 180);
		y = center.y + radius * Math.sin(angle * Math.PI / 180);
		return {
			"x": x,
			"y": y
		};
	}
	
	placement = function(key) {
		var value;
		value = values.get(key);
		if (!values.has(key)) {
			value = place(key);
		}
		return value;
	};
	
	function place(key) {
		var value;
		value = radialLocation(center, current, radius);
		values.set(key, value);
		current += increment;
		return value;
	}
	
	function setKeys(keys) {
		var firstCircleCount, firstCircleKeys, secondCircleKeys;
		values = d3.map();
		firstCircleCount = 360 / increment;
		if (keys.length < firstCircleCount) {
			increment = 360 / keys.length;
		}
		firstCircleKeys = keys.slice(0, firstCircleCount);
		firstCircleKeys.forEach(function(k) {
			return place(k);
		});
		secondCircleKeys = keys.slice(firstCircleCount);
		radius = radius + radius / 1.8;
		increment = 360 / secondCircleKeys.length;
		return secondCircleKeys.forEach(function(k) {
			return place(k);
		});
	}
	
	placement.keys = function(_) {
		if (!arguments.length) {
			return d3.keys(values);
		}
		setKeys(_);
		return placement;
	};
	placement.center = function(_) {
		if (!arguments.length) {
			return center;
		}
		center = _;
		return placement;
	};
	placement.radius = function(_) {
		if (!arguments.length) {
			return radius;
		}
		radius = _;
		return placement;
	};
	placement.start = function(_) {
		if (!arguments.length) {
			return start;
		}
		start = _;
		current = start;
		return placement;
	};
	placement.increment = function(_) {
		if (!arguments.length) {
			return increment;
		}
		increment = _;
		return placement;
	};
	return placement;
};

InteractiveGraph.getGraph = function(bodyElement, dataJson) {
	
	var width, height, canvas, graph, nodesG, linksG, linkedByIndex, layout, filter, allData, currentLinksData, currentNodesData, node, link, force, sort, charge, groupCenters;
	
	linkedByIndex = {};
	layout = "force";
	filter = "all";
	groupCenters = null;
	sort = "";
	charge = function(node) {
	    return -Math.pow(node.radius, 2.0) / 2;
	};
	graph = {};
	allData = [];
	currentLinksData = [];
	currentNodesData = [];
	node = null;
	link = null;
	force = d3.layout.force();
	
	graph.render = function(bodyElement, dataJson) {
		width = d3.select(bodyElement).style("width").replace(/px$/, "");
		height = d3.select(bodyElement).style("height").replace(/px$/, "");
		canvas = d3.select(bodyElement).append("svg").attr("width", width).attr("height", height);
		nodesG = canvas.append("g").attr("id", "nodes");
		linksG = canvas.append("g").attr("id", "links");
		force.size([width, height]);
		
		allData = generateDataForGraph(dataJson);
		setLayoutForGraph("force");
		setFilterForGraph("all");
		
		updateGraph();
	};
	
	graph.toggleLayout = function(newLayout) {
	    force.stop();
	    setLayoutForGraph(newLayout);
	    updateGraph();
	};
	  
	graph.toggleFilter = function(newFilter) {
	    force.stop();
	    setFilterForGraph(newFilter);
	    updateGraph();
	};

	graph.toggleSort = function(newSort) {
	    force.stop();
	    setSortForGraph(newSort);
	    updateGraph();
	};

	graph.updateData = function(newData) {
	    allData = generateDataForGraph(newData);
	    link.remove();
	    node.remove();
	    updateGraph();
	};
	
	graph.updateGraphForSearchedTerm = function(searchTerm) {
		var searchRegEx;
	    searchRegEx = new RegExp(searchTerm.toLowerCase());
	    
	    node.each(function(d) {
	    	var element, match;
	    	element = d3.select(this);
	    	match = d.name.toLowerCase().search(searchRegEx);
	    	if (searchTerm.length > 0 && match >= 0) {
	    		element.style("fill", "#009DE6").style("stroke-width", 2.0).style("stroke", "#555");
	    		return d.searched = true;
	    	} else {
	    		d.searched = false;
	    		return element.style("fill", function(d) {
	    			return "#94AE0A";
	    		}).style("stroke-width", 1.0);
	    	}
	    });
	};
	
	function generateDataForGraph(data) {
		var circleRadius, countExtent, nodesMap;
		
	    countExtent = d3.extent(data.nodes, function(d) {
	      return d.jobCount;
	    });
	    
	    circleRadius = d3.scale.sqrt().range([3, 15]).domain(countExtent);
	    
	    data.nodes.forEach(function(n) {
	      var randomnumber;
	      n.x = randomnumber = Math.floor(Math.random() * width);
	      n.y = randomnumber = Math.floor(Math.random() * height);
	      return n.radius = 3; //n.radius = circleRadius(n.jobCount);
	    });
	    
	    nodesMap = createMapOfNodes(data.nodes);
	    
	    data.links.forEach(function(l) {
	      l.source = nodesMap.get(l.source);
	      l.target = nodesMap.get(l.target);
	      return linkedByIndex["" + l.source.id + "," + l.target.id] = 1;
	    });
	    
	    return data;
	}
	
	function createMapOfNodes(nodes) {
	    var nodesMap;
	    
	    nodesMap = d3.map();
	    
	    nodes.forEach(function(n) {
	      return nodesMap.set(n.id, n);
	    });
	    
	    return nodesMap;
	}
	
	function setLayoutForGraph(newLayout) {
	    layout = newLayout;
	    if (layout === "force") {
	      return force.on("tick", forceTick).charge(-15).linkDistance(50);
	    } else if (layout === "radial") {
	      return force.on("tick", radialTick).charge(charge);
	    }
	}
	
	function setFilterForGraph(newFilter) {
	    filter = newFilter;
	}
	
	function setSortForGraph(newSort) {
	    sort = newSort;
	}
	
	function forceTick(event) {
		
	    node.attr("cx", function(d) {
	    	return d.x;
	    }).attr("cy", function(d) {
	    	return d.y;
	    });
	    
	    link.attr("x1", function(d) {
	      return d.source.x;
	    }).attr("y1", function(d) {
	    	return d.source.y;
	    }).attr("x2", function(d) {
	      return d.target.x;
	    }).attr("y2", function(d) {
	    	return d.target.y;
	    });
	}

	function radialTick(e) {
	    node.each(moveToRadialLayout(e.alpha));
	    
	    node.attr("cx", function(d) {
	      return d.x;
	    }).attr("cy", function(d) {
	      return d.y;
	    });
	    
	    if (e.alpha < 0.03) {
	      force.stop();
	      updateLinksForGraph();
	    }
	}
	
	function moveToRadialLayout(alpha) {
	    var k;
	    k = alpha * 0.1;
	    return function(d) {
	    	var centerNode;
	    	centerNode = groupCenters(d.artist);
	    	d.x += (centerNode.x - d.x) * k;
	    	return d.y += (centerNode.y - d.y) * k;
	    };
	}
	
	function updateGraph() {
	    var nodes;
	    currentNodesData = filterNodes(allData.nodes);
	    currentLinksData = filterLinks(allData.links, currentNodesData);
	    
	    if (layout === "radial") {
	    	nodes = sortedKeys(currentNodesData, currentLinksData);
	    	updateCenters(nodes);
	    }
	    force.nodes(currentNodesData);
	    updateNodesForGraph();
	    if (layout === "force") {
	      force.links(currentLinksData);
	      updateLinksForGraph();
	    } else {
	      force.links([]);
	      if (link) {
	        link.data([]).exit().remove();
	        link = null;
	      }
	    }
	    force.start();
	}
	
	function nodeCounts(nodes, attr) {
	    var counts;
	    counts = {};
	    nodes.forEach(function(d) {
	    	var _name, _ref;
	    	if ((_ref = counts[_name = d[attr]]) == null) {
	    		counts[_name] = 0;
	    	}
	    	return counts[d[attr]] += 1;
    	});
    	return counts;
	}
	
	function sortedKeys(nodes, links) {
	    var allKeys, counts;
	    allKeys = [];
	    if (sort === "links") {
	    	counts = {};
	    	links.forEach(function(l) {
	    		var _name, _name1, _ref, _ref1;
	    		if ((_ref = counts[_name = l.source.artist]) == null) {
	    			counts[_name] = 0;
	    		}
	    		counts[l.source.artist] += 1;
	    		if ((_ref1 = counts[_name1 = l.target.artist]) == null) {
	    			counts[_name1] = 0;
	    		}
	    		return counts[l.target.artist] += 1;
	    	});
	    	nodes.forEach(function(n) {
	    		var _name, _ref;
	    		return (_ref = counts[_name = n.artist]) != null ? _ref : counts[_name] = 0;
	    	});
	    	allKeys = d3.entries(counts).sort(function(a, b) {
	    		return b.value - a.value;
	    	});
	    	allKeys = allKeys.map(function(v) {
	    		return v.key;
	    	});
	    } else {
	    	counts = nodeCounts(nodes, "type");
	    	allKeys = d3.entries(counts).sort(function(a, b) {
	    		return b.value - a.value;
	    	});
	    	allKeys = allKeys.map(function(v) {
	    		return v.key;
	    	});
	    }
	    return allKeys;
	}
	
	function updateCenters(allKeys) {
	    if (layout === "radial") {
	    	return groupCenters = InteractiveGraph.RadialPalcement().center({
	    		"x": width / 2,
	    		"y": height / 2 - 100
	    	}).radius(300).increment(18).keys(allKeys);
	    }
	}
	
	function filterNodes(allNodes) {
	    var filteredNodes;
	    filteredNodes = allNodes;
	    if (filter === "business_critical") {
	      filteredNodes = allNodes.filter(function(n) {
	          return n.doesContainCriticalJob;
	      });
	    }
	    return filteredNodes;
	}

	function filterLinks(allLinks, curNodes) {
	    curNodes = createMapOfNodes(curNodes);
	    return allLinks.filter(function(l) {
	    	return curNodes.get(l.source.id) && curNodes.get(l.target.id);
	    });
	}
	
	function updateNodesForGraph() {
		
	    node = nodesG.selectAll("circle.node").data(currentNodesData, function(d) {
	    	return d.id;
	    });
	    
	    node.enter().append("circle").attr("class", "node").attr("cx", function(d) {
	    	return d.x;
	    }).attr("cy", function(d) {
	    	return d.y;
	    }).attr("r", function(d) {
	    	return d.radius;
	    }).style("fill", function(d) {
	    		return fillForNode(d);
	    }).style("stroke", function(d) {
	    		return strokeForNode(d);
	    }).style("stroke-width", 1.0);
	    
	    node.append("title")
			.text(function(d) { return d.name;});
	    
	    node.on("mouseover", function(d,i) {
	    	showDetailsOfThisNode(this, d,i);
	    }).on("mouseout", hideDetailsOfThisNode)
	    .on('click', serviceNodeClickHandler);
	    
	    node.exit().remove();
	}

	function updateLinksForGraph() {
		
	    link = linksG.selectAll("line.link").data(currentLinksData, function(d) {
	    	return "" + d.source.id + "_" + d.target.id;
	    });
	    
	    link.enter().append("line").attr("class", "link").attr("stroke", "#ddd").attr("stroke-opacity", 1).attr("x1", function(d) {
	    	return d.source.x;
	    }).attr("y1", function(d) {
	    	return d.source.y;
	    }).attr("x2", function(d) {
	    	return d.target.x;
	    }).attr("y2", function(d) {
	    	return d.target.y;
	    });
	    
	    link.exit().remove();
	}

	function showDetailsOfThisNode(thisNode, d, i) {
		if (link) {
	    	link.attr("stroke", function(l) {
	    		if (l.source === d || l.target === d) {
	    			return "#555";
	    		} else {
	    			return "#ddd";
	    		}
	    	}).attr("stroke-opacity", function(l) {
	    		if (l.source === d || l.target === d) {
	    			return 1.0;
	    		} else {
	    			return 0.5;
	    		}
	    	});
	    }
	    
	    node.style("stroke", function(n) {
	    	if (n.searched || areTheyNeighbouring(d, n)) {
	    		return "#555";
	    	} else {
	    		return strokeForNode(n);
	    	}
	    }).style("stroke-width", function(n) {
	    	if (n.searched || areTheyNeighbouring(d, n)) {
	    		return 2.0;
	    	} else {
	    		return 1.0;
	    	}
	    });
	    
	    d3.select(thisNode).style("stroke", "black").style("stroke-width", 2.0);
	}
	
	function areTheyNeighbouring(a, b) {
	    return linkedByIndex[a.id + "," + b.id] || linkedByIndex[b.id + "," + a.id];
	}

	function hideDetailsOfThisNode(d, i) {
	    node.style("stroke", function(n) {
	    	if (!n.searched) {
	    		return strokeForNode(n);
	    	} else {
	    		return "#555";
	    	}
	    }).style("stroke-width", function(n) {
	    	if (!n.searched) {
	    		return 1.0;
	    	} else {
	    		return 2.0;
	    	}
	    });
	    
	    if (link) {
	    	link.attr("stroke", "#ddd").attr("stroke-opacity", 0.8);
	    }
	}
	
	function strokeForNode(d) {
		return "#94AE0A";
	}
	
	function fillForNode(d) {
		return "#94AE0A";
	}

	function serviceNodeClickHandler(data) {
		alert(data.toSource());
	}
	
	return graph;
};