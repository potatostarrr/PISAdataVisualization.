function drawLine(csv) {
	//create json data for slop graph 
	var data = [];
	var gender = csv.map(function(d){ return d['ST04Q01']})
	var labels =  d3.keys(csv[0])

	for(i=0;i<csv.length;i += 2){
		r={
		oecd : csv[i]["OECD"],
		country : csv[i]["CNT"],
		female : csv[i]["meanScore"],
		male : csv[i+1]["meanScore"]
		}
		data.push(r);
	}

	var font_size = 15,
        margin = 10,
        width = 1000,
        height = labels.length * font_size*1.5 + margin;
	
	var chart = d3.select("#chart").append("svg")
                   .attr("width", width)
                   .attr("height", 2500);
	//get values of math score then sort them			   
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
	
	var min_h_spacing = 1.1 * font_size, 
		previousY =  1.1 * font_size,
		thisY,
		additionalSpacing;
	
	//add start and end postion in json data
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
      .text(function(d) { return d.country+ " " + label_format(d.male); })
	  .on("click",function(d){
	    analyze = 0;
		show_slop=0;
		d3.select("#chart").style("opacity", 0)
							.style("z-index",0);
		d3.select("#pie").style("opacity", 1);
		d3.select("#area").style("opacity", 1);
		d3.select("#drop").style("opacity", 1);
		d3.select("#areaDrop").selectAll("*").remove();
		length =  d3.select(this).text().length;
		country_name = d3.select(this).text().substring(0,length-6);
		d3.csv("data.csv", function(dd){
		dd["number"] = +dd["number"];
		return dd},country)
		});

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
      .attr("x", width-300)
      .attr("y", function(d) {return d.endY;})
      .attr("xml:space", "preserve")
      .style("font-size", font_size)
      .text(function(d) { return label_format(d.female) + " " + d.country; })
	    .on("click",function(d){ //add click event
	    analyze = 0;
		show_slop=0;
		d3.select("#chart").style("opacity", 0)
							.style("z-index",0);
		d3.select("#pie").style("opacity", 1);
		d3.select("#area").style("opacity", 1);
		d3.select("#drop").style("opacity", 1);
		d3.select("#areaDrop").selectAll("*").remove();
		length =  d3.select(this).text().length;
		country_name = d3.select(this).text().substring(6,length+1);
		d3.csv("data.csv", function(dd){
		dd["number"] = +dd["number"];
		return dd},country)
		});

	 subject
      .append("text")
      .attr("x", width-300)
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
      .attr("x2", width-310)
      .attr("y1", function(d,i) {
        return d.male && d.female ? d.startY - font_size/2 + 2 : null;
      })
      .attr("y2", function(d,i) {
        return d.male && d.female ? d.endY - font_size/2 + 2 : null;
      })
	  .style("stroke",function(d,i){
		if (d.male >d.female){
			return "lightblue";
			}
		else {increasedCountry.add(d.country);return "red";}
		});
	// add legend of line color
	
	var legend = chart
				.selectAll(".legend")
				.data(["Increase","Decrease"])
				.enter()
				.append("g")
				.attr("class","legend")
				.attr("transform", function(d, i){
					var horz = width-150;
					var vert = i*30+60;
					return 'translate(' + horz + ',' + vert + ')';
				})

	legend.append("rect")
		  .attr("width",40)
		  .attr("height",20)
		  .style("position","absolute")
		  .style("fill",function(d){if(d==="Increase"){return "red"}else{return"lightblue"} })
	legend.append("text")
		  .attr("x",40)
		  .attr("y",15)
		  .text(function(d){return d})

	// add Analyze button in svg
	var b = chart
		  .append("g")
		  .attr("class","button")
		  .attr("transform", 'translate(' + 890 + ',' + 150 + ')')
		  .style("fill","#eee")
		  .style("font-size","30px")
	var t = b.append("text")
			  .text("Analyze");
		button()
	  .container(b)
	  .text(t)
	  .count(0)
	  .cb(function() { 
			analyze = 1;
			d3.select("#chart").style("opacity", 0)
							.style("z-index",0);
			d3.select("#pie").style("opacity", 1);
			d3.select("#area").style("opacity", 1);
			d3.select("#drop").style("opacity", 1);
			d3.csv("data.csv", function(dd){
			dd["number"] = +dd["number"];
			return dd},country)
			
		})();
	
    return chart;}