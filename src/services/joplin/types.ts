export interface JoplinNote {
	id: string;
	title: string;
	latitude: number;
	longitude: number;
}

export interface PaginatedResponse<T> {
	items: T[];
	has_more: boolean;
}
