import L from 'leaflet';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { MapProvider } from './MapProvider';
import { getIconSvgPath, pinIconNames } from './icons';
import { MarkupLanguage, NoteBody } from '../joplin/types';

marked.use({ async: false });

const contentSnippetLength = 500;

const pinIconWidth = 26;
const pinIconHeight = 34;
const circleIconSize = 32;

const createColoredIcon = (color: string, iconName: string): L.DivIcon => {
	const { width: iw, height: ih, path: iconPath } = getIconSvgPath(iconName);

	if (pinIconNames.has(iconName)) {
		const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${pinIconWidth}" height="${pinIconHeight}" viewBox="0 0 ${iw} ${ih}" preserveAspectRatio="xMidYMid meet"><path d="${iconPath}" fill="${color}"/></svg>`;
		return L.divIcon({
			html: svg,
			className: 'geojoplin-marker-icon',
			iconSize: [pinIconWidth, pinIconHeight],
			iconAnchor: [pinIconWidth / 2, pinIconHeight],
			popupAnchor: [0, -pinIconHeight],
		});
	}

	const center = circleIconSize / 2;
	const scale = (circleIconSize * 0.55) / Math.max(iw, ih);
	const ox = center - (iw * scale) / 2;
	const oy = center - (ih * scale) / 2;
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${circleIconSize}" height="${circleIconSize}" viewBox="0 0 ${circleIconSize} ${circleIconSize}"><circle cx="${center}" cy="${center}" r="${center - 0.5}" fill="${color}" stroke="#fff" stroke-width="1"/><g transform="translate(${ox},${oy}) scale(${scale})"><path d="${iconPath}" fill="#fff"/></g></svg>`;
	return L.divIcon({
		html: svg,
		className: 'geojoplin-marker-icon',
		iconSize: [circleIconSize, circleIconSize],
		iconAnchor: [center, center],
		popupAnchor: [0, -center],
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
