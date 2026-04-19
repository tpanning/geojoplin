import { NoteBody } from '../joplin/types';

export interface MapProvider {
	initialize(container: HTMLElement): void;
	setView(latitude: number, longitude: number, zoom: number): void;
	addMarker(latitude: number, longitude: number, title: string, noteId: string, color: string, icon: string, fetchBody: () => Promise<NoteBody>): void;
	clearMarkers(): void;
	fitToMarkers(): void;
	destroy(): void;
}
