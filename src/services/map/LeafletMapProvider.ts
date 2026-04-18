import L from 'leaflet';
import { MapProvider } from './MapProvider';

export default class LeafletMapProvider implements MapProvider {

	private map: L.Map | null = null;
	private markers: L.Marker[] = [];

	public initialize(container: HTMLElement): void {
		this.map = L.map(container);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			maxZoom: 19,
		}).addTo(this.map);
	}

	public setView(latitude: number, longitude: number, zoom: number): void {
		if (!this.map) throw new Error('Map not initialized');
		this.map.setView([latitude, longitude], zoom);
	}

	public addMarker(latitude: number, longitude: number, title: string, noteId: string): void {
		if (!this.map) throw new Error('Map not initialized');
		const popupContent = `<a href="joplin://x-callback-url/openNote?id=${noteId}">${title}</a>`;
		const marker = L.marker([latitude, longitude]).addTo(this.map).bindPopup(popupContent);
		this.markers.push(marker);
	}

	public clearMarkers(): void {
		for (const marker of this.markers) {
			marker.remove();
		}
		this.markers = [];
	}

	public fitToMarkers(): void {
		if (!this.map || this.markers.length === 0) return;
		this.map.fitBounds(L.latLngBounds(this.markers.map(marker => marker.getLatLng())), { maxZoom: 14 });
	}

	public destroy(): void {
		if (this.map) {
			this.map.remove();
			this.map = null;
		}
	}

}
