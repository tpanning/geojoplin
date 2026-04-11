import React, { useEffect, useState } from 'react';
import MapView from './gui/MapView';
import { fetchGeotaggedNotes } from './services/joplin/noteService';
import { JoplinNote } from './services/joplin/types';

const App: React.FC = () => {
	const [notes, setNotes] = useState<JoplinNote[]>([]);

	useEffect(() => {
		fetchGeotaggedNotes()
			.then(setNotes)
			.catch((error: unknown) => console.error('Failed to fetch notes:', error));
	}, []);

	return (
		<div id="geojoplin-app">
			<MapView notes={notes} />
		</div>
	);
};

export default App;
