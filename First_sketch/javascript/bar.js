function bar(csv){
	var margin = 20,
    width = 400 - margin,
    height = 200 - margin;
	var svg = d3.select("#chart")
            .append("svg")
              .attr("width", width + margin)
              .attr("height", height + margin)
            .append('g')
                .attr('class','chart');
	function drawBar(data){
		debugger;

		var myChart = new dimple.chart(svg, data);
		debugger;
		var x = myChart.addCategoryAxis("x", "Answer");
		  myChart.addCategoryAxis("c", "Gender");	
          myChart.addMeasureAxis("y", "number");
		  
		  
          myChart.addSeries(null, dimple.plot.bar);
		  //myChart.addSeries(null,dimple.plot.scatter);
		  //myChart.addSeries(null,dimple.plot.line);
          debugger;
		  myChart.draw();
	}	  
		  
	area = "Math Teaching"
	questions = new d3.set();
	genders = new d3.set();
	csv.forEach(function(d){
		if (d["Area"] === area){questions.add(d["Question"]);}
		genders.add(d["Gender"]);
		d.enabled = true;   
		});

	function getQuestion(i, area){
		data = csv.filter(function(d){
					return d["Question"] === questions.values()[i] && d["Answer"] != "NA" })
					return data;
		}
	questionIndex = 0;
	
	data = getQuestion(questionIndex,area);
	
	debugger;	drawBar(data);


}