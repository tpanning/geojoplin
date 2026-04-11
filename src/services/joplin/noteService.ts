import joplinClient from './joplinClient';
import { JoplinNote, PaginatedResponse } from './types';

const noteFields = 'id,title,latitude,longitude';
// TODO: Allow the user to specify which tags/notebooks to include in the search, and use that instead of a hardcoded tag.
const geotaggedTag = 'geojoplin-test';

const fetchPage = async (page: number): Promise<PaginatedResponse<JoplinNote>> => {
	return joplinClient.get<PaginatedResponse<JoplinNote>>('/search', {
		query: "tag:" + geotaggedTag,
		type: 'note',
		fields: noteFields,
		page: String(page),
		limit: '100',
	});
};

const isGeotagged = (note: JoplinNote): boolean => {
	return note.latitude !== 0 || note.longitude !== 0;
};

export const fetchGeotaggedNotes = async (): Promise<JoplinNote[]> => {
	const notes: JoplinNote[] = [];
	let page = 1;
	let hasMore = true;

	while (hasMore) {
		const response = await fetchPage(page);
		notes.push(...response.items.filter(isGeotagged));
		hasMore = response.has_more;
		page++;
	}

	return notes;
};
