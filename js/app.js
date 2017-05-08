var locations = [
{title: 'Sukhna Lake', location: {lat: 30.742138, lng: 76.818756}},
{title: 'Rock Garden', location: {lat: 30.752535, lng: 76.810104}},
{title: 'Rose Garden', location: {lat: 30.746108, lng: 76.781981}},
{title: 'Kasauli', location: {lat: 30.90129, lng: 76.964875}},
{title: 'Chattbir Zoo', location: {lat: 30.603913, lng: 76.792463}},
{title: 'Pinjore Gardens', location: {lat: 30.794088, lng: 76.914711}},
{title: 'Government Museum and Art Gallery', location: {lat: 30.748912, lng: 76.787468}},
{title: 'Elante Mall', location: {lat: 30.705587, lng: 76.80127}},
{title: 'Parrot Bird Sanctuary Chandigarh', location: {lat:  30.728564, lng: 76.779457}},
{title: 'Leisure Valley', location: {lat: 30.752794, lng: 76.792077}},
{title: 'Open Hand Monument', location: {lat: 30.756456, lng: 76.801938}},
{title: 'Nada Sahib', location: {lat: 30.692292, lng: 76.890111}},
{title: 'Morni', location: {lat:  30.705967, lng: 76.975827}}
];

var ViewModel = function() {
	// pointer to outer this
	var self = this;
    this.List = ko.observableArray([]);

    var markers = [];
    var marker;
    var map;
    var placeMarkers = [];

    locations.forEach(function(loc) {
        self.List.push(loc);
    });

    // set the default current location
    this.currentLocation = ko.observable(this.List()[0]);

    ViewModel.prototype.initMap = function() {
        // Constructor creates a new map - only center and zoom are required.
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 30.733315, lng: 76.779418},
            zoom: 13,
            mapTypeControl: false
        });

        map = this.map;

        var largeInfowindow = new google.maps.InfoWindow();

        var defaultIcon = makeMarkerIcon('0091ff');

        var highlightedIcon = makeMarkerIcon('ffff24');

        var bounds = new google.maps.LatLngBounds();

        // The following group uses the location array to create an array of markers on initialize.
        for (var i = 0; i < locations.length; i++) {
            // Get the position from the location array.
            var position = locations[i].location;
            var title = locations[i].title;
            // Create a marker per location, and put into markers array.
            var marker = new google.maps.Marker({
                position: position,
                title: title,
                animation: google.maps.Animation.DROP,
                id: i
            });
            // Push the marker to our array of markers.
            markers.push(marker);
            // Create an onclick event to open the large infowindow at each marker.
            marker.addListener('click', function() {
                populateInfoWindow(this, largeInfowindow);
                this.setAnimation(google.maps.Animation.BOUNCE);
                var m = this;
                setTimeout(function() { 
                    m.setAnimation(null);
                }, 2000);
            });

            marker.addListener('mouseover', function() {
                this.setIcon(highlightedIcon);
            });
            marker.addListener('mouseout', function() {
                this.setIcon(null);
            });
        }

        // This function populates the infowindow when the marker is clicked. We'll only allow
        // one infowindow which will open at the marker that is clicked, and populate based
        // on that markers position.
        function populateInfoWindow(marker, infowindow) {
            // Check to make sure the infowindow is not already opened on this marker.
            if (infowindow.marker != marker) {
                // Clear the infowindow content to give the streetview time to load.
                infowindow.setContent('');
                infowindow.marker = marker;
                // Make sure the marker property is cleared if the infowindow is closed.
                infowindow.addListener('closeclick', function() {
                    if(infowindow.marker != null)
                        infowindow.marker.setAnimation(null);
                    infowindow.marker = null;
                });

                var streetViewService = new google.maps.StreetViewService();
                var radius = 50;

                infowindow.setContent(
                    '<div><h5 class=".h5" id="Title">' + 
                    marker.title + 
                    '</h5></div><div id="wikipedia-links" class="text-left text-info"><p>' + 
                    '</p></div><div id="pano"></div>'
                );

                infowindow.open(map, marker);

                var flag = true;
                var wiki = false;            

                var wikiElem = '';

                var panoramaOptions, heading, nearStreetViewLocation;

                // In case the status is OK, which means the pano was found, compute the
                // position of the streetview image, then calculate the heading, then get a
                // panorama from that and set the options
                function getStreetView(data, status) {
                    if (status == google.maps.StreetViewStatus.OK) {
                        nearStreetViewLocation = data.location.latLng;
                        heading = google.maps.geometry.spherical.computeHeading(
                            nearStreetViewLocation, marker.position
                            );

                        // error handling
                        var errorTimeout = setTimeout(function() {
                            alert("Something went wrong");
                        }, 9000); 
                        clearTimeout(errorTimeout);

                        panoramaOptions = {
                            position: nearStreetViewLocation,
                            pov: {
                                heading: heading,
                                // this changes the angle of camera whether to look up or down
                                pitch: 15
                            }
                        };
                        var panorama = new google.maps.StreetViewPanorama(
                            document.getElementById('pano'), panoramaOptions
                            );
                    } else {
                        infowindow.setContent(
                            '<div><h5 class=".h5" id="Title">' + 
                            marker.title + 
                            '</h5></div><div id="wikipedia-links" class="text-left text-info">'+
                            wikiElem +
                            '</div><div><span class="text-danger">No Street View Found</span></div>'
                        );
                        flag = false;
                    }
                }

                // Use streetview service to get the closest streetview image within
                // 50 meters of the markers position
                streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
                // Open the infowindow on the correct marker.
                infowindow.open(map, marker);

                var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' +
                        marker.title +
                        '&format=json&callback=wikiCallback';

                $.ajax({
                    url:wikiUrl,
                    dataType:"jsonp",
                    //jsonp:"callback", by default, using jsonp as datatype will set the callback function name to callback. so, no need to mention it again.
                    success:function(data) {
                        wiki = true;
                        for(var j = 1; j < data.length; j++) {
                            var articeList = data[j];
                            for(var i = 0; i < articeList.length; i++) {
                                articlestr = articeList[i];
                                if(articlestr.length > wikiElem.length) {
                                    wikiElem = articlestr;
                                }
                            }
                        }
                        
                        if(flag == false) {
                            infowindow.setContent(
                                '<div><h5 class=".h5" id="Title">' + 
                                marker.title + 
                                '</h5></div><div id="wikipedia-links" class="text-left text-info">'+
                                wikiElem + 
                                '</div><div><span class="text-danger">No Street View Found</span></div>'
                            );
                        } else {
                            infowindow.setContent(
                                '<div><h5 class=".h5" id="Title">' + 
                                marker.title + 
                                '</h5></div><div id="wikipedia-links" class="text-left text-info">'+
                                wikiElem +
                                '</div><div id="pano"></div>'
                            );
                            var panorama = new google.maps.StreetViewPanorama(
                                document.getElementById('pano'), panoramaOptions
                            );
                        }
                    }
                }).fail(function(jqXHR, textStatus) {
                    if(jqXHR.status == 0) {
                        alert('You are offline!\n Please check your network.');
                    } else if(jqXHR.status == 404) {
                        alert('HTML Error Callback');
                    }
                    else alert( "Request failed: " + textStatus + "<br>");
                });
            }
        }

        // This function will loop through the markers array and display them all.
        function showListings() {
            // Extend the boundaries of the map for each marker and display the marker
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(map);
                bounds.extend(markers[i].position);
            }
            map.fitBounds(bounds);
        }
        showListings();

    for(var i = 0; i < locations.length; i++) {
        this.List()[i].marker = markers[i];
    }

    function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
                'https://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
                '|40|_|%E2%80%A2',
                new google.maps.Size(21, 34),
                new google.maps.Point(0, 0),
                new google.maps.Point(10, 34),
                new google.maps.Size(21, 34)
            );
            return markerImage;
        }
    };

    this.selectedLocation = function(LocClicked) {
        for(var i = 0; i < self.List().length; i++) {
            var title = self.List()[i].title;
            if(LocClicked.title == title) {
                this.currentLocation = self.List()[i];
            }
        }
        if(!this.marker) alert('Something went wrong!');
        else {
            this.marker.setAnimation(google.maps.Animation.BOUNCE);
            // open an infoWindow when either a location is selected from 
            // the list view or its map marker is selected directly.
            google.maps.event.trigger(this.marker, 'click');
        }
    };

    // add filters
    this.searchedLocation = ko.observable('');

    this.filter = function(value) {
        self.List.removeAll();
        locations.forEach(function(val) {
            var searchQuery = val.title.toLowerCase();
            // find the starting match in every location 
            if(searchQuery.indexOf(value.toLowerCase()) >= 0) {
                self.List.push(val);
            }
        });
    };

    this.filterForMarkers = function(value) {
        locations.forEach(function(val) {
            var temp = val.marker;
            if (temp.setMap(map) !== null) {
                temp.setMap(null);
            }
            var searchQuery = temp.title.toLowerCase();
            if (searchQuery.indexOf(value.toLowerCase()) >= 0) {
                temp.setMap(map);
            }
        });
    };

    this.searchedLocation.subscribe(this.filter);
    this.searchedLocation.subscribe(this.filterForMarkers);
};

mapError = function() {
    // Error handling
    alert("This page cannot be loaded at this time.")
};

var VM = new ViewModel();

// we'll need to tell knockout to apply our bindings to this viewModel
ko.applyBindings(VM);