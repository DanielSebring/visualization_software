window.HotMap = (function() {
	var map = function(stringName) {
		var data = {};
		data.title = stringName;
		data.objects = [];
		data.dateColumn;
		data.dateSub1;
		data.dateSub2;
		data.timeSub1;
		data.timeSub2;
		data.dayMax = -Infinity;
		data.dayMin = Infinity;
		data.nestedData = [];
		data.cellSize = 17;
									
		
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
			console.log(this.sub2 + " was sub2 and this is sub1 " + this.sub1);
			return this;
		}
		
		data.setDateColumn = function(dateColumn) {
			this.dateColumn = dateColumn;
			console.log("date column name is " + this.dateColumn);
			return this;
		}
		
		data.formatDate = function(dateString) {
			var dateCol = this.dateColumn;
			var startSub = this.sub1;
			var endSub = this.sub2;
			data.format = d3.time.format(dateString);
			for (var i = 0; i < data.objects.length; i++) {
				var dateFormatted = new Date(data.objects[i][dateCol].substring(startSub, endSub));
				data.objects[i][dateCol] = dateFormatted;
			}
			return this;
		}
		
		
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
					console.log((stringMonth + " " + stringDate) + " has a value of " + data.nestedData[i].values.length)
					//console.log(color(data.nestedData[i].values.length));
					return data.nestedData[i].values.length;
				}
			}
		}
		
		
		data.draw = function() {
				
		var margin =  {
				left: 70,
				bottom: 100,
				top: 50,
				right: 50
			};
			
		var height = 600 - margin.bottom - margin.top;
		var width = 1000 - margin.left - margin.right;
		
		var cellSize = 17;
		
		var percent = d3.format(".1%"),
			format = d3.time.format("%Y-%m-%d");
		


		var svg = d3.select("body").selectAll("svg")
					.data(d3.range(1900, 1901))
					.enter().append("svg")
					.attr("width", width)
					.attr("height", height)
					.attr("class", "svg")
					.append("g")
					.attr("tansform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")")
					
		svg.append("text")
			.attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
			.style("text-anchor", "middle")
			.text(function(d) {return d;});
			
			var rect = svg.selectAll(".day")
						.data(function(d) { 
							
							console.log(d3.time.days(new Date(d , 0 , 1), new Date (d + 1, 0, 1)));
							return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
						.enter().append("rect")
						.attr("class", "day")
						.attr("width", cellSize)
						.attr("height", cellSize)
						.attr("x", function(d) { return d3.time.weekOfYear(d) * cellSize; })
						.attr("y", function(d) { return d.getDay() * cellSize; })
						.datum(format);
						
			rect.append("title")
			.text(function(d) {return d; });
			
			svg.selectAll(".month")
				.data(function(d) {
					//console.log("months ", d3.time.months(new Date(d, 0, 1), new Date(d +1, 0, 1)) );
					return d3.time.months(new Date(d, 0, 1), new Date(d +1, 0, 1)); })
				.enter().append("path")
				.attr("class", "month")
				.attr("d", monthPath);
			
			
			var dayMax = -Infinity;
			var dayMin = Infinity;
			data.nestedData = d3.nest()
				.key(function(d) {					
					return d[data.dateColumn].getMonth() + " " +  d[data.dateColumn].getDate();
					})
				.entries(data.objects);
			console.log("Testing 293530 " , data.nestedData);
			for (var i = 0; i < data.nestedData.length; i++) {
				if (data.nestedData[i]["values"].length > data.dayMax) {
					//console.log("max updated!");
					data.dayMax = data.nestedData[i]["values"].length;
				}
				
			}
			console.log(data.dayMax);
			
			var color = d3.scale.linear().range(["white", '#002b53'])
							.domain([0, data.dayMax])
							
			rect.filter(function(d) {
				console.log("before filtering, d is " + d);
				var testMonth = d.substring(5,7);
				var testDate = d.substring(8,10);
				for (var i = 0; i < data.nestedData.length; i++) {	
					var monthDay = data.nestedData[i]["key"].split(" ");
					if ((monthDay[0] == testMonth) && (monthDay[1] == testDate)) {
						return true;
					}
				}
				return false;
			}).select("title").text(function(d) {return d + "HAHAHAHAHAAHAH"})
				//return dates in data.nestedData.key })
				.style("fill", function(d) { 
					console.log("after filtering, d is" + d);
					var year = parseInt(d.substring(0,4));
					var month =  parseInt(d.substring(5,7)) - 1;
					var day = parseInt(d.substring(8,10));
					//var asDate = new Date(d.substring(0,4), parseInt(d.substring(5,7)) - 1, d.substring(8,10));
					var value = returnValues(month, day);
					console.log("value was " + value);
					console.log(color(value));
					return color(value)
					
				})
				//.select("title")
				//.text(function(d) { return d + ": " + percent(data.nestedData[d]); })
			}
		return data;
	}
	
	



	
	return map;
})();