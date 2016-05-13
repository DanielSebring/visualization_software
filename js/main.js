
	
	//   create heatmap
	var heatmap = HotMap("newMapperoony");
	heatmap.changeName("Heatmap!");
	d3.csv("./../data/isc-gem-cat.csv", function(error, newData) {
				console.log(newData);
				heatmap.process(newData);
				heatmap.setColor("green");
				//heatmap.getData();
				// heatmap for planes heatmap.setDateColumn("time");
				// for all_month.csv heatmap.setDateColumn("time");
				heatmap.setDateColumn("date");
				//heatmap for planes heatmap.substrings(0, 10);
				heatmap.substrings(0, 10);
				heatmap.formatData("%Y-%m-%d");
				// for plane crash data heatmap.formatData("%m/%d/%Y");
				// for all_month.csv heatmap.formatData("%Y-%m-%d");
				
				heatmap.draw();
				
			});
	
	//    heatmap.data('./../data/all_month.csv');


	//    apply heatmap
	// var chartImage = d3.select('#viz')
	// .datum()
	// .call(heatmap)

