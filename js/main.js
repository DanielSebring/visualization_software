
	
	//   create heatmap
	var heatmap = HotMap("newMapperoony");
	heatmap.changeName("Heatmap!");
	d3.csv("./../data/Airplane_Crashes_and_Fatalities_Since_1908.csv", function(error, newData) {
				heatmap.process(newData);
				heatmap.setColor("purple");
				heatmap.getData();
				heatmap.setDateColumn("Date");
				heatmap.substrings(0, 10);
				heatmap.formatData("%m/%d/%Y");
				heatmap.draw();
				
			});
	
	//    heatmap.data('./../data/all_month.csv');


	//    apply heatmap
	// var chartImage = d3.select('#viz')
	// .datum()
	// .call(heatmap)

