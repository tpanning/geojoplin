import { fetchGeotaggedNotes, isGeotagged } from './noteService';
import joplinClient from './joplinClient';
import { JoplinNote, PaginatedResponse } from './types';

jest.mock('./joplinClient', () => ({
	__esModule: true,
	default: { get: jest.fn() },
}));

const makeNote = (latitude: string | number, longitude: string | number): JoplinNote => ({
	id: 'test-id',
	title: 'Test Note',
	// Tests pass strings too, since the API may return them despite the type
	latitude: latitude as number,
	longitude: longitude as number,
});

describe('isGeotagged', () => {
	beforeEach(() => {
		jest.mocked(joplinClient.get).mockReset();
	});

	test.each([
		['51.5', '-0.09'],
		[51.5, -0.09],
		['51.5', 0],
		[51.5, 0],
		[0, '-0.09'],
		[0, -0.09],
	])('returns true when coordinates are valid (%s, %s)', (lat, lon) => {
		expect(isGeotagged(makeNote(lat, lon))).toBe(true);
	});

	test('returns false when both coordinates are zero', () => {
		expect(isGeotagged(makeNote('0', '0'))).toBe(false);
	});

	test.each([
		[undefined, undefined],
		[undefined, 90],
		[-46, undefined],
		[null, null],
		['', ''],
		[null, 0],
		[0, null],
	])('returns false when coordinates are missing (%s, %s)', (lat, lon) => {
		// The API may return null/undefined even though the type says number
		const note = makeNote(lat as unknown as number, lon as unknown as number);
		expect(isGeotagged(note)).toBe(false);
	});

	test.each([
		[NaN, NaN],
		[NaN, 0],
		[0, NaN],
	])('returns false when coordinates are NaN (%s, %s)', (lat, lon) => {
		expect(isGeotagged(makeNote(lat, lon))).toBe(false);
	});

	test('fetches every page and returns only normalized geotagged notes', async () => {
		const firstPage: PaginatedResponse<JoplinNote> = {
			items: [makeNote('51.5', '-0.09'), makeNote('0', '0')],
			has_more: true,
		};
		const secondPage: PaginatedResponse<JoplinNote> = {
			items: [makeNote('48.8', '2.3')],
			has_more: false,
		};
		const mockGet = jest.mocked(joplinClient.get);
		mockGet.mockImplementation(async <T>(_token: string, _path: string, params?: Record<string, string>) => {
			return (params?.['page'] === '1' ? firstPage : secondPage) as T;
		});

		const notes = await fetchGeotaggedNotes('token', '');

		expect(notes).toEqual([
			{ ...makeNote('51.5', '-0.09'), latitude: 51.5, longitude: -0.09 },
			{ ...makeNote('48.8', '2.3'), latitude: 48.8, longitude: 2.3 },
		]);
		expect(mockGet).toHaveBeenNthCalledWith(1, 'token', '/notes', {
			fields: 'id,title,latitude,longitude',
			page: '1',
			limit: '100',
		});
		expect(mockGet).toHaveBeenNthCalledWith(2, 'token', '/notes', {
			fields: 'id,title,latitude,longitude',
			page: '2',
			limit: '100',
		});
	});

	test('uses Joplin search parameters for a non-empty query', async () => {
		const mockGet = jest.mocked(joplinClient.get);
		const page: PaginatedResponse<JoplinNote> = { items: [makeNote(10, 20)], has_more: false };
		mockGet.mockImplementation(async <T>() => page as T);

		await fetchGeotaggedNotes('token', 'tag:camping');

		expect(mockGet).toHaveBeenCalledWith('token', '/search', {
			fields: 'id,title,latitude,longitude',
			page: '1',
			limit: '100',
			query: 'tag:camping',
			type: 'note',
		});
	});

	test('propagates errors from the Joplin client', async () => {
		const error = new Error('Joplin unavailable');
		jest.mocked(joplinClient.get).mockRejectedValue(error);

		await expect(fetchGeotaggedNotes('token', '')).rejects.toBe(error);
	});
});
