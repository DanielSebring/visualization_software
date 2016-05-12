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
			var formatD = d3.time.format(dateString);
			for (var i = 0; i < data.objects.length; i++) {
				dateFormatted = new Date(data.objects[i][dateCol].substring(startSub, endSub));
				data.objects[i][dateCol] = dateFormatted;
				console.log(data.objects[i][dateCol]);
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
							
							//console.log(d3.time.days(new Date(d , 0 , 1), new Date (d + 1, 0, 1)));
							
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
					console.log("max updated!");
					data.dayMax = data.nestedData[i]["values"].length;
				}
				
			}
			console.log(data.dayMax);
			
			var color = d3.scale.linear().range(["white", '#002b53'])
							.domain([0, data.dayMax])
							
			console.log(color);
			rect.filter(function(d) {
				console.log("1231533 " + d);
				var testMonth = d.substring(5,7);
				var testDate = d.substring(8,10);
				console.log(testMonth);
				console.log(testDate);
				if (testMonth.substring(0, 1) == "0") {
					testMonth = testMonth.substring(1);
				}
				if (testDate.substring(0, 1) == "0") {
					testDate = testDate.substring(1);
				}
				for (var i = 0; i < data.nestedData.length; i++) {	
				console.log("testMonth " + testMonth);
				console.log("testDate " + testMonth);	
					var monthDay = data.nestedData[i]["key"].split(" ");
				console.log("monthDay " + monthDay);
					if (monthDay[0] == testMonth && monthDay[1] == testDate) {
						console.log( "132132 exists");
						return true;
					}
				}
				console.log("doesn't exist");
				return false;
			})
				//return dates in data.nestedData.key })
				.attr("fill", function(d) { 
					console.log("printing");
					console.log(Date(d));
					console.log("1387642 color: ", color(data.nestedData[Date(d).getMonth()][Date(d).getDate()])());
					return color(data.nestedData[d]); })
				.select("title")
				.text(function(d) { return d + ": " + percent(data.nestedData[d]); })
			}
		return data;
	}
	
	



	
	return map;
})();