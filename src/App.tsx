import React, { useCallback, useEffect, useRef, useState } from 'react';
import MapView, { NoteGroup } from './gui/MapView';
import LayerPanel from './gui/LayerPanel';
import TokenDialog from './gui/TokenDialog';
import { fetchGeotaggedNotes } from './services/joplin/noteService';
import { loadToken, saveToken } from './services/joplin/tokenStore';
import { loadLayers, saveLayers } from './services/joplin/layerStore';
import { NoteLayer, defaultMarkerColor } from './services/joplin/types';
import { defaultIconName } from './services/map/icons';

const fetchDebounceMs = 400;

const App: React.FC = () => {
	const [token, setToken] = useState<string>(loadToken);
	const [layers, setLayers] = useState<NoteLayer[]>(loadLayers);
	const [groups, setGroups] = useState<NoteGroup[]>([]);
	const [refreshKey, setRefreshKey] = useState(0);
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleLayersChange = (newLayers: NoteLayer[]) => {
		saveLayers(newLayers);
		setLayers(newLayers);
	};

	const handleToken = (newToken: string) => {
		saveToken(newToken);
		setToken(newToken);
	};

	const fetchLayers = useCallback(async (currentToken: string, currentLayers: NoteLayer[]) => {
		if (currentLayers.length === 0) {
			// No layers defined — fetch all geotagged notes with the default color
			const notes = await fetchGeotaggedNotes(currentToken, '');
			setGroups([{ notes, color: defaultMarkerColor, icon: defaultIconName }]);
			return;
		}

		const visibleLayers = currentLayers.filter(l => l.visible);
		if (visibleLayers.length === 0) {
			setGroups([]);
			return;
		}

		const results = await Promise.all(
			visibleLayers.map(async (layer) => {
				const notes = await fetchGeotaggedNotes(currentToken, layer.query);
				return { notes, color: layer.color, icon: layer.icon };
			}),
		);

		// Only render one marker per note — first matching layer wins
		const seenIds = new Set<string>();
		const deduped = results.map(group => {
			const notes = group.notes.filter(n => !seenIds.has(n.id));
			notes.forEach(n => seenIds.add(n.id));
			return { ...group, notes };
		});

		setGroups(deduped);
	}, []);

	useEffect(() => {
		if (!token) return undefined;
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => {
			setGroups([]);
			fetchLayers(token, layers)
				.catch((error: unknown) => console.error('Failed to fetch notes:', error));
		}, fetchDebounceMs);
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, [token, layers, fetchLayers, refreshKey]);

	if (!token) return <TokenDialog onConfirm={handleToken} />;

	return (
		<div id="geojoplin-app">
			<LayerPanel layers={layers} onLayersChange={handleLayersChange} onRefresh={() => setRefreshKey(k => k + 1)} />
			<div id="map-container">
				<MapView groups={groups} token={token} />
			</div>
		</div>
	);
};

export default App;
