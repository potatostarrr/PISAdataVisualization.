//json variable use to get question name and domain
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

tip = {
"Math Teaching":"This topic includes 5 questions. It's easy to find there is almost no difference between male and female in those answers which means teaching education don't cause different plausible value in mathematics between different genders.",
"Math Interest":"This topics includes 4 questions. The result shows that more male students have higher math interest than female students. This trend will increase in the area of strongly agree.",
"Math Anxiety":"This topic includes 5 questions. We can easily find more female students feel anxiety towards math. But unlike 'Math Interest', this trend is milder among different answer.",
"Math Self-Concept":"This topic reveal how students are confident to math. We can find female students more likely admit they have trouble in math. But we also can find the number of male students who get good math score is almost equal to the number of female students.",
"Math Intentions":"This topic includes 4 questions. Generally, male students will spend more time in math but this only have weakly impact to their choice of major or career. Instead, more female students will choose science related major rather than math.",
"Math Behaviour": "This topic include 8 questions. More female students have experience related to math with friends. But in the area of practically math skill, like programming or math competition, the number of male students is much more than the number of female students.  "
}




//create global variable used later
var analyze = 0;
var country_name = "China-Shanghai";
var show_slop = 1;
var show_pie = 0;
var pie_name = "Math Teaching";
var increasedCountry = d3.set();
//draw slop grap
d3.csv("score.csv",drawLine);
d3.select("#chart").style("z-index","11")

//add event to performance comparison button
d3.select("#slop")
  .on("click", function(d){
	if (!show_slop) {
	show_slop = 1;
	show_pie=0;
	d3.select("#chart").style("opacity", 1)
						.style("z-index",11);
	d3.select("#pie").style("opacity", 0);
	d3.select("#area").style("opacity", 0);
	d3.select("#drop").style("opacity", 0);
	d3.select("#tip").style("opacity", 0);
	d3.select("#areaDrop").selectAll("*").remove();
	
	}})

//function used in other button event
function question_click(){
	show_slop=0;
	d3.select("#chart").style("opacity", 0).style("z-index",0);;
	if (!show_pie){
	show_pie = 1;
	d3.select("#pie").style("opacity", 1);
	d3.select("#area").style("opacity", 1);
	d3.select("#drop").style("opacity", 1);
	d3.select("#tip").style("opacity", 1);
	d3.select("#areaDrop").selectAll("*").remove();
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

	




