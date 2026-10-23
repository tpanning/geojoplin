import { defaultIconName } from '../map/icons';
import { loadLayers, saveLayers } from './layerStore';
import { NoteLayer } from './types';

describe('layer storage', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	test('saves and reloads layers without changing their settings', () => {
		const layers: NoteLayer[] = [
			{ id: 'places', query: 'tag:place', color: '#123456', icon: 'star', visible: false },
		];

		saveLayers(layers);

		expect(loadLayers()).toEqual(layers);
	});

	test('fills missing or invalid fields from older saved layers with defaults', () => {
		localStorage.setItem('geojoplin-layers', JSON.stringify([
			{ id: '', query: 12, color: '', icon: null, visible: 'false' },
		]));

		expect(loadLayers()).toEqual([
			{ id: '1', query: '', color: '#3b82f6', icon: defaultIconName, visible: true },
		]);
	});

	test('skips non-object entries and assigns fallback ids to the normalized list', () => {
		localStorage.setItem('geojoplin-layers', JSON.stringify([
			null,
			'not a layer',
			{ query: 'tag:map', visible: false },
		]));

		expect(loadLayers()).toEqual([
			{ id: '1', query: 'tag:map', color: '#3b82f6', icon: defaultIconName, visible: false },
		]);
	});

	test.each(['{invalid json', JSON.stringify({ id: 'not-an-array' })])(
		'returns an empty list for invalid saved data (%s)', (raw) => {
			localStorage.setItem('geojoplin-layers', raw);
			expect(loadLayers()).toEqual([]);
		},
	);
});
