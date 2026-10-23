import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import App from './App';
import MapView from './gui/MapView';
import { fetchGeotaggedNotes } from './services/joplin/noteService';
import { defaultMarkerColor, JoplinNote, NoteLayer } from './services/joplin/types';
import { defaultIconName } from './services/map/icons';

jest.mock('./gui/MapView', () => ({
	__esModule: true,
	default: jest.fn(() => null),
}));

jest.mock('./gui/LayerPanel', () => ({
	__esModule: true,
	default: jest.fn(() => null),
}));

jest.mock('./services/joplin/noteService', () => ({
	fetchGeotaggedNotes: jest.fn(),
}));

const makeNote = (id: string): JoplinNote => ({
	id,
	title: `Note ${id}`,
	latitude: 10,
	longitude: 20,
});

const renderAppAndWaitForFetch = async (): Promise<Root> => {
	const root = createRoot(document.createElement('div'));
	await act(async () => {
		root.render(<App />);
	});
	await act(async () => {
		jest.advanceTimersByTime(400);
	});
	return root;
};

const currentGroups = () => {
	const calls = jest.mocked(MapView).mock.calls;
	return calls[calls.length - 1]?.[0].groups;
};

describe('App layer fetching', () => {
	beforeEach(() => {
		jest.useFakeTimers();
		localStorage.clear();
		localStorage.setItem('geojoplin-token', 'test-token');
		jest.mocked(MapView).mockClear();
		jest.mocked(fetchGeotaggedNotes).mockReset();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	test('fetches all notes with the default style when no layers are configured', async () => {
		const notes = [makeNote('all-notes')];
		jest.mocked(fetchGeotaggedNotes).mockResolvedValue(notes);

		const root = await renderAppAndWaitForFetch();

		try {
			expect(fetchGeotaggedNotes).toHaveBeenCalledWith('test-token', '');
			expect(currentGroups()).toEqual([
				{ notes, color: defaultMarkerColor, icon: defaultIconName },
			]);
		} finally {
			await act(async () => root.unmount());
		}
	});

	test('does not fetch or display notes when every configured layer is hidden', async () => {
		const layers: NoteLayer[] = [
			{ id: 'hidden', query: 'tag:hidden', color: '#123456', icon: 'star', visible: false },
		];
		localStorage.setItem('geojoplin-layers', JSON.stringify(layers));

		const root = await renderAppAndWaitForFetch();

		try {
			expect(fetchGeotaggedNotes).not.toHaveBeenCalled();
			expect(currentGroups()).toEqual([]);
		} finally {
			await act(async () => root.unmount());
		}
	});

	test('assigns duplicate notes to the first matching visible layer', async () => {
		const layers: NoteLayer[] = [
			{ id: 'first', query: 'tag:first', color: '#111111', icon: 'star', visible: true },
			{ id: 'second', query: 'tag:second', color: '#222222', icon: 'house', visible: true },
		];
		localStorage.setItem('geojoplin-layers', JSON.stringify(layers));
		const sharedNote = makeNote('shared');
		const firstNote = makeNote('first-only');
		const secondNote = makeNote('second-only');
		jest.mocked(fetchGeotaggedNotes).mockImplementation(async (_token, query) => (
			query === 'tag:first' ? [sharedNote, firstNote] : [sharedNote, secondNote]
		));

		const root = await renderAppAndWaitForFetch();

		try {
			expect(fetchGeotaggedNotes).toHaveBeenCalledTimes(2);
			expect(currentGroups()).toEqual([
				{ notes: [sharedNote, firstNote], color: '#111111', icon: 'star' },
				{ notes: [secondNote], color: '#222222', icon: 'house' },
			]);
		} finally {
			await act(async () => root.unmount());
		}
	});
});
