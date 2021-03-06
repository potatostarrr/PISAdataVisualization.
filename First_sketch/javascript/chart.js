function drawLine(csv) {
	var data = [];
	
	var gender = csv.map(function(d){ return d['ST04Q01']})
	
	var labels =  d3.keys(csv[0])
	
	
	
	
	for(i=0;i<csv.length;i += 2){

		r={
		country : csv[i]["CNT"],
		female : csv[i]["meanScore"],
		male : csv[i+1]["meanScore"]
		}
		data.push(r);
	}

	var font_size = 15,
        margin = 10,
        width = 1000,
        height = labels.length * font_size*1.5 + margin
	
	var chart = d3.select("#chart").append("svg")
                   .attr("width", width)
                   .attr("height", 2500);
	
	var values = data
                      .map( function(d) { return d3.format(".1f")(d.male); })
                      .filter( function(d) { return d; } )
                      .concat(
                        data
                          .map( function(d) { return d3.format(".1f")(d.female); } )
                          .filter( function(d) { return d; } )
                      )
                      .sort()
                      .reverse(),
	
	
	
	//create scale
	slope = d3.scalePoint()
			  .domain(values)
			  .range([margin, height])
	
	var min_h_spacing = 1.1 * font_size, // 1.1 is standard font height:line space ratio
		previousY =  1.1 * font_size,
		thisY,
		additionalSpacing;
	
	data.forEach(function(d) {
		d.startY = slope(d3.format(".1f")(d.male)) +100;
		d.endY = slope(d3.format(".1f")(d.female)) +  100;
	});
	
	data
		.sort(function(a,b) {
			
			if (   ( d3.format(".1f")(a.female) == d3.format(".1f")(b.female) ))  return 0;
			return (a.female < b.female) ? -1 : +1;
		})
		.forEach(function(d) {
			thisY = d.endY; //position "suggestion"
			additionalSpacing = d3.max([0, d3.min([(min_h_spacing - (thisY - previousY)), min_h_spacing])]);
	
			//Adjust all Y positions lower than this end's original Y position by the delta offset to preserve slopes:
			data.forEach(function(dd) {
				if (dd.startY >= d.endY) dd.startY += additionalSpacing;
				if (dd.endY >= d.endY) dd.endY += additionalSpacing;
			});
		
			previousY = thisY;
		});
	
	previousY =  1.1 * font_size;
	data
		.sort(function(a,b) {
			if (   ( d3.format(".1f")(a.male) == d3.format(".1f")(b.male) ) )  return 0;
			return (a.male < b.male) ? -1 : +1;
		})
		.forEach(function(d) {
			thisY = d.startY; //position "suggestion"
			additionalSpacing = d3.max([0, d3.min([(min_h_spacing - (thisY - previousY)), min_h_spacing])]);
	
			//Adjust all Y positions lower than this start's original Y position by the delta offset to preserve slopes:
			data.forEach(function(dd) {
				if (dd.endY >= d.startY) dd.endY += additionalSpacing;
				if (dd.country != d.country && dd.startY >= d.startY) dd.startY += additionalSpacing;
			});
			previousY = thisY;
		});
	


	var subject = chart.selectAll('g.subject')
					   .data(data)
					   .enter()
					   .append('g')
					   .attr("class", "subject")
	
	
	subject
      .on("mouseover", function(d,i) { return d3.select(this).classed("over", true); })
      .on("mouseout", function(d,i) { return d3.select(this).classed("over", false); });
	
	label_format = function(value) { return d3.format(".1f")(value); },
	
	    // ** Left column
     subject
      .append("text")
      .classed("label start", true)
      .attr("x", 200)
      .attr("y", function(d) {return d.startY;})
      .attr("xml:space", "preserve")
      .style("font-size", font_size)
      .text(function(d) { return d.country+ " " + label_format(d.male); });

	 subject
      .append("text")
      .attr("x", 50)
      .attr("y", 50)
	  .style("font-size", 20)
      .text("Male(Region/Score)");
	
    // ** Right column
       subject
      .append("text")
      .classed("label end", true)
      .attr("x", width-200)
      .attr("y", function(d) {return d.endY;})
      .attr("xml:space", "preserve")
      .style("font-size", font_size)
      .text(function(d) { return label_format(d.female) + " " + d.country; });

	 subject
      .append("text")
      .attr("x", width-200)
      .attr("y", 50)
	  .style("font-size", 20)
      .text("Female(Region/Score)");

	subject
      .append("text")
      .attr("x", 300)
      .attr("y", 20)
	  .style("font-size", 28)
      .text("Slopegraph of Math Performance");
	
	
	
    // ** Slope lines
    var line = subject
      .append("line")
      .classed("slope", function(d) { return d.male || d.female; })
      .attr("x1", 210)
      .attr("x2", width-210)
      .attr("y1", function(d,i) {
        return d.male && d.female ? d.startY - font_size/2 + 2 : null;
      })
      .attr("y2", function(d,i) {
        return d.male && d.female ? d.endY - font_size/2 + 2 : null;
      })
	  .style("stroke",function(d,i){
		return "blue";
		});

	
	
    return chart;}