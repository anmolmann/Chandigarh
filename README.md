# Neighborhood Map

A single-page application featuring a map of your neighborhood.

![Map demo](https://github.com/anmolmann/Neighborhood-Map/blob/master/images/project_prototype1.png)

## Quick Start

Application utilizes Google's Map API and at least one additional third-party "data API". All data requests are retrieved in an asynchronous manner. In the event of a failed data retrieval errors are handled gracefully.

Third-party API used: *Wikipedia's API*

Additional functionality included in this application: map markers to identify popular locations or places you’d like to visit, a search function to easily discover these locations, and a listview to support simple browsing of all locations.

Framework Used: [Knockout](http://knockoutjs.com/)
- Knockout is used to handle the list, filter, and any other information on the page that is subject to changing state. Things that are not be handled by Knockout: anything the Maps API is used for, creating markers, tracking click events on markers, making the map, refreshing the map. Note 1: Tracking click events on list items is handled with Knockout. Note 2: Creating your markers as a part of your ViewModel.

## API's Used

#### Google Map API

- Display map markers identifying at least 5 locations that you are interested in within this neighborhood. This app should displays those locations by default when the page is loaded.

- A list view of the set of locations is implemented

- A filter option is that uses an input field to filter both the list view and the map markers displayed by default on load. The list view and the markers are updated accordingly in real time.

#### Wikipedia API

- A functionality is added using third-party APIs to provide information when a map marker or list view entry is clicked. Note that StreetView and Places don't count as an additional 3rd party API because they are libraries included in the Google Maps API.

## Usage

Step-by-Step Guide

	- First Download the project

	- Then open *index.html* file in your browser to view the project

- Clicking a marker on the map should open more information about that location.

- Clicking a name in the list view should open the information window for the associated marker.

- The list of locations should be filterable with a text input or dropdown menu. Filtering the list also filters the markers on the map.

- This web app is also responsive.

![Map demo](https://github.com/anmolmann/Neighborhood-Map/blob/master/images/project_prototype2.png)

### Helpful Resources

- [MediaWikiAPI for Wikipedia](https://www.mediawiki.org/wiki/API:Main_page)
- [Google Maps Street View Service](https://developers.google.com/maps/documentation/javascript/streetview)
- [Google Maps](https://developers.google.com/maps/documentation/)
- [Knockout JS Tutorials](http://learn.knockoutjs.com/)