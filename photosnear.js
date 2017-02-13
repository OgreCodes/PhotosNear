/* Search to find images near a series of locations. 
	
	Requires location details from locations.js.
	
	I got a bit carried away.
*/

// Set some contants
var ONE_DAY = 24 * 60 * 60 * 1000;
var flickrRequest = {
    format: "json",
    api_key: "0dc3cd0420b3d31add36e5785a2c08b8",
    method:"flickr.photos.search",
    per_page: 5,
    sort: "date-posted-desc",
    extras: "url_m,url_n, url_z, url_c, url_o" // Add on image URLs 
};

// Cache underscore templates which are stored in the HTML file
var imageTemplate = _.template($("#image-template").html());
var imagePopupTemplate = _.template($("#image-popup-template").html());
var locationTemplate = _.template($("#location-template").html());

// ImageFinder runs searches against for Flickr's image search API and returns results to a callback
var ImageFinder = Backbone.Collection.extend({
	currentPage: 1,
	maxPages: 1,
	url: "https://api.flickr.com/services/rest/?jsoncallback=?",
	parse: function(response) {
		// Grab the current page, and total pages for later use and tell the collection where to find the image objects.
		this.currentPage = response.photos.page;
		this.maxPages = response.photos.pages;
        return response.photos.photo;  
	},
	initialize: function() {
		// Lay out the basic request parameters 
		this.flickrRequest = _.clone(flickrRequest);
	},
	filterByLocation: function(location) {
		// Add location information to the request
		var locationParams = {
			lat: location.get("latitude"),
		    lon: location.get("longitude"),
		    radius: location.get("radius")
		};
		this.flickrRequest = _.extend(this.flickrRequest, locationParams);
	},
	nextPage: function() {
		// 	update the request to pull the next page.
		if ( this.currentPage >= this.maxPage ) {
			return false;
		}
		this.flickrRequest.page = this.currentPage + 1;
		return true;
	},
	fetchImages: function(options) {
		// Apply our parameters to passed options and fetch the results.
		var fetchOptions = _.extend(options, {data: $.param(this.flickrRequest)});
		this.fetch(fetchOptions);
	}
});


// ImageView Displays a single clickable image thumbnail
var ImageView = Backbone.View.extend({
	initialize: function(options) {
		this.render();
		// Bind the load event so we can swap in the new image gracefully.
		this.$('img.new-image').on('load', _.bind(this.revive, this)); 
	},
	events: {
		"click": "clickedImage"
	},
	clickedImage: function() {
		new ImagePopupView({ model: this.model });
	},
	revive: function() {
		this.$("img").fadeIn().removeClass("new-image");
		this.$(".old-image").remove();
	},
	render: function() {
		// sneak the new image on invisible then fade it in so loading isn't janky.
		this.$el.append(imageTemplate({image:this.model}));
	},
	petrify: function() {
		// We don't want to remove the old image from the DOM until the new one is loaded.
		// Turn off any events and grey it out until the new object is loaded.
		this.$("img").addClass("old-image");
		this.undelegateEvents();
		this.unbind();
	}
});

// Pop up the image... wasn't explicitly requested, but kind of required for a gallery.
// When we first load the page drop in the existing thumbnail then swap it out gracefully 
// When we get the full sized image.
var ImagePopupView = Backbone.View.extend({
	className: "full-screen-popup",
	initialize: function() {
		this.render();
		$("body").append(this.$el);
		this.$('img.new-image').on('load', _.bind(this.revive, this)); 
	},
	render: function() {
		// render the popup and return 
		this.$el.html(imagePopupTemplate({ image: this.model }));
		// This ensures the images are visible, centered, and the same size.
		this.$el.css("paddingTop", $(window).scrollTop()+5);
		this.$("img").css("maxWidth", Math.min(800,$(window).width() - 8))
			.css("maxHeight", Math.min(800,$(window).height() - 120));
	},
	events: {
		'click': 'teardown'
	},
	revive: function() {
		this.$("img.thumb").remove();
		this.$("img.new-image").removeClass("new-image");
	},
	teardown: function() {
		// clean up 
		this.remove();
		this.unbind();	
	}
});

// Display a group of images and a location header from a location object.
var LocationView = Backbone.View.extend({
	className: 'd-flex row no-gutters location-container',
	initialize: function() {
		// Render the base view, Add it to the DOM, and call call initialize images
		this.imageViews = [];
		this.render();
		$(".container").append(this.$el);
		this.initializeImages();
	},
	render: function() {
		this.$el.html(locationTemplate({ location: this.model }));
	},
	initializeImages: function() {
		// Create the image collection, set the initial filter and fetch the images.
		this.collection = new ImageFinder();
		this.collection.filterByLocation(this.model);		
		this.fetchImages();
	},
	fetchImages: function() {
		var thisView = this;
		
		this.cleanUpViews();
		
		this.collection.fetchImages({ 
			success: function() { thisView.renderImages() }, 
			error: function() { thisView.errorRender() }
		});
	},
	renderImages: function() {
		// I have explicit "slots" for each image so they don't jump around when loading.
		var thisView = this;
		var nextImageDiv = 1;
		this.collection.each(function(image) {
			thisView.imageViews.push(new ImageView({model: image, el: thisView.$(".image-"+nextImageDiv) }));
			nextImageDiv += 1;
		});
	},	events: {
		"click .next-page": "nextPage",
	},
	nextPage: function(event) {
		event.preventDefault();
		if (this.collection.nextPage()) {
			this.fetchImages();
		} else {
			alert("Oops, last page");
			this.$(".next-page").prop("disabled",true);
		}
		
	},
	renderError: function(collection, response, options) {
		this.$el.append("<div class='alert alert-danger'>Error: " + response + "</div>");
	},

	// Turn off events on the old image views so we don't get multiple images firing at once.
	cleanUpViews: function() {
		_(this.imageViews).each(function(view) {
			view.petrify();
		});
	}
});

	
locations.each(function(location) {
	new LocationView({model: location});
});
