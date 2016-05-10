window.HotMap = (function() {
	
	
	var map = function(stringName) {
		var data = {
			title: 'Dataset Title',
			color: 'blue',
			name: stringName
		};
		console.log(data);
		
		
		data.processData = function(dataString) {
			var newData = d3.csv(dataString)
			console.log(newData);
			return this;
		}
		
		return data;
	};
	
	return map;
})();