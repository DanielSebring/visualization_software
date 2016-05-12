
	
	//   create heatmap
	var heatmap = HotMap("newMapperoony");
	heatmap.changeName("Heatmap!");
	d3.csv("./../data/Airplane_Crashes_and_Fatalities_Since_1908.csv", function(error, newData) {
				//console.log(error);
				//console.log(newData);
				heatmap.process(newData);
				heatmap.getData();
				heatmap.setDateColumn("Date");
				heatmap.substrings(0, 10);
				// https://github.com/mbostock/d3/wiki/Time-Formatting
				heatmap.formatDate("%m/%d/%Y");
				//console.log(heatmap.getData());
				heatmap.draw();
				
			});
	
	//    heatmap.data('./../data/all_month.csv');


	//    apply heatmap
	// var chartImage = d3.select('#viz')
	// .datum()
	// .call(heatmap)

