export interface MapProvider {
	initialize(container: HTMLElement): void;
	setView(latitude: number, longitude: number, zoom: number): void;
	addMarker(latitude: number, longitude: number, title: string, noteId: string): void;
	clearMarkers(): void;
	fitToMarkers(): void;
	destroy(): void;
}
