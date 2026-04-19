import { NoteLayer } from './types';
import { defaultIconName } from '../map/icons';

const storageKey = 'geojoplin-layers';

// Normalise a raw parsed object into a valid NoteLayer, filling in defaults for
// any fields that may be absent in saves from earlier versions of the application.
const normaliseLayer = (raw: Record<string, unknown>, index: number): NoteLayer => {
	return {
		id: typeof raw['id'] === 'string' && raw['id'] ? raw['id'] : String(index + 1),
		query: typeof raw['query'] === 'string' ? raw['query'] : '',
		color: typeof raw['color'] === 'string' && raw['color'] ? raw['color'] : '#3b82f6',
		icon: typeof raw['icon'] === 'string' && raw['icon'] ? raw['icon'] : defaultIconName,
	};
};

export const loadLayers = (): NoteLayer[] => {
	try {
		const raw = localStorage.getItem(storageKey);
		if (!raw) return [];
		const parsed: unknown = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		return parsed
			.filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
			.map(normaliseLayer);
	} catch {
		return [];
	}
};

export const saveLayers = (layers: NoteLayer[]): void => {
	localStorage.setItem(storageKey, JSON.stringify(layers));
};
