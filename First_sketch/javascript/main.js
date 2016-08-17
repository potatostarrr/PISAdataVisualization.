explanation = {
"Math Teaching":
{
"ST77Q01" : "Math Teaching - Teacher shows interest",
"ST77Q02" : "Math Teaching - Extra help",
"ST77Q04" : "Math Teaching - Teacher helps",
"ST77Q05" : "Math Teaching - Teacher continues",
"ST77Q06" : "Math Teaching - Express opinions"
},
"Math Interest":{
"ST29Q01" : "Math Interest - Enjoy Reading",
"ST29Q03" : "Math Interest - Look Forward to Lessons",
"ST29Q04" : "Math Interest - Enjoy Maths",
"ST29Q06" : "Math Interest - Interested"
},
"Math Anxiety":{
"ST42Q01":"Math Anxiety - Worry That It Will Be Difficult",
"ST42Q03":"Math Anxiety - Get Very Tense",
"ST42Q05":"Math Anxiety - Get Very Nervous",
"ST42Q08":"Math Anxiety - Feel Helpless",
"ST42Q10":"Math Anxiety - Worry About Getting Poor <Grades>"
},
"Math Self-Concept":{
"ST42Q02":"Math Self-Concept - Not Good at Maths",
"ST42Q04":"Math Self-Concept- Get Good <Grades>",
"ST42Q06":"Math Self-Concept - Learn Quickly",
"ST42Q07":"Math Self-Concept - One of Best Subjects",
"ST42Q09":"Math Self-Concept - Understand Difficult Work"
},
"Math Intentions":{
"ST48Q01":"Math Intentions - Mathematics vs. Language Courses After School",
"ST48Q02":"Math Intentions - Mathematics vs. Science Related Major in College",
"ST48Q03":"Math Intentions - Study Harder in Mathematics vs. Language Classes",
"ST48Q04":"Math Intentions - Take Maximum Number of Mathematics vs. Science Classes",
"ST48Q05":"Math Intentions - Pursuing a Career That Involves Mathematics vs. Science"
},
"Math Behaviour":{
"ST49Q01":"Math Behaviour - Talk about Maths with Friends",
"ST49Q02":"Math Behaviour - Help Friends with Maths",
"ST49Q03":"Math Behaviour - <Extracurricular> Activity",
"ST49Q04":"Math Behaviour - Participate in Competitions",
"ST49Q05":"Math Behaviour - Study More Than 2 Extra Hours a Day",
"ST49Q06":"Math Behaviour - Play Chess",
"ST49Q07":"Math Behaviour - Computer programming",
"ST49Q09":"Math Behaviour - Participate in Math Club"
}
}


/*&
d3.csv("queationaire.csv", function(d){
d["number"] = +d["number"];
return d},pie)
*/
var show_slop = 1;
var show_pie = 0;
var pie_name = "Math Teaching";
d3.csv("score.csv",drawLine);


d3.select("#slop")
  .on("click", function(d){
	if (!show_slop) {
	show_slop = 1;
	show_pie=0;
	d3.select("#chart").style("opacity", 1);
	d3.select("#pie").style("opacity", 0);
	d3.select("#area").style("opacity", 0);
	d3.select("#drop").style("opacity", 0);
	}})


function question_click(){
	show_slop=0;
	d3.select("#chart").style("opacity", 0);
	if (!show_pie){
	show_pie = 1;
	d3.select("#pie").style("opacity", 1);
	d3.select("#area").style("opacity", 1);
	d3.select("#drop").style("opacity", 1);
	}
	d3.csv("queationaire.csv", function(dd){
	dd["number"] = +dd["number"];
	return dd},pie)

}

d3.select("#teach")
  .on("click", function(d){
	pie_name = d3.select(this).text();
	question_click();
	})

d3.select("#interest")
  .on("click", function(d){
	pie_name = d3.select(this).text();
	question_click();
	})

d3.select("#anxiety")
  .on("click", function(d){
	pie_name = d3.select(this).text();
	question_click();
	})

d3.select("#concept")
  .on("click", function(d){
	pie_name = d3.select(this).text();
	question_click();
	})

d3.select("#intentions")
  .on("click", function(d){
	pie_name = d3.select(this).text();
	question_click();
	})

d3.select("#behaviour")
  .on("click", function(d){
	pie_name = d3.select(this).text();
	question_click();
	})

	





