/* Create a Backbone Collection with a list of locations randomly chosen 
	from a list so the page is less repetitive.
*/


var locationList = _.sample([
	{	radius: 0.35, 
		maxAge: 60, 
		title: "Ferry<br>Building",
		latitude: 37.7951,
		longitude: -122.39838
	},
	{	radius: 0.35, 
		maxAge: 30, 
		title: "Alcatraz<br>Island",
		latitude: 37.8260,
		longitude: -122.4216
	},
	{	radius: 0.25, 
		maxAge: 10, 
		title: "Coit<br>Tower",
		latitude: 37.8024286,
		longitude: -122.4058044
	},
	{	radius: 10, 
		maxAge: 720, 
		title: "Dread &amp;<br>Terror",
		latitude: 43.3529,
		longitude: -122.2727
	},
	{	radius: 2.0, 
		maxAge: 10, 
		title: "Golden<br>Gate Bridge",
		latitude: 37.8223,
		longitude: -122.4791
	},
	{	radius: 2.3, 
		maxAge: 10, 
		title: "Santa Cruz<br>Beaches",
		latitude: 36.9593,
		longitude: -122.0130
	},
	{	radius: 8.0, 
		maxAge: 100, 
		title: "Point<br>Reyes",
		latitude: 38.0039,
		longitude: -122.9975
	},
	{	radius: 3.25, 
		maxAge: 10, 
		title: "Yosemite<br>Park",
		latitude: 37.7314,
		longitude: -119.6118
	},
	{	radius: 15, 
		maxAge: 400, 
		title: "Oregon<br>Trails",
		latitude: 43.7330,
		longitude: -122.6329
	},
	{	radius: 30, 
		maxAge: 10, 
		title: "Mt. St.<br>Helens",
		latitude: 46.2076116,
		longitude: -122.0853704
	},
	{	radius: 3, 
		maxAge: 1, 
		title: "Tahoe Rim<br>Trail",
		latitude: 38.85690,
		longitude: -119.9002
	},
	{	radius: 25, 
		maxAge: 7, 
		title: "Ragged<br>Point",
		latitude: 35.7596892,
		longitude: -121.3277061
	},
	{	radius: 5, 
		maxAge: 20, 
		title: "Mount Rushmore",
		latitude: 43.8813765,
		longitude: -103.4532465
	}
],5);

var locations = new Backbone.Collection(locationList);
