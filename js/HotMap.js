/*
HotMap.js!

This was made for Info 474's Visualization Software assignment.  It's generates a dataset and has some 
external functions to allow a user to use their own data and change settings.

*/


window.HotMap = (function() {
	
	
	var map = function(stringName) {
		//This is the different data we'll track about our data set throughout,
		// mainly we're tracking this much because we want to have user customizability
		var data = {}; 
		
		data.title = stringName; // title of the dataset, this doesn't actually do anything
		
		data.formattedMap = new Object(); // this will store the maps of strings to ints of months and dates to
										  // occurences- for example, October 21st with 64 occurences would store with
										  // a key of 10 21 and a value of 64.
		
		data.objects = []; // the dataset will stay here once it's been input but before the user has run processing
						   // on it (they might need to change format settings before processing, etc);
		
		
		// these can all user defined
		data.color = "purple";
		data.dateColumn;
		data.sub1;
		data.sub2;
		data.format;
		
		// we store these so we can access the min and max throughout HotMap
		data.dayMax = -Infinity;
		data.dayMin = Infinity;
		
		// these two values we store for rendering the chart
		data.cellSize = 17;
		data.months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

		
		////////////////////////////
		//// external functions ////
		////////////////////////////
		
		
		// all of these functions are exposed to the user and just allow the user to change 
		// the variables stores throughout the program
		
		data.changeName = function(newName) {
			this.title = newName;
			return this;
		}
		
		// returns the name of the current HotMap
		data.getName = function() {
			return this.title;
		}
		
		//returns the raw data in the current HotMap
		data.getData = function() {
			return this.objects;
		}
		
		// allows the user to change the name of the column that HotMap will look for dates in
		data.setDateColumn = function(dateColumn) {
			this.dateColumn = dateColumn;
			return this;
		}
		
		// allows the user to upload data or to change the data  to HotMap
		data.updateData = function(object) {
			this.objects = object;
			return this;
		}
		
		// allows the user to change where in the Date column HotMap will look for a date
		data.substrings = function(num1, num2) {
			this.sub1 = num1;
			this.sub2 = num2;
			return this;
		}

		// allows the user to change what color the HotMap will be drawn in
		data.setColor = function(stringColor) {
			this.color = stringColor;
			return this;
		}
		
		// This is the function that processes the data.  The dateString that's passed defines how d3 
		// will convert the strings into dates
		data.formatData = function(dateString) {
			var dateCol = this.dateColumn;
			data.format = d3.time.format(dateString);
			for (var i = 0; i < data.objects.length; i++) {
				// first we create a date from the string passed to ensure we have a generic form
				var dateFormatted = new Date(data.objects[i][dateCol].substring(this.sub1, this.sub2));
				
				// then we separate out the month and day to build the string to store the data
				var month = dateFormatted.getMonth();
				var day = dateFormatted.getDate();
				var dataString = "";
				dataString =  month + " " + day;
				
				// increase the count of occurences for the date that the data occured on
				if (data.formattedMap[dataString] == undefined) {
					data.formattedMap[dataString] = 1;
				} else {
					var newSize = data.formattedMap[dataString] + 1;
					if(newSize > data.dayMax) {
						data.dayMax = newSize;
					}
					data.formattedMap[dataString] = data.formattedMap[dataString] + 1;
				}
				data.objects[i][dateCol] = dateFormatted;
			}
			return this;
		}
		
		
		////////////////////////////
		//// internal functions ////
		////////////////////////////
		
		
		/* this function borrowed from Mike Bostock's Block 4063318
		** from https://bl.ocks.org/mbostock/4063318             */
		function monthPath(t0) {
			var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
				d0 = t0.getDay(), w0 = d3.time.weekOfYear(t0),
				d1 = t1.getDay(), w1 = d3.time.weekOfYear(t1);
			return "M" + (w0 + 1) * data.cellSize + "," + d0 * data.cellSize
				+ "H" + w0 * data.cellSize + "V" + 7 * data.cellSize
				+ "H" + w1 * data.cellSize + "V" + (d1 + 1) * data.cellSize
				+ "H" + (w1 + 1) * data.cellSize + "V" + 0
				+ "H" + (w0 + 1) * data.cellSize + "Z";
		}
		
		// this looks through the map to determine the amount of occurences for a specified month and day
		function returnValues(stringMonth, stringDate) {
			for (var i = 0; i < data.nestedData.length; i++) {
				if (data.nestedData[i].key == (stringMonth + " " + stringDate)) {
					return data.nestedData[i].values.length;
				}
			}
		}
		
		// enables us to use Objects like Maps (useful for keeping the formatted map!)
		function get(key) {
			return map[key];
		}
		
		// this converts a String that represents a full date into a genericized date, 
		// then it separates the month and day and creates a short date like we store
		// in formattedMap
		function returnShortDate(dateString) {
			var month = dateString.getMonth();
			var day = dateString.getDate();
			var val = data.formattedMap[month + " " + day];
			return val;
		}
		

		////////////////////////////
		////         THE        ////
		//// beast that is draw ////
		////////////////////////////
		
		
		// this is where the heatmap gets drawn.  It's a bit of a beast.
		
		data.draw = function() {
				// some very minor error checking- if something wrong, the user will know if they look at the console.  although
				// they won't know what the actual issue is, just that there's a couple things that could go bad.
				if (Object.keys(data.formattedMap).length == 0)  {
					console.log("Something's wrong!  There's a couple options of what that is:  you might not have formatted your data set in which case you would need to run .process() but if you've already called that and it didn't work you might not be passing the right measure string as a parameter.  Or your data just sucks.  ");
				}
				
				// keeps track of the margin from the side of the svg to the graph
		var margin =  {
				left: 70,
				bottom: 10,
				top: 50,
				right: 50
			};
			
			// this will determine and store the computed height and width of the graph
			// part of the svg
		var height = 200 - margin.bottom - margin.top;
		var width = 1200 - margin.left - margin.right;
		
		// the size (pixels) each day will be drawn
		var cellSize = 17;
		
		//sets the initial format of the dates (with how we store them after processing)
		var format = d3.time.format("%Y-%m-%d");
		
		// defines the equation to calculate what color each square should be
		var color = d3.scale.linear().range(["white", data.color])
					  .domain([0, data.dayMax])
					  
		//draw the svg inside the #vis div using the precalculated width and height
		var svg = d3.select("#vis").selectAll("svg")
					.data(d3.range(1900, 1901)) // only do one "year", these could be any dates
					.enter().append("svg")
					.attr("width", width)
					.attr("height", height)
					.attr("class", "svg")
					.append("g")
					.attr("transform", "translate(" + ((width - cellSize * 52) / 2 - 75) + "," + (height - cellSize * 7 - 1) + ")")			
	
		// adds all the tooltips (little messages the appear above the blocks showing date and value)
		var tooltip = d3.select("body").append("div")	
					.attr("class", "tooltip")				
					.style("opacity", 0)	
		
		// adds the labels to the axes
		svg.append("text")
			.attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
			.style("text-anchor", "middle")
			
			// selects the rectangles and defines them
			var rect = svg.selectAll(".day")
						.data(function(d) { 
							//creates a range of all 365 days in a year to check against the datasets
							// this is useful if a dataset doesn't have a full year of data, like
							// the all_month.csv dataset
							return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
						.enter().append("rect")
						.attr("class", "day")
						.attr("width", cellSize)
						.attr("height", cellSize)
						.attr("x", function(d) { return d3.time.weekOfYear(d) * cellSize; }) // calulates where to put each blocks
																							// based on week and predefined block size
						.attr("y", function(d) { return d.getDay() * cellSize; })
						.on('mouseover', function(d){
							// this is house we create the data in each tooltip from the data in each square-
							// take the data assigned to the square and parse it into how we store dayes
							var month =  parseInt(d.substring(5,7)) - 1;
							var day = parseInt(d.substring(8,10));
							var val = data.formattedMap[month + " " + day];
							
							tooltip.transition()		
								.duration(200)		
								.style("opacity", .9);		
							// define what the html inside the tooltip div will say- in our case the date and the number of occurences
							tooltip.html(data.months[month] + " " + day + ": " + val)	
								.style("left", (d3.event.pageX) + "px")		
								.style("top", (d3.event.pageY - 28) + "px");	
							})					
							// this will get rid of the tooltip
						.on("mouseout", function(d) {		
							tooltip.transition()		
								.duration(500)		
								.style("opacity", 0);	
				})
						.datum(format);
					
			// appends a legend to the div (which we will soon populate with the names of the months in a year)
			// based off the month and the predefined block size
			var legend = svg.selectAll(".legend")
			.data(data.months)
			.enter().append("g")
			.attr("class", "legend")
			.attr("transform", function(d, i) { 
				return "translate(" + (((i+1) * 50)+8) + ",0)"; });
			
			// define that what's in thoselegends is the name of a month
			legend.append("text")
					.attr("class", function(d, i) { return data.months[i] })
                    .text(function(d, i) { return data.months[i] })
                    .style("text-anchor", "end")
                    .attr("dy", "-.25em")
                    .attr("transform", function(d, i) { return "translate(" + cellSize*(i*1.5) + " ,0)"});
			
            // this adds the paths that mark the differences in months, using Ken Bostocks month path equation
            rect.append("title")
			.style("text-anchor", "end")
			.attr("dy", "-.75em")
			.text(function(d, i) { return data.months[i] })
			svg.selectAll(".month")
				.data(function(d) {
					return d3.time.months(new Date(d, 0, 1), new Date(d +1, 0, 1)); })
				.enter().append("path")
				.attr("class", "month")
				.attr("d", monthPath);
				
				
			// defines how the blocks should be colored based off dating the value of the block and 
			// running it through the color equation
			rect.style("fill", function(d) { 
					var month =  parseInt(d.substring(5,7)) - 1;
					var day = parseInt(d.substring(8,10));
					var val = data.formattedMap[month + " " + day];
					return color(val)
				})
				// defines the title of the blocks, which is useful when the user might be 
				// using web to speech accessibility technologies
				.select("title").text(function(d) {
					var month =  parseInt(d.substring(5,7)) - 1;
					var day = parseInt(d.substring(8,10));
					var val = data.formattedMap[month + " " + day];
					return day + ": # of data points: " + val})
		}      
		return data;
	}
	return map;
})();