export interface MapProvider {
	initialize(container: HTMLElement): void;
	setView(latitude: number, longitude: number, zoom: number): void;
	addMarker(latitude: number, longitude: number, title: string): void;
	destroy(): void;
}
