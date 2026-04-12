import React, { useEffect, useRef } from 'react';
import { MapProvider } from '../services/map/MapProvider';
import LeafletMapProvider from '../services/map/LeafletMapProvider';
import { JoplinNote } from '../services/joplin/types';
import 'leaflet/dist/leaflet.css';

const defaultLatitude = 0.0;
const defaultLongitude = 0.0;
const defaultZoom = 2;

interface Props {
	notes: JoplinNote[];
}

const MapView: React.FC<Props> = ({ notes }) => {
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
		if (notes.length === 0) return;
		for (const note of notes) {
			provider.addMarker(note.latitude, note.longitude, note.title);
		}
		provider.fitToMarkers();
	}, [notes]);

	return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default MapView;
