View your Joplin notes on a geographical map!

GeoJoplin uses the latitude and longitude properties that are already in Joplin notes to place them on a map.

Design overview:
* use the Joplin Data API (https://joplinapp.org/help/api/references/rest_api/) to access the notes
* use an abstraction layer so that the map provider (OpenStreetMap, Google Maps, etc.) can be easily changed
* follow Joplin standards for both the UI and code so that it is easy for users and developers to move between the projects