import React, { useCallback, useEffect, useState } from 'react';
import MapView, { NoteGroup } from './gui/MapView';
import LayerPanel from './gui/LayerPanel';
import TokenDialog from './gui/TokenDialog';
import { fetchGeotaggedNotes } from './services/joplin/noteService';
import { loadToken, saveToken } from './services/joplin/tokenStore';
import { NoteLayer, defaultMarkerColor } from './services/joplin/types';

const App: React.FC = () => {
	const [token, setToken] = useState<string>(loadToken);
	const [layers, setLayers] = useState<NoteLayer[]>([]);
	const [groups, setGroups] = useState<NoteGroup[]>([]);

	const handleToken = (newToken: string) => {
		saveToken(newToken);
		setToken(newToken);
	};

	const fetchLayers = useCallback(async (currentToken: string, currentLayers: NoteLayer[]) => {
		if (currentLayers.length === 0) {
			// No layers defined — fetch all geotagged notes with the default color
			const notes = await fetchGeotaggedNotes(currentToken, '');
			setGroups([{ notes, color: defaultMarkerColor }]);
			return;
		}

		const results = await Promise.all(
			currentLayers.map(async (layer) => {
				const notes = await fetchGeotaggedNotes(currentToken, layer.query);
				return { notes, color: layer.color };
			}),
		);
		setGroups(results);
	}, []);

	useEffect(() => {
		if (!token) return;
		setGroups([]);
		fetchLayers(token, layers)
			.catch((error: unknown) => console.error('Failed to fetch notes:', error));
	}, [token, layers, fetchLayers]);

	if (!token) return <TokenDialog onConfirm={handleToken} />;

	return (
		<div id="geojoplin-app">
			<LayerPanel layers={layers} onLayersChange={setLayers} />
			<div id="map-container">
				<MapView groups={groups} token={token} />
			</div>
		</div>
	);
};

export default App;
