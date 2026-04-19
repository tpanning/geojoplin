import React, { useEffect, useRef } from 'react';
import { MapProvider } from '../services/map/MapProvider';
import LeafletMapProvider from '../services/map/LeafletMapProvider';
import { JoplinNote } from '../services/joplin/types';
import { defaultIconName } from '../services/map/icons';
import { fetchNoteBody } from '../services/joplin/noteService';
import 'leaflet/dist/leaflet.css';

const defaultLatitude = 0.0;
const defaultLongitude = 0.0;
const defaultZoom = 2;

export interface NoteGroup {
	notes: JoplinNote[];
	color: string;
	icon: string;
}

interface Props {
	groups: NoteGroup[];
	token: string;
}

const MapView: React.FC<Props> = ({ groups, token }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const providerRef = useRef<MapProvider | null>(null);

	useEffect(() => {
		if (!containerRef.current) return undefined;

		const provider = new LeafletMapProvider();
		provider.initialize(containerRef.current);
		provider.setView(defaultLatitude, defaultLongitude, defaultZoom);
		providerRef.current = provider;

		return () => {
			provider.destroy();
			providerRef.current = null;
		};
	}, []);

	useEffect(() => {
		const provider = providerRef.current;
		if (!provider) return;
		provider.clearMarkers();
		for (const group of groups) {
			for (const note of group.notes) {
				provider.addMarker(note.latitude, note.longitude, note.title, note.id, group.color, group.icon ?? defaultIconName, () => fetchNoteBody(token, note.id));
			}
		}
		provider.fitToMarkers();
	}, [groups, token]);

	return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default MapView;
