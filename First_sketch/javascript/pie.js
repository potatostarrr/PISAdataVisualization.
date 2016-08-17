
function pie(csv){
d3.select("#pie").selectAll("*").remove();


function drawPie(data){
		var color = d3.scaleOrdinal(d3.schemeCategory20b);
		var title = d3.select("#area")
					  .text(function(){return explanation[data[0]["Area"]][data[0]["Question"]]     });
		
		
		svg.selectAll("p").remove();
		svg.selectAll("path").remove();
		svg.selectAll(".legend").remove();
		

		var path = svg.selectAll("path")
					  .data(pie_scaler(data) )
					  .enter()
					  .append("path")
					  .attr("d", arc)
					  .attr("fill", function(d, i){
						return color(d.data.Gender +  ", "+ d.data.Answer );
					  })
					  .each(function(d) { this._current = d; }); 

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
			tooltip.style('top', (d3.event.layerY + 10) + 'px')
			.style('left', (d3.event.layerX + 10) + 'px');
		});
		
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
			  .style('fill', color) //each element will pass its value to color scaler
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
	function getQuestion(i, pie_name = null){
		
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

	function interval(){
		var year_interval = setInterval(function(){
			questionIndex++;
			data = getQuestion(questionIndex,pie_name);
			drawPie(data);
			if (questionIndex >= questions.size()-1){	
				clearInterval(year_interval);
				d3.select("select")
				  .on("change", function(){
					   data = getQuestion(d3.select(this).property('value'));
					   debugger;
					   drawPie(data);
				  })



	
				}	
			},500);
		}

	var tooltip = d3.select('#pie')            // NEW
					.append('div')                             // NEW
					.attr('class', 'tooltip');                 // NEW

	tooltip.append('div')                        // NEW
		   .attr('class', 'label');                   // NEW

	tooltip.append('div')                        // NEW
		   .attr('class', 'count');                   // NEW

	tooltip.append('div')                        // NEW
		   .attr('class', 'percent');                 // NEW

	var donutWidth = 85;
	var width = 480;
	var height = 480;
	var radius = Math.min(width, height) / 2;
	var legendRectSize = 24;
	var legendSpacing = 6;


	var color = d3.scaleOrdinal(d3.schemeCategory20b);
	
	var svg = d3.select("#pie")
				.append("svg")
				.attr("width", width)
				.attr("height", height)
				.append("g")
				.attr('transform', 'translate(' + (width / 2) +  ',' + (height / 2) + ')');

	var arc = d3.arc()
				.innerRadius(radius - donutWidth)
				.outerRadius(radius);

	var pie_scaler = d3.pie()
				.value(function(d){return d.number; })
				.sort(null)
				
	
	
	
	//area = "Math Teaching"
	questions = new d3.set();
	debugger;
	csv.forEach(function(d){
	debugger;
		if (d["Area"] === pie_name){questions.add(d["Question"]);}
		d.enabled = true;   
		});


	
	
	questionIndex = 0;
	
	data = getQuestion(questionIndex,pie_name);
	
	d3.select("select").remove();
	var drop = d3.select("#drop")
					.append("select")
	
	for (i in explanation[data[0]["Area"]]){
		drop.append("option")
			.text(explanation[ data[0]["Area"]][i] )
			.attr("value",i);
	}

	
	drawPie(data);
	
	

	
	d3.select("select")
      .on("change", function(){
	   data = getQuestion(d3.select(this).property('value'));
	   debugger;
	   drawPie(data);
    })
	//interval();



}



