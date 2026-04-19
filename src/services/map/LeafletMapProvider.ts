import L from 'leaflet';
import { MapProvider } from './MapProvider';

const contentSnippetLength = 500;

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

	public addMarker(latitude: number, longitude: number, title: string, noteId: string, fetchBody: () => Promise<string>): void {
		if (!this.map) throw new Error('Map not initialized');

		const container = document.createElement('div');
		container.className = 'geojoplin-popup';

		const titleEl = document.createElement('a');
		titleEl.href = `joplin://x-callback-url/openNote?id=${noteId}`;
		titleEl.textContent = title;
		container.appendChild(titleEl);

		const bodyEl = document.createElement('div');
		bodyEl.className = 'geojoplin-popup-body';
		bodyEl.textContent = 'Loading…';
		container.appendChild(bodyEl);

		const marker = L.marker([latitude, longitude]).addTo(this.map).bindPopup(container);
		this.markers.push(marker);

		let bodyLoaded = false;
		let bodyLoading = false;
		marker.on('popupopen', () => {
			if (bodyLoaded || bodyLoading) return;
			bodyLoading = true;
			void (async () => {
				try {
					const body = await fetchBody();
					const truncated = body.length > contentSnippetLength ? `${body.slice(0, contentSnippetLength)}…` : body;
					bodyEl.textContent = truncated || '(empty)';
					bodyLoaded = true;
				} catch {
					bodyEl.textContent = 'Failed to load note.';
				} finally {
					bodyLoading = false;
				}
			})();
		});
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
