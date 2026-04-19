import joplinClient from './joplinClient';
import { JoplinNote, NoteBody, PaginatedResponse } from './types';

const noteFields = 'id,title,latitude,longitude';

const fetchSearchPage = async (token: string, query: string, page: number): Promise<PaginatedResponse<JoplinNote>> => {
	const response = await joplinClient.get<PaginatedResponse<JoplinNote>>(token, '/search', {
		query,
		type: 'note',
		fields: noteFields,
		page: String(page),
		limit: '100',
	});
	return {
		...response,
		items: response.items.map((note) => ({
			...note,
			latitude: Number(note.latitude),
			longitude: Number(note.longitude),
		})),
	};
};

const fetchAllPage = async (token: string, page: number): Promise<PaginatedResponse<JoplinNote>> => {
	const response = await joplinClient.get<PaginatedResponse<JoplinNote>>(token, '/notes', {
		fields: noteFields,
		page: String(page),
		limit: '100',
	});
	return {
		...response,
		items: response.items.map((note) => ({
			...note,
			latitude: Number(note.latitude),
			longitude: Number(note.longitude),
		})),
	};
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
		const response = query
			? await fetchSearchPage(token, query, page)
			: await fetchAllPage(token, page);
		notes.push(...response.items.filter(isGeotagged));
		hasMore = response.has_more;
		page++;
	}

	return notes;
};
