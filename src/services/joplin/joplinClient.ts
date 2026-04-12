import { discoverPort } from './portDiscovery';

let portPromise: Promise<number> | null = null;

const getBaseUrl = async (): Promise<string> => {
	if (!portPromise) portPromise = discoverPort();
	const port = await portPromise;
	return `http://localhost:${port}`;
};

const get = async <T>(token: string, path: string, params: Record<string, string> = {}): Promise<T> => {
	const url = new URL(`${await getBaseUrl()}${path}`);
	url.searchParams.set('token', token);
	for (const [key, value] of Object.entries(params)) {
		url.searchParams.set(key, value);
	}
	const response = await fetch(url.toString());
	if (!response.ok) {
		const body = await response.text();
		throw new Error(`Joplin API error ${response.status}: ${body}`);
	}
	return response.json() as Promise<T>;
};

export default { get };
