import { isGeotagged } from './noteService';
import { JoplinNote } from './types';

const makeNote = (latitude: number, longitude: number): JoplinNote => ({
	id: 'test-id',
	title: 'Test Note',
	latitude,
	longitude,
});

describe('isGeotagged', () => {
	test('returns true when both coordinates are non-zero', () => {
		expect(isGeotagged(makeNote(51.5, -0.09))).toBe(true);
	});

	test('returns true when only latitude is non-zero', () => {
		expect(isGeotagged(makeNote(51.5, 0))).toBe(true);
	});

	test('returns true when only longitude is non-zero', () => {
		expect(isGeotagged(makeNote(0, -0.09))).toBe(true);
	});

	test('returns false when both coordinates are zero', () => {
		expect(isGeotagged(makeNote(0, 0))).toBe(false);
	});

	test.each([
		[undefined, undefined],
		[undefined, 90],
		[-46, undefined],
		[null, null],
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
});
