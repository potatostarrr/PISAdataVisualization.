function pie(csv) {
    //clear svg before drawing new data
    d3.select("#pie").selectAll("*").remove();

    //function that can be reuse to draw ring chart 
    function drawPie(data) {

        var color = d3.scaleOrdinal(d3.schemeCategory20b);

        //append title and description for different chart
        var title = d3.select("#area")
            .text(function() {
                return explanation[data[0]["Area"]][data[0]["Question"]]
            });
        svg.selectAll("p").remove();
        svg.selectAll("path").remove();
        svg.selectAll(".legend").remove();
        d3.select("#tip").selectAll("*").remove();
        d3.select("#tip")
            .append("p")
            .text(tip[data[0]["Area"]])
		//bind data with path, gender plus answer will decide color in the ring chart
        var path = svg.selectAll("path")
            .data(pie_scaler(data))
            .enter()
            .append("path")
            .attr("d", arc)
            .attr("fill", function(d, i) {
                return color(d.data.Gender + ", " + d.data.Answer);
            })
            .each(function(d) {
                this._current = d;
            });

        //add tooltip event to chart
        path.on('mouseover', function(d) {
            var total = d3.sum(data.map(function(d) {
                return (d.enabled) ? d.number : 0;
            }));
            var percent = Math.round(1000 * d.data.number / total) / 10;
            tooltip.select('.label').html(d.data.Gender + ", " + d.data
                .Answer);
            tooltip.select('.count').html(d.data.number);
            tooltip.select('.percent').html(percent + '%');
            tooltip.style('display', 'block');
        });

        path.on('mouseout', function(d) {
            tooltip.style('display', 'none');
        });

        path.on('mousemove', function(d) {
            tooltip.style('top', (d3.event.layerY + 10) + 'px')
                .style('left', (d3.event.layerX + 280) + 'px')
        });
		
		//bind all selected color with legend and transform the center
        var legend = svg.selectAll(".legend")
            .data(color.domain())
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) {
                var height = legendRectSize + legendSpacing;
                var offset = height * color.domain().length / 2;
                var horz = -3 * legendRectSize;
                var vert = i * height - offset;
                return 'translate(' + horz + ',' + vert + ')';
            })
            //add event to legend to change ratio
        legend.append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .style('fill', color)
            .style('stroke', color)
            .on("click", function(label) {
				//if there is only one color left, then don't do anything
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
				//change the way pie_scaler read the data
                pie_scaler.value(function(d) {
                    if ((d.Gender + ", " + d.Answer) === label) {
                        d.enabled = enabled;
                    }
                    return (d.enabled) ? d.number : 0;
                });
				//bind new data with path
                path = path.data(pie_scaler(data));
				//change ratio of ring chart
                path.transition()
                    .duration(750)
                    .attrTween('d', function(d) {
                        var interpolate = d3.interpolate(this._current,
                            d);
                        this._current = interpolate(0);
                        return function(t) {
                            return arc(interpolate(t));
                        };
                    });
            })
		//append description to legend
        legend.append('text')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize - legendSpacing)
            .text(function(d) {
                return d;
            });
    }
    //filter data with a specific question
    function getQuestion(i, pie_name = null) {
        if (pie_name) {
            data = csv.filter(function(d) {
                return d["Question"] === questions.values()[i] && d[
                    "Answer"] != "NA"
            })
            return data;
        } else {
            data = csv.filter(function(d) {
                return d["Question"] === i && d["Answer"] != "NA";
            })
            return data;
        }
    }
	
	//create tooltip in the pie svg
    var tooltip = d3.select('#pie')
        .append('div')
        .attr('class', 'tooltip')

    tooltip.append('div')
        .attr('class', 'label');

    tooltip.append('div')
        .attr('class', 'count');

    tooltip.append('div')
        .attr('class', 'percent');

    //create basic attribute variable and svg 
    var donutWidth = 85;
    var width = 480;
    var height = 480;
    var radius = Math.min(width, height) / 2;
    var legendRectSize = 24;
    var legendSpacing = 6;
	//using default d3 color scaler
    var color = d3.scaleOrdinal(d3.schemeCategory10b);
	//append svg
    var svg = d3.select("#pie")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("position", "relative")
        .style("top", 50)
        .style("left", 230)
        .append("g")
        .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) +
            ')');
	//arc will decide the width of ring chart
    var arc = d3.arc()
        .innerRadius(radius - donutWidth)
        .outerRadius(radius);
	//return number as value in pie scaler
    var pie_scaler = d3.pie()
        .value(function(d) {
            return d.number;
        })
        .sort(null)
	//get all unique questions for given question domain
    questions = new d3.set();
    csv.forEach(function(d) {

        if (d["Area"] === pie_name) {
            questions.add(d["Question"]);
        }
        d.enabled = true;
    });
	
    questionIndex = 0;
	//get the first question as default data
    data = getQuestion(questionIndex, pie_name);

    //adding event to dropbox
    d3.select("select").remove();
    var drop = d3.select("#drop")
        .append("select")

    for (i in explanation[data[0]["Area"]]) {
        drop.append("option")
            .text(explanation[data[0]["Area"]][i])
            .attr("value", i);
    }
    //draw chart
    drawPie(data);
	//when dropbox change, draw ring chart of different question
    drop
        .on("change", function() {
            data = getQuestion(d3.select(this).property('value'));

            drawPie(data);
        })

}