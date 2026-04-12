import React, { useEffect, useState } from 'react';
import MapView from './gui/MapView';
import TokenDialog from './gui/TokenDialog';
import { fetchGeotaggedNotes } from './services/joplin/noteService';
import { loadToken, saveToken } from './services/joplin/tokenStore';
import { JoplinNote } from './services/joplin/types';

const App: React.FC = () => {
	const [token, setToken] = useState<string>(loadToken);
	const [notes, setNotes] = useState<JoplinNote[]>([]);

	const handleToken = (newToken: string) => {
		saveToken(newToken);
		setToken(newToken);
	};

	useEffect(() => {
		if (!token) return;
		fetchGeotaggedNotes(token)
			.then(setNotes)
			.catch((error: unknown) => console.error('Failed to fetch notes:', error));
	}, [token]);

	if (!token) return <TokenDialog onConfirm={handleToken} />;

	return (
		<div id="geojoplin-app">
			<MapView notes={notes} />
		</div>
	);
};

export default App;
