import L from 'leaflet';
import { MapProvider } from './MapProvider';

export default class LeafletMapProvider implements MapProvider {

	private map: L.Map | null = null;

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

	public destroy(): void {
		if (this.map) {
			this.map.remove();
			this.map = null;
		}
	}

}
