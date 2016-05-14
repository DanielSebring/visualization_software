window.HotMap = (function() {
	var map = function(stringName) {
		var data = {};
		data.formattedMap = new Object();
		data.title = stringName;
		data.objects = [];
		data.color = "purple";
		data.dateColumn;
		data.sub1;
		data.sub2;
		data.dayMax = -Infinity;
		data.dayMin = Infinity;
		data.cellSize = 17;
		data.months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		
		////////////////////////////
		//// external functions ////
		////////////////////////////
		
		data.changeName = function(newName) {
			this.title = newName;
			return this;
		}
		
		data.getName = function() {
			return this.title;
		}
		
		data.getData = function() {
			return this.objects;
		}
		
		data.dateColumn = function(dateName) {
			this.dateColumn = dateName;
			return this;
		}
		
		data.updateData = function(object) {
			this.objects = object;
			return this;
		}
		
		data.process = function(newObjects) {
			this.objects = newObjects;
			return this;
		}
		
		data.substrings = function(num1, num2) {
			this.sub1 = num1;
			this.sub2 = num2;
			return this;
		}
		
		data.setDateColumn = function(dateColumn) {
			this.dateColumn = dateColumn;
			return this;
		}
		
		data.setColor = function(stringColor) {
			this.color = stringColor;
			return this;
		}
		
		
		data.formatData = function(dateString) {
			var dateCol = this.dateColumn;
			data.format = d3.time.format(dateString);
			for (var i = 0; i < data.objects.length; i++) {
				console.log(data.objects);
				console.log(i);
				var dateFormatted = new Date(data.objects[i][dateCol].substring(this.sub1, this.sub2));
				var month = dateFormatted.getMonth();
				var day = dateFormatted.getDate();
				var dataString = "";
				dataString =  month + " " + day;
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
		
		function returnValues(stringMonth, stringDate) {
			for (var i = 0; i < data.nestedData.length; i++) {
				if (data.nestedData[i].key == (stringMonth + " " + stringDate)) {
					return data.nestedData[i].values.length;
				}
			}
		}
		
		function get(key) {
			return map[key];
		}
		
		function returnShortDate(dateString) {
			var month = dateString.getMonth();
			var day = dateString.getDate();
			//var month =  parseInt(d.substring(5,7)) - 1;
			//var day = parseInt(d.substring(8,10));
			var val = data.formattedMap[month + " " + day];
			return val;
		}
		

		////////////////////////////
		////         THE        ////
		//// beast that is draw ////
		////////////////////////////
		
		
		data.draw = function() {
				if (Object.keys(data.formattedMap).length == 0)  {
					console.log("Something's wrong!  There's a couple options of what that is:  you might not have formatted your data set in which case you would need to run .process() but if you've already called that and it didn't work you might not be passing the right measure string as a parameter.  Or your data just sucks.  ");
				}
				
				
		var margin =  {
				left: 70,
				bottom: 10,
				top: 50,
				right: 50
			};
			
		var height = 200 - margin.bottom - margin.top;
		var width = 1200 - margin.left - margin.right;
		
		var cellSize = 17;
		
		var format = d3.time.format("%Y-%m-%d");
		
		var color = d3.scale.linear().range(["white", data.color])
					  .domain([0, data.dayMax])
					  
		var svg = d3.select("#vis").selectAll("svg")
					.data(d3.range(1900, 1901))
					.enter().append("svg")
					.attr("width", width)
					.attr("height", height)
					.attr("class", "svg")
					.append("g")
					.attr("transform", "translate(" + ((width - cellSize * 52) / 2 - 75) + "," + (height - cellSize * 7 - 1) + ")")			
	
		var tooltip = d3.select("body").append("div")	
					.attr("class", "tooltip")				
					.style("opacity", 0)	
		
		svg.append("text")
			.attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
			.style("text-anchor", "middle")
			
			var rect = svg.selectAll(".day")
						.data(function(d) { 
							return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
						.enter().append("rect")
						.attr("class", "day")
						.attr("width", cellSize)
						.attr("height", cellSize)
						.attr("x", function(d) { return d3.time.weekOfYear(d) * cellSize; })
						.attr("y", function(d) { return d.getDay() * cellSize; })
						.on('mouseover', function(d){
							var month =  parseInt(d.substring(5,7)) - 1;
							var day = parseInt(d.substring(8,10));
							var val = data.formattedMap[month + " " + day];
							console.log(d);
							tooltip.transition()		
								.duration(200)		
								.style("opacity", .9);		
							tooltip.html(data.months[month] + " " + day + ": " + val)	
								.style("left", (d3.event.pageX) + "px")		
								.style("top", (d3.event.pageY - 28) + "px");	
							})					
						.on("mouseout", function(d) {		
							tooltip.transition()		
								.duration(500)		
								.style("opacity", 0);	
				})
						.datum(format);
						
			var legend = svg.selectAll(".legend")
			.data(data.months)
			.enter().append("g")
			.attr("class", "legend")
			.attr("transform", function(d, i) { 
				return "translate(" + (((i+1) * 50)+8) + ",0)"; });
			
			legend.append("text")
					.attr("class", function(d, i) { return data.months[i] })
                    .text(function(d, i) { return data.months[i] })
                    .style("text-anchor", "end")
                    .attr("dy", "-.25em")
                    .attr("transform", function(d, i) { return "translate(" + cellSize*(i*1.5) + " ,0)"});
			
            
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
				
				
							
			rect.style("fill", function(d) { 
					var month =  parseInt(d.substring(5,7)) - 1;
					var day = parseInt(d.substring(8,10));
					var val = data.formattedMap[month + " " + day];
					return color(val)
				})
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