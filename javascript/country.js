//function which can create two comparitive donut chart 
function country(csv){
	
	function drawCountry(data, svg,tipPosition){
		var color = d3.scaleOrdinal(d3.schemeCategory20b);
		//global variable analyze decide we want to a specific country or grouped countries 
		//create text area
		if(analyze === 0){
		var title = d3.select("#area")
					  .text(function(){return country_name+":"+explanation[data[0]["Area"]][data[0]["Question"]]});}
		else{
			var title = d3.select("#area")
					  .text(function(){return "Comparison Analysis"+":"+explanation[data[0]["Area"]][data[0]["Question"]]});
			var t = svg.append("g")
					   .attr("transform", 'translate(' + -50 + ',' + (-height/2 - 50 ) + ')')
					   .append("text")
					   .attr("font-size","18px")
					   .attr("x",-90)
					   .attr("y",25)
					   .text(function(){if (data[0]["Category"] === "Increase"){return "Countries Female has better Math Performance"}
										else{return "Countires Male has better Math Performance"}})		
		}
		
		// create donut chart
		var path = svg.selectAll("path")
					  .data(pie_scaler(data) )
					  .enter()
					  .append("path")
					  .attr("d", arc)
					  .attr("fill", function(d, i){
						return color(d.data.Gender +  ", "+ d.data.Answer );
					  })
					  .each(function(d) { this._current = d; }); 
		
		//create mouse event to see statistics in tooltip
		path.on('mouseover', function(d) {         
			var total = d3.sum(data.map(function(d) {
			return (d.enabled) ? d.number:0;
			}));
			
			var percent = Math.round(1000 * d.data.number / total) / 10;
			tooltip.select('.label').html(d.data.Gender + ", "+d.data.Answer);
			tooltip.select('.count').html(d.data.number);
			tooltip.select('.percent').html(percent + '%');
			tooltip.style('display', 'block');								
		});
		
		path.on('mouseout', function(d) {         
			tooltip.style('display', 'none');								
		});  
		
		path.on('mousemove', function(d) {
			tooltip.style('top', (d3.event.layerY +30) + 'px')
			.style('left', (d3.event.layerX +tipPosition) + 'px' );
		});
		
		//create legend and add event to change ratio
		var legend = svg.selectAll(".legend")
						.data(color.domain())
						.enter()
						.append("g")
						.attr("class","legend")
						.attr("transform", function(d, i){
							var height = legendRectSize + legendSpacing;
							var offset =  height * color.domain().length / 2;
							var horz = -3 * legendRectSize;
							var vert = i * height - offset;
							return 'translate(' + horz + ',' + vert + ')';
						})

		legend.append('rect')
			  .attr('width', legendRectSize)
			  .attr('height', legendRectSize)
			  .style('fill', color) 
			  .style('stroke', color)
			  .on("click", function(label){
				  var rect = d3.select(this);
				  var enabled = true;
				  var totalEnabled = d3.sum(data.map(function(d) {
					return (d.enabled) ? 1 : 0;
				  }));

				  if (rect.attr('class') === 'disabled') {
					rect.attr('class', '');
				  } else {
					if (totalEnabled < 2) return;
					rect.attr('class', 'disabled');
					enabled = false;
				  }
				  
				  pie_scaler.value(function(d) {
					if ( (d.Gender +  ", "+ d.Answer) === label) {
						d.enabled = enabled;}
					return (d.enabled) ? d.number : 0;
				  });
				  
				  path = path.data( pie_scaler(data) );
				
				  path.transition()
					.duration(750)
					.attrTween('d', function(d) {
					  var interpolate = d3.interpolate(this._current, d);
					  this._current = interpolate(0);
					  return function(t) {
						return arc(interpolate(t));
					  };
					});
			  })
  
		legend.append('text')
			  .attr('x', legendRectSize + legendSpacing)
			  .attr('y', legendRectSize - legendSpacing)
			  .text(function(d) { return d; });
		}	

	//function that get filtered data of particular question
	function getCountry(i, pie_name = null){
			if(pie_name){
				data = csv.filter(function(d){

					return d["Question"] === questions.values()[i] && d["Answer"] != "NA" })
					return data;
				}
			else{
				data = csv.filter(function(d){

					return  d["Question"] === i && d["Answer"] != "NA";
					})
					return data;
			}

	}
	
	//draw grouped data
	function drawAnalyze(data){
		
		dataIncreased = data.filter(function(d){debugger;return increasedCountry.has(d["Country"])});
		dataDecreased = data.filter(function(d){return !(increasedCountry.has(d["Country"])) });
		var answer = d3.set();
		dataIncreased.forEach(function(d){answer.add(d["Answer"])});
		var increaseNumber = 0;
		var decreaseNumber = 0;
		var g = ['Male','Female'];
		var leftData = [];
		var rightData = [];
		//get grouped data
		debugger;
		for (j in g){
			for(i in answer.values()){
			increaseNumber = 0;
			decreaseNumber = 0;
			dataIncreased.forEach(function(d){ if(d['Answer'] === answer.values()[i] & d['Gender'] === g[j]) {increaseNumber += d["number"]}    });
			dataDecreased.forEach(function(d){ if(d['Answer'] === answer.values()[i] & d['Gender'] === g[j]) {decreaseNumber += d["number"]}    });
			l ={
			Category:"Increase",
			Gender:g[j],
			Area:dataIncreased[0]['Area'],
			Question:dataIncreased[0]['Question'],
			Answer:answer.values()[i],
			number: increaseNumber,
			enabled : 1
			}
			debugger;
			leftData.push(l);
			r ={
			Answer:answer.values()[i],
			Category:"Decrease",
			Gender:g[j],
			Area:dataIncreased[0]['Area'],
			Question:dataIncreased[0]['Question'],
			
			number: decreaseNumber,
			enabled : 1
			}		

			rightData.push(r);
			}
		}
		drawCountry(leftData,svgMale,180);
		drawCountry(rightData,svgFemale,630);
	}	
		
		area_name = "Math Teaching";
		d3.select("#pie").selectAll("*").remove();
		d3.select("select").remove();
		questions = new d3.set();
		var tooltip = d3.select('#pie')            
						.append('div')                            
						.attr('class', 'tooltip');               
		tooltip.append('div')                       
			   .attr('class', 'label');                 

		tooltip.append('div')                       
			   .attr('class', 'count');                 

		tooltip.append('div')                        
			   .attr('class', 'percent'); 
		
		var donutWidth = 85;
		var width = 420;
		var height = 420;
		var radius = Math.min(width, height) / 2;
		var legendRectSize = 24;
		var legendSpacing = 6;
		
		var arc = d3.arc()
				.innerRadius(radius - donutWidth)
				.outerRadius(radius);

		var pie_scaler = d3.pie()
				.value(function(d){return d.number; })
				.sort(null)
		
		//create two svg
		var svgMale = d3.select("#pie")
					.append("svg")
					.attr("width", width)
					.attr("height", height+300)
					.style("position","relative")
					.style("top",50)
					.style("left",280)
					.append("g")
					.attr('transform', 'translate(' + (width / 2 ) +  ',' + (height / 2+50 ) + ')');		

		var svgFemale = d3.select("#pie")
						.append("svg")
						.attr("width", width+100)
						.attr("height", height +300)
						.style("position","relative")
						.style("top",50)
						.style("left",300)
						.append("g")
						.attr('transform', 'translate(' + (width / 2 +50) +  ',' + (height / 2 +50) + ')');				
				
		if (analyze === 0) {
			csv = csv.filter(function(d){return d["Country"] === country_name})
		}
			
		csv.forEach(function(d){
		if (d["Area"] === area_name){questions.add(d["Question"]);}
		d.enabled = true});	
		questionIndex = 0;
		data = getCountry(questionIndex,area_name);
		//draw country chart or grouped countries chart depending on analyze variable
		if (analyze === 0){
			dataFemale = data.filter(function(d){return d["Gender"] === "Female"});
			dataMale = data.filter(function(d){return d["Gender"] === "Male"});
			drawCountry(dataMale,svgMale,180);
			drawCountry(dataFemale,svgFemale,630);}
		else{
			drawAnalyze(data);
		}
		
		//append dropbox which can show question domain and question name
		var drop = d3.select("#drop")
						.append("select")	
		
		for (i in explanation[data[0]["Area"]]){
			drop.append("option")
				.text(explanation[ data[0]["Area"]][i] )
				.attr("value",i);
		}
			
		var areaDrop = d3.select("#areaDrop")
						.append("select");

		for (i in Object.keys(tip)) {
			areaDrop.append("option")
				.text(Object.keys(tip)[i])
				.attr("value",Object.keys(tip)[i])
				.attr("class","areaDrop");
		}				

		//add event to dropbox
		drop
		  .on("change", function(){
		   data = getCountry(d3.select(this).property('value'));
		   if (analyze === 0){
			   dataMale = data.filter(function(d){return d["Gender"] === "Male"});
			   dataFemale = data.filter(function(d){return d["Gender"] === "Female"});
			   d3.selectAll(".legend").remove();
				d3.selectAll("path").remove();
				drawCountry(dataMale,svgMale);
				drawCountry(dataFemale,svgFemale);
			}
			else{
			d3.selectAll(".legend").remove();
			d3.selectAll("path").remove();
			drawAnalyze(data);
			}
		})
		areaDrop
			.on("change", function(){
				area_name = d3.select(this).property("value");
				drop.selectAll("*").remove();
				for (i in explanation[area_name]){
					drop.append("option")
						.text(explanation[ area_name][i] )
						.attr("value",i);
				}			
			})



}



