import joplinClient from './joplinClient';
import { JoplinNote, NoteBody, PaginatedResponse } from './types';

const noteFields = 'id,title,latitude,longitude';

const normaliseCoords = (note: JoplinNote): JoplinNote => ({
	...note,
	latitude: Number(note.latitude),
	longitude: Number(note.longitude),
});

const fetchPage = async (token: string, page: number, query?: string): Promise<PaginatedResponse<JoplinNote>> => {
	const params: Record<string, string> = { fields: noteFields, page: String(page), limit: '100' };
	const endpoint = query ? '/search' : '/notes';
	if (query) {
		params['query'] = query;
		params['type'] = 'note';
	}
	const response = await joplinClient.get<PaginatedResponse<JoplinNote>>(token, endpoint, params);
	return { ...response, items: response.items.map(normaliseCoords) };
};

export const isGeotagged = (note: JoplinNote): boolean => {
	const lat = Number(note.latitude);
	const lon = Number(note.longitude);
	if (!Number.isFinite(lat) || !Number.isFinite(lon)) return false;
	return lat !== 0 || lon !== 0;
};

export const fetchNoteBody = async (token: string, noteId: string): Promise<NoteBody> => {
	return joplinClient.get<NoteBody>(token, `/notes/${noteId}`, { fields: 'body,markup_language' });
};

export const fetchGeotaggedNotes = async (token: string, query: string): Promise<JoplinNote[]> => {
	const notes: JoplinNote[] = [];
	let page = 1;
	let hasMore = true;

	while (hasMore) {
		const response = await fetchPage(token, page, query || undefined);
		notes.push(...response.items.filter(isGeotagged));
		hasMore = response.has_more;
		page++;
	}

	return notes;
};
