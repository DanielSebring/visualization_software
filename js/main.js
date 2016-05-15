
/*

Each of these is code for a different dataset that I downloaded.  Didn't cherry pick datasets, just found a couple that had Date data and downloaded em.

*/

var heatmap = HotMap("Earthquakes!");
d3.csv("./../data/isc-gem-cat.csv", function(error, newData) {
			console.log(newData);
			heatmap.updateData(newData);
			heatmap.setColor("green");
			heatmap.setDateColumn("date");
			heatmap.substrings(0, 10);
			heatmap.formatData("%Y-%m-%d");
			heatmap.draw();
			
	}); 
	
/*
var heatmap = HotMap("Plane Crashes!");
d3.csv("./../data/Airplane_Crashes_and_Fatalities_Since_1908.csv", function(error, newData) {
				console.log(newData);
				heatmap.updateData(newData);
				heatmap.setColor("red");
				heatmap.setDateColumn("Date");
				heatmap.substrings(0, 10);
				heatmap.formatData("%m/%d/%Y");
				heatmap.draw()
			});
			
*/			

/*			
var heatmap = HotMap("Other Earthquakes?  Good Lord!");		
d3.csv("./../data/all_month.csv", function(error, newData) {
			heatmap.updateData(newData);
			heatmap.setColor("purple");
			heatmap.setDateColumn("time");
			heatmap.substrings(0, 10);
			heatmap.formatData("%Y-%m-%d");
			heatmap.draw()
})
*/
