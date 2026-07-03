View your Joplin notes on a geographical map!

GeoJoplin uses the latitude and longitude properties that are already in Joplin notes to place them on a map.

# Getting Started
You will need [Joplin](https://joplinapp.org) running on the same computer and enable the Web Clipper:

1. Open Joplin
2. Navigate to *Tools > Options* (on Windows and Linux) or *Joplin > Settings* (on Mac).
3. Select the *Web Clipper* on the left menu.
4. Click *Enable web clipper service*.
5. Scroll down to the *Advanced options* section and click *Copy token*
6. Open GeoJoplin
7. Paste the authorisation token when prompted.
8. You should see icons on the map for all notes that have location information.

# Layers
You can use Layers to assign different icons/colors to notes that match different searches. Use the same search notation as the Joplin app, for example, `tag:restaurant family` will match all notes that have been tagged "restaurant" and have the word "family" in the note.

The searches are performed from top to bottom, and a note will get the icon and color of the first layer that it matches.

# Adding location information to notes
This version of GeoJoplin does not edit notes. If you see a note that should be in a different place, you can open it in Joplin by clicking the note's title in the preview. Then, in Joplin click the **i** icon for the note and edit the *Location* field with the correct latitude and longitude.

Then in GeoJoplin, click the *refresh* button (next to the *Add layer* button) to get the update.

# Development
## Code Design
* use the Joplin Data API (https://joplinapp.org/help/api/references/rest_api/) to access the notes
* use an abstraction layer so that the map provider (OpenStreetMap, Google Maps, etc.) can be easily changed
* follow Joplin standards for both the UI and code so that it is easy for users and developers to move between the projects

## Building
To install the prerequisites, run
```
npm install
```
To test locally, run
```
npm run start
```
To build a binary for your current platform in `dist/`, run
```
npm run build
npm run app:dist
```