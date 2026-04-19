import L from 'leaflet';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { MapProvider } from './MapProvider';
import { getIconSvgPath } from './icons';
import { MarkupLanguage, NoteBody } from '../joplin/types';

marked.use({ async: false });

const contentSnippetLength = 500;

const createColoredIcon = (color: string, iconName: string): L.DivIcon => {
	const { width: iw, height: ih, path: iconPath } = getIconSvgPath(iconName);
	const scale = 12 / Math.max(iw, ih);
	const ox = 12.5 - (iw * scale) / 2;
	const oy = 12.5 - (ih * scale) / 2;
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41"><path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 21.9 12.5 41 12.5 41S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0z" fill="${color}" stroke="#fff" stroke-width="1.5"/><g transform="translate(${ox},${oy}) scale(${scale})"><path d="${iconPath}" fill="#fff"/></g></svg>`;
	return L.divIcon({
		html: svg,
		className: 'geojoplin-marker-icon',
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
	});
};

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

	public addMarker(latitude: number, longitude: number, title: string, noteId: string, color: string, iconName: string, fetchBody: () => Promise<NoteBody>): void {
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

		const icon = createColoredIcon(color, iconName);
		const marker = L.marker([latitude, longitude], { icon }).addTo(this.map).bindPopup(container);
		this.markers.push(marker);

		let bodyLoaded = false;
		let bodyLoading = false;
		marker.on('popupopen', () => {
			if (bodyLoaded || bodyLoading) return;
			bodyLoading = true;
			void (async () => {
				try {
					const { body, markup_language } = await fetchBody();
					const snippet = body.length > contentSnippetLength ? `${body.slice(0, contentSnippetLength)}…` : body;
					if (!snippet) {
						bodyEl.textContent = '(empty)';
					} else if (markup_language === MarkupLanguage.Html) {
						bodyEl.innerHTML = DOMPurify.sanitize(snippet);
					} else {
						bodyEl.innerHTML = DOMPurify.sanitize(marked.parse(snippet, { async: false }));
					}
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
