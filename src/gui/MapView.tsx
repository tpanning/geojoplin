import React, { useEffect, useRef } from 'react';
import { MapProvider } from '../services/map/MapProvider';
import LeafletMapProvider from '../services/map/LeafletMapProvider';
import 'leaflet/dist/leaflet.css';

const defaultLatitude = 51.505;
const defaultLongitude = -0.09;
const defaultZoom = 13;

const MapView: React.FC = () => {
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

	return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default MapView;
