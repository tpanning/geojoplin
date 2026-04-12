import React, { useEffect, useState } from 'react';
import MapView from './gui/MapView';
import SearchBar from './gui/SearchBar';
import TokenDialog from './gui/TokenDialog';
import { fetchGeotaggedNotes } from './services/joplin/noteService';
import { loadToken, saveToken } from './services/joplin/tokenStore';
import { JoplinNote } from './services/joplin/types';

const App: React.FC = () => {
	const [token, setToken] = useState<string>(loadToken);
	const [query, setQuery] = useState<string>('');
	const [notes, setNotes] = useState<JoplinNote[]>([]);

	const handleToken = (newToken: string) => {
		saveToken(newToken);
		setToken(newToken);
	};

	useEffect(() => {
		if (!token || !query) return;
		setNotes([]);
		fetchGeotaggedNotes(token, query)
			.then(setNotes)
			.catch((error: unknown) => console.error('Failed to fetch notes:', error));
	}, [token, query]);

	if (!token) return <TokenDialog onConfirm={handleToken} />;

	return (
		<div id="geojoplin-app">
			<SearchBar onSearch={setQuery} />
			<div id="map-container">
				<MapView notes={notes} />
			</div>
		</div>
	);
};

export default App;
