const storageKey = 'geojoplin-token';

export const loadToken = (): string => {
	return localStorage.getItem(storageKey) ?? '';
};

export const saveToken = (token: string): void => {
	localStorage.setItem(storageKey, token);
};
