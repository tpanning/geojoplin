export interface MapProvider {
	initialize(container: HTMLElement): void;
	setView(latitude: number, longitude: number, zoom: number): void;
	destroy(): void;
}
