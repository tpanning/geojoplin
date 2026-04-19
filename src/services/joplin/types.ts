export interface JoplinNote {
	id: string;
	title: string;
	latitude: number;
	longitude: number;
}

export const MarkupLanguage = {
	Markdown: 1,
	Html: 2,
} as const;

export interface NoteBody {
	body: string;
	markup_language: number;
}

export interface PaginatedResponse<T> {
	items: T[];
	has_more: boolean;
}

export interface NoteLayer {
	id: string;
	query: string;
	color: string;
}

export const defaultMarkerColor = '#3b82f6';
